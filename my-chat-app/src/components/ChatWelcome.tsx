type ChatWelcomeProps = {
  onSelectSuggestion: (message: string) => void
}

const suggestions = [
  {
    title: 'Explore a subject',
    description:
      'Discover new topics, learn something interesting, and follow your curiosity.',
    prompt: "Help me explore a subject I'm curious about.",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4.5 9h15M4.5 15h15M12 4c2 2.2 3 4.9 3 8s-1 5.8-3 8c-2-2.2-3-4.9-3-8s1-5.8 3-8Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: 'Find an answer',
    description:
      'Get clear explanations, useful ideas, and step-by-step help with questions.',
    prompt: 'Help me find an answer to a question.',
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="m16 16 4 4m-9-9 2-2a2 2 0 1 0-3.5-1.3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    title: 'Set your preferences',
    description:
      'Choose a tone, detail level, and response style that works best for you.',
    prompt: "I'd like to set my response preferences.",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M5 7h14M5 12h14M5 17h14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <circle cx="9" cy="7" r="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="17" r="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

function ChatWelcome({ onSelectSuggestion }: ChatWelcomeProps) {
  return (
    <div className="w-full py-4">
      <div className="mx-auto mb-8 max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <svg
            aria-hidden="true"
            className="h-9 w-9"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 13v-1a8 8 0 0 1 16 0v1"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <rect
              height="7"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
              width="4"
              x="3"
              y="12"
            />
            <rect
              height="7"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
              width="4"
              x="17"
              y="12"
            />
            <path
              d="M17 17h-2.5a2.5 2.5 0 0 0-2.5 2.5V20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Welcome to your chatbot
        </h2>
        <p className="mt-2 text-lg font-medium text-blue-700">
          Your personal AI companion
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
          Explore new subjects, find clear answers, or tell me how you like to
          learn. Choose a starting point below, or ask me anything.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {suggestions.map((suggestion) => (
          <button
            className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            key={suggestion.title}
            onClick={() => onSelectSuggestion(suggestion.prompt)}
            type="button"
          >
            <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              {suggestion.icon}
            </span>
            <span className="block text-sm font-semibold text-gray-900">
              {suggestion.title}
            </span>
            <span className="mt-1 block text-xs leading-5 text-gray-500">
              {suggestion.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatWelcome
