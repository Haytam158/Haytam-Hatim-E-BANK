import Button from './Button'

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  className = '',
}) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage < 3) {
        // Near the start
        for (let i = 0; i < 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages - 1)
      } else if (currentPage > totalPages - 4) {
        // Near the end
        pages.push(0)
        pages.push('...')
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push(0)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages - 1)
      }
    }
    
    return pages
  }

  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="text-sm text-gray-600">
        Affichage de <span className="font-semibold">{startItem}</span> à{' '}
        <span className="font-semibold">{endItem}</span> sur{' '}
        <span className="font-semibold">{totalElements}</span> résultats
      </div>

      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="!px-3 !py-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              )
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {page + 1}
              </button>
            )
          })}
        </div>

        {/* Next button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="!px-3 !py-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Par page:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  )
}

