export default function Card({ children, className = '', header, gradient = false }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden ${className}`}>
      {header && (
        <div className={`${gradient ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-50'} px-6 py-4`}>
          {header}
        </div>
      )}
      <div className={header ? 'px-6 py-6' : 'p-6'}>
        {children}
      </div>
    </div>
  )
}

