type MessageBubbleProps = {
  content: string
  imageUrl?: string
  role: 'user' | 'assistant'
}

function MessageBubble({ content, imageUrl, role }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] overflow-hidden rounded-2xl text-sm leading-6 shadow-sm sm:max-w-[70%] ${
          isUser
            ? 'rounded-br-md bg-blue-600 text-white'
            : 'rounded-bl-md bg-gray-100 text-gray-800'
        }`}
      >
        {imageUrl && (
          <img
            alt="Image attached by user"
            className="max-h-64 max-w-full object-contain"
            src={imageUrl}
          />
        )}
        {content && (
          <p className="whitespace-pre-wrap px-4 py-3">{content}</p>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
