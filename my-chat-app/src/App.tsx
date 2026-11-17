import { useEffect, useRef, useState } from 'react'
import ChatSidebar from './components/ChatSidebar'
import ChatInput from './components/ChatInput'
import MessageBubble from './components/MessageBubble'
import TypingIndicator from './components/TypingIndicator'
import ChatWelcome from './components/ChatWelcome'

type ChatMessage = {
  id: number
  content: string
  imageUrl?: string
  role: 'user' | 'assistant'
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const nextMessageId = useRef(1)
  const replyTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (replyTimer.current !== null) {
        window.clearTimeout(replyTimer.current)
      }
    }
  }, [])

  function handleNewChat() {
    if (replyTimer.current !== null) {
      window.clearTimeout(replyTimer.current)
      replyTimer.current = null
    }

    setMessages([])
    setIsTyping(false)
  }

  function handleSend(message: string, imageUrl?: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextMessageId.current++,
        content: message,
        imageUrl,
        role: 'user',
      },
    ])
    setIsTyping(true)

    replyTimer.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextMessageId.current++,
          content: imageUrl
            ? 'Thanks for sharing the image!'
            : `Thanks for your message! You said: "${message}"`,
          role: 'assistant',
        },
      ])
      setIsTyping(false)
      replyTimer.current = null
    }, 800)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 text-gray-900 md:flex-row">
      <ChatSidebar onNewChat={handleNewChat} />
      <div
        className={`flex min-h-[65vh] min-w-0 flex-1 flex-col md:h-screen ${
          messages.length === 0
            ? 'bg-gradient-to-br from-sky-100 via-indigo-50 to-rose-100'
            : 'bg-gray-50'
        }`}
      >
        <header className="flex justify-end px-5 pt-4">
          <div className="flex w-full max-w-3xl justify-end gap-2">
            <button
              aria-label="Settings"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-gray-600 shadow-sm transition hover:bg-white hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              title="Settings"
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 2.5v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.2-1.4 1.4m-10.6 10.6-1.4 1.4m13.4 0-1.4-1.4M6.7 6.7 5.3 5.3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
            <button
              aria-label="Notifications"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-gray-600 shadow-sm transition hover:bg-white hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              title="Notifications"
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>
        </header>
        <section
          aria-label="Conversation"
          aria-live="polite"
          className={`chat-history-scrollbar-hidden mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-5 py-8 ${
            messages.length === 0 ? 'justify-center' : ''
          }`}
        >
          {messages.length === 0 && (
            <ChatWelcome onSelectSuggestion={handleSend} />
          )}
          {messages.map((message) => (
            <MessageBubble
              content={message.content}
              imageUrl={message.imageUrl}
              key={message.id}
              role={message.role}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </section>

        <footer className="border-t border-gray-200 bg-white px-5 py-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput disabled={isTyping} onSend={handleSend} />
            <p className="mt-2 text-center text-xs text-gray-400">
              This demo replies with a simple confirmation.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default App
