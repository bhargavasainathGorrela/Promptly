function TypingIndicator() {
  return (
    <div aria-label="AI is typing" className="flex justify-start" role="status">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
            key={dot}
            style={{ animationDelay: `${dot * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default TypingIndicator
