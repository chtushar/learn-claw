import { useState, useEffect } from 'react'

const messages = [
  'Writing the script...',
  'Planning visual scenes...',
  'Generating voiceover...',
  'Rendering diagrams...',
  'Almost there...',
]

export const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 text-lg animate-pulse">
        {messages[messageIndex]}
      </p>
    </div>
  )
}
