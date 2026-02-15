import { useState } from 'react'

const suggestions = [
  'How DNA replication works',
  'Public key cryptography',
  'Why ocean tides happen',
  'How batteries store energy',
  'How neural networks learn',
  'How rocket engines work',
]

export const TopicForm: React.FC<{
  onSubmit: (topic: string) => void
  disabled: boolean
}> = ({ onSubmit, disabled }) => {
  const [topic, setTopic] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onSubmit(topic.trim())
    }
  }

  const handleChipClick = (suggestion: string) => {
    onSubmit(suggestion)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818181]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn?"
          disabled={disabled}
          maxLength={200}
          className="w-full pl-12 pr-28 py-4 rounded-xl border border-[#e1e1e1] bg-white text-[#1f1f1f] placeholder-[#818181] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c80ff]/20 focus:border-[#2c80ff] disabled:opacity-50 text-base"
        />
        <button
          type="submit"
          disabled={disabled || !topic.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#2c80ff] hover:bg-[#106ae7] text-white font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Generate
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => handleChipClick(s)}
            className="px-3 py-1.5 rounded-full border border-[#e1e1e1] text-sm text-[#636363] hover:border-[#2c80ff] hover:text-[#2c80ff] hover:bg-[#e9f3ff] transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
