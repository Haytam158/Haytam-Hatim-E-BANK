export default function PageHeader({ 
  title, 
  description, 
  icon,
  className = '' 
}) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-4 mb-2">
        {icon && (
          <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

