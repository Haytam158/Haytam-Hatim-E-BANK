export default function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      {title && (
        <p className="text-gray-500 font-medium">{title}</p>
      )}
      {description && (
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}

