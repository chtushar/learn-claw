export const ErrorState: React.FC<{
  message: string
  onRetry: () => void
}> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center gap-5 py-16">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86l-8.58 14.86A1 1 0 002.56 20h18.88a1 1 0 00.85-1.28l-8.58-14.86a1 1 0 00-1.42 0z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#1f1f1f] mb-1">
          Something went wrong
        </h3>
        <p className="text-sm text-[#636363]">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg border border-[#e1e1e1] text-[#636363] hover:text-[#1f1f1f] hover:border-[#cecece] transition-colors text-sm"
      >
        Try again
      </button>
    </div>
  )
}
