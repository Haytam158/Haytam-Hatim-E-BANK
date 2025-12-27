import { useState, useEffect } from 'react'
import { transactionService } from '../../services/transactionService'
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'
import EmptyState from '../ui/EmptyState'
import Pagination from '../ui/Pagination'

export default function TransactionsList({ accountId, rib, refreshKey = 0, className = '' }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
  })

  // Reset to first page when refreshKey changes (new transaction created)
  useEffect(() => {
    if (refreshKey > 0) {
      setCurrentPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  // Fetch transactions when dependencies change
  useEffect(() => {
    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, rib, currentPage, pageSize, refreshKey])

  const fetchTransactions = async () => {
    if (!accountId && !rib) return

    try {
      setLoading(true)
      let data
      if (rib) {
        data = await transactionService.getTransactionsByRib(rib, currentPage, pageSize)
      } else {
        data = await transactionService.getTransactionsByAccount(accountId, currentPage, pageSize)
      }
      
      setTransactions(data.content || [])
      setPaginationInfo({
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
      })
      setError('')
    } catch (err) {
      setError('Échec du chargement des opérations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const icon = (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )

  const header = (
    <h3 className="text-xl font-bold text-white flex items-center gap-2">
      {icon}
      Dernières opérations
    </h3>
  )

  if (loading) {
    return (
      <Card header={header} gradient className={className}>
        <LoadingSpinner size="md" className="h-32" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card header={header} gradient className={className}>
        <ErrorMessage message={error} />
      </Card>
    )
  }

  return (
    <Card header={header} gradient className={className}>
      {transactions.length === 0 ? (
        <EmptyState
          icon={(
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )}
          title="Aucune opération trouvée"
          description="Aucune opération bancaire n'a été effectuée sur ce compte."
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Intitulé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description || transaction.motif || 'Opération bancaire'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        transaction.transactionType === 'CREDIT' || transaction.type === 'CREDIT' || transaction.operationType === 'CREDIT'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.transactionType === 'CREDIT' || transaction.type === 'CREDIT' || transaction.operationType === 'CREDIT' ? 'Crédit' : 'Débit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.transactionDate || transaction.date || transaction.createdAt
                        ? new Date(transaction.transactionDate || transaction.date || transaction.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/D'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      transaction.transactionType === 'CREDIT' || transaction.type === 'CREDIT' || transaction.operationType === 'CREDIT'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {(transaction.transactionType === 'CREDIT' || transaction.type === 'CREDIT' || transaction.operationType === 'CREDIT' ? '+' : '-')}
                      {transaction.amount?.toFixed(2) || '0.00'} MAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginationInfo.totalPages > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                pageSize={pageSize}
                totalElements={paginationInfo.totalElements}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(0)
                }}
              />
            </div>
          )}
        </>
      )}
    </Card>
  )
}

