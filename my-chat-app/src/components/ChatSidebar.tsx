import { useState } from 'react'

type ChatSidebarProps = {
  onNewChat: () => void
}

type HistoryChat = {
  id: string
  title: string
  date: Date
}

function getHistoryChats(): HistoryChat[] {
  const now = new Date()
  const atTime = (daysAgo: number, hour: number, minute: number) => {
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    date.setHours(hour, minute, 0, 0)
    return date
  }

  return [
    { id: 'trip', title: 'Plan a weekend trip', date: atTime(0, 14, 32) },
    { id: 'dinner', title: 'Quick dinner ideas', date: atTime(0, 11, 8) },
    { id: 'typescript', title: 'Understanding TypeScript generics', date: atTime(1, 16, 45) },
    { id: 'workout', title: 'Build a simple workout plan', date: atTime(1, 9, 20) },
    { id: 'portfolio', title: 'Portfolio website inspiration', date: atTime(4, 18, 12) },
    { id: 'books', title: 'Books to read this year', date: atTime(12, 10, 5) },
  ]
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function ChatSidebar({ onNewChat }: ChatSidebarProps) {
  const [search, setSearch] = useState('')
  const historyChats = getHistoryChats()
  const filteredChats = historyChats.filter((chat) =>
    chat.title.toLowerCase().includes(search.trim().toLowerCase()),
  )
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const groups = [
    {
      title: 'Today',
      chats: filteredChats.filter(
        (chat) => chat.date.toDateString() === today.toDateString(),
      ),
    },
    {
      title: 'Yesterday',
      chats: filteredChats.filter(
        (chat) => chat.date.toDateString() === yesterday.toDateString(),
      ),
    },
    {
      title: 'Earlier',
      chats: filteredChats.filter(
        (chat) =>
          chat.date.toDateString() !== today.toDateString() &&
          chat.date.toDateString() !== yesterday.toDateString(),
      ),
    },
  ]

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-slate-950 text-slate-100 md:h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
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
        <div>
          <p className="font-semibold text-white">Chat Assistant</p>
          <p className="text-xs text-slate-400">Your AI workspace</p>
        </div>
      </div>

      <div className="space-y-3 px-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          onClick={onNewChat}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 5v14m-7-7h14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
          New chat
        </button>

        <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-900">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="10.8"
              cy="10.8"
              r="6.8"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m16 16 4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
          <input
            aria-label="Search chat history"
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search history"
            type="search"
            value={search}
          />
        </label>
      </div>

      <nav
        aria-label="Chat history"
        className="chat-history-scrollbar-hidden mt-6 max-h-64 space-y-5 overflow-y-auto px-4 pb-4 md:max-h-none md:flex-1"
      >
        {groups.map(
          (group) =>
            group.chats.length > 0 && (
              <section key={group.title}>
                <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {group.title}
                </h2>
                <ul className="space-y-1">
                  {group.chats.map((chat) => (
                    <li
                      className="rounded-lg px-2 py-2 transition hover:bg-slate-800"
                      key={chat.id}
                    >
                      <p className="truncate text-sm text-slate-200">
                        {chat.title}
                      </p>
                      <time
                        className="mt-1 block text-xs text-slate-500"
                        dateTime={chat.date.toISOString()}
                      >
                        {formatDateTime(chat.date)}
                      </time>
                    </li>
                  ))}
                </ul>
              </section>
            ),
        )}
        {filteredChats.length === 0 && (
          <p className="px-2 text-sm text-slate-400">No matching chats.</p>
        )}
      </nav>

      <div className="m-4 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-blue-950 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">
            ✨
          </span>
          <p className="text-sm font-semibold text-white">
            Upgrade to Premium
          </p>
        </div>
        <p className="mb-3 text-xs leading-5 text-slate-300">
          Get faster responses and more in-depth research.
        </p>
        <button
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          type="button"
        >
          Explore Premium
        </button>
      </div>
    </aside>
  )
}

export default ChatSidebar
