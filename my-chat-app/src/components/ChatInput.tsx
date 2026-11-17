import { useEffect, useRef, useState, type FormEvent } from 'react'

type ChatInputProps = {
  disabled?: boolean
  onSend: (message: string, imageUrl?: string) => void
}

type SpeechRecognitionEventLike = Event & {
  resultIndex: number
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: Event & { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike
  webkitSpeechRecognition?: new () => SpeechRecognitionLike
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('The selected image could not be read.'))
      }
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error('The selected image could not be read.'))
    }
    reader.readAsDataURL(file)
  })
}

function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [inputError, setInputError] = useState('')
  const imageInput = useRef<HTMLInputElement>(null)
  const messageInput = useRef<HTMLInputElement>(null)
  const imagePreviewUrl = useRef<string | null>(null)
  const speechRecognition = useRef<SpeechRecognitionLike | null>(null)

  useEffect(
    () => () => {
      if (imagePreviewUrl.current) {
        URL.revokeObjectURL(imagePreviewUrl.current)
      }
      speechRecognition.current?.stop()
    },
    [],
  )

  function clearImage() {
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current)
      imagePreviewUrl.current = null
    }
    setImage(null)
    setImagePreview(null)
    if (imageInput.current) {
      imageInput.current.value = ''
    }
  }

  function selectImage(file: File | null) {
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current)
      imagePreviewUrl.current = null
    }
    setImage(file)
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      imagePreviewUrl.current = previewUrl
      setImagePreview(previewUrl)
    } else {
      setImagePreview(null)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()

    if ((!trimmedMessage && !image) || disabled || isSending) {
      return
    }

    setInputError('')
    setIsSending(true)

    try {
      const imageUrl = image ? await readImageAsDataUrl(image) : undefined
      onSend(trimmedMessage, imageUrl)
      setMessage('')
      clearImage()
      messageInput.current?.focus()
    } catch (error) {
      setInputError(
        error instanceof Error ? error.message : 'The image could not be sent.',
      )
    } finally {
      setIsSending(false)
    }
  }

  function handleVoiceInput() {
    if (isListening) {
      speechRecognition.current?.stop()
      return
    }

    const browserWindow = window as SpeechRecognitionWindow
    const SpeechRecognition =
      browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setInputError('Voice input is not supported in this browser.')
      return
    }

    setInputError('')
    const recognition = new SpeechRecognition()
    recognition.lang = navigator.language
    recognition.interimResults = true
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0]?.transcript ?? '')
        .join('')
      setMessage((currentMessage) =>
        currentMessage ? `${currentMessage} ${transcript}` : transcript,
      )
    }
    recognition.onerror = (event) => {
      setInputError(`Voice input failed: ${event.error}.`)
      setIsListening(false)
    }
    recognition.onend = () => {
      setIsListening(false)
      speechRecognition.current = null
    }

    speechRecognition.current = recognition
    setIsListening(true)
    try {
      recognition.start()
    } catch (error) {
      speechRecognition.current = null
      setIsListening(false)
      setInputError(
        error instanceof Error ? error.message : 'Voice input could not start.',
      )
    }
  }

  return (
    <div>
      {image && (
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2">
          <img
            alt="Selected image preview"
            className="h-12 w-12 rounded-lg object-cover"
            src={imagePreview ?? ''}
          />
          <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
            {image.name}
          </p>
          <button
            aria-label="Remove selected image"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            onClick={clearImage}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      )}
      <form
        className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 sm:gap-2"
        onSubmit={handleSubmit}
      >
        <input
          accept="image/*"
          aria-label="Choose an image"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            setInputError('')
            selectImage(event.target.files?.[0] ?? null)
          }}
          ref={imageInput}
          type="file"
        />
        <input
          aria-label="Message"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed sm:px-3"
          disabled={isSending}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message..."
          ref={messageInput}
          value={message}
        />
        <button
          aria-label="Add image"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || isSending}
          onClick={() => imageInput.current?.click()}
          title="Add image or take a photo"
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <rect
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
              width="18"
              x="3"
              y="5"
            />
            <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
            <path
              d="m4 18 5-5 3 3 3-4 5 6"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
        <button
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          aria-pressed={isListening}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${
            isListening
              ? 'bg-red-100 text-red-600'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
          }`}
          disabled={disabled || isSending}
          onClick={handleVoiceInput}
          title={isListening ? 'Stop voice input' : 'Voice input'}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <rect
              height="11"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.8"
              width="6"
              x="9"
              y="3"
            />
            <path
              d="M5 11a7 7 0 0 0 14 0m-7 7v3m-4 0h8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
        <button
          aria-label="Send message"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={
            disabled || isSending || (!message.trim() && !image)
          }
          type="submit"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 3 10.8 13.2M21 3l-6.5 18-3.7-7.8L3 9.5 21 3Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </form>
      {inputError && (
        <p aria-live="polite" className="mt-2 text-sm text-red-600" role="status">
          {inputError}
        </p>
      )}
    </div>
  )
}

export default ChatInput
