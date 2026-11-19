import { GoogleGenAI, type Content } from '@google/genai'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type ChatMessage = {
  role: 'user' | 'assistant' | 'model' | 'system'
  content: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }

  const messages: ChatMessage[] = []

  for (const message of value) {
    if (
      !isRecord(message) ||
      typeof message.content !== 'string' ||
      !['user', 'assistant', 'model', 'system'].includes(
        message.role as string,
      )
    ) {
      return null
    }

    messages.push({
      role: message.role as ChatMessage['role'],
      content: message.content,
    })
  }

  return messages
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!isRecord(req.body)) {
    res.status(400).json({ error: 'Request body must be an object' })
    return
  }

  const messages = parseMessages(req.body.messages)
  if (!messages || !messages.some((message) => message.role !== 'system')) {
    res.status(400).json({
      error:
        'messages must include a user or assistant message with string content',
    })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured' })
    return
  }

  const systemInstruction = messages
    .filter((message) => message.role === 'system')
    .map((message) => message.content)
    .join('\n')
  const contents: Content[] = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : message.role,
      parts: [{ text: message.content }],
    }))

  try {
    const ai = new GoogleGenAI({ apiKey })
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
      ...(systemInstruction ? { config: { systemInstruction } } : {}),
    })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ content: chunk.text })}\n\n`)
      }
    }

    res.end()
  } catch (error) {
    console.error('Gemini chat stream failed:', error)

    if (res.headersSent) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Gemini chat stream failed' })}\n\n`)
      res.end()
      return
    }

    res.status(500).json({ error: 'Gemini chat stream failed' })
  }
}
