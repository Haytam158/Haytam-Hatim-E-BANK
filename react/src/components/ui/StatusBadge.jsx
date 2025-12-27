export default function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    OPENED: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Ouvert'
    },
    CLOSED: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Fermé'
    },
    SUSPENDED: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Bloqué'
    }
  }

  const config = statusConfig[status] || statusConfig.SUSPENDED

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  )
}

