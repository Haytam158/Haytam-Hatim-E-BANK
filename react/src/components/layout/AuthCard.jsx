export default function AuthCard({ 
  icon, 
  title, 
  subtitle, 
  children,
  className = '' 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      <div className={`max-w-md w-full space-y-8 p-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 relative z-10 ${className}`}>
        <div className="text-center">
          {icon && (
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-4xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-white/70">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

