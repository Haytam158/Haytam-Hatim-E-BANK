export default function ErrorMessage({ message, className = '' }) {
  if (!message) return null

  return (
    <div className={`rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/30 p-4 ${className}`}>
      <div className="text-sm text-red-600 flex items-center gap-2">
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        {message}
      </div>
    </div>
  )
}

