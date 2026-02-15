export const ErrorState: React.FC<{
  message: string
  onRetry: () => void
}> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-red-400 text-lg">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
