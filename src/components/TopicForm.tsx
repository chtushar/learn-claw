import { useState } from 'react'

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn? e.g. How does TCP/IP work?"
          disabled={disabled}
          maxLength={200}
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !topic.trim()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate
        </button>
      </div>
    </form>
  )
}
