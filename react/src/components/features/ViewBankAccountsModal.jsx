import { useState, useEffect } from 'react'
import { bankAccountService } from '../../services/bankAccountService'
import ErrorMessage from '../ui/ErrorMessage'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import Pagination from '../ui/Pagination'

export default function ViewBankAccountsModal({ customer, onClose, onAddAccount }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('ASC')
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchAccounts()
  }, [customer, currentPage, pageSize, sortBy, sortDir])

  const fetchAccounts = async () => {
    if (customer?.id) {
      try {
        setLoading(true)
        const accountsResponse = await bankAccountService.getBankAccountsByCustomer(
          customer.id, 
          currentPage, 
          pageSize, 
          sortBy, 
          sortDir
        )
        setAccounts(accountsResponse.content || [])
        setPaginationInfo({
          totalElements: accountsResponse.totalElements || 0,
          totalPages: accountsResponse.totalPages || 0,
        })
        setError('')
      } catch (err) {
        setError('Échec du chargement des comptes bancaires')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSort = (field, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (sortBy === field) {
      // Toggle sort direction if clicking on same field
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC')
    } else {
      // Set new sort field and default to ASC
      setSortBy(field)
      setSortDir('ASC')
    }
    setCurrentPage(0) // Reset to first page when sorting
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-200/50">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Comptes bancaires
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-6">
            {customer && (
              <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <p className="text-sm text-gray-600 mb-1">Client:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {customer.firstname} {customer.lastname}
                </p>
                <p className="text-xs text-gray-500 mt-1">ID: {customer.id}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : error ? (
              <ErrorMessage message={error} />
            ) : accounts.length === 0 ? (
              <EmptyState
                icon={(
                  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )}
                title="Aucun compte bancaire"
                description="Ce client n'a pas encore de compte bancaire."
              />
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                          onClick={(e) => handleSort('rib', e)}
                        >
                          <div className="flex items-center gap-2">
                            RIB
                            {sortBy === 'rib' && (
                              <svg 
                                className={`h-4 w-4 ${sortDir === 'ASC' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                          onClick={(e) => handleSort('amount', e)}
                        >
                          <div className="flex items-center gap-2">
                            Solde
                            {sortBy === 'amount' && (
                              <svg 
                                className={`h-4 w-4 ${sortDir === 'ASC' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                          onClick={(e) => handleSort('accountStatus', e)}
                        >
                          <div className="flex items-center gap-2">
                            Statut
                            {sortBy === 'accountStatus' && (
                              <svg 
                                className={`h-4 w-4 ${sortDir === 'ASC' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                          onClick={(e) => handleSort('createdAt', e)}
                        >
                          <div className="flex items-center gap-2">
                            Date de création
                            {sortBy === 'createdAt' && (
                              <svg 
                                className={`h-4 w-4 ${sortDir === 'ASC' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {accounts.map((account) => (
                        <tr key={account.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-mono font-semibold text-gray-900">
                              {account.rib}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-lg font-bold text-indigo-600">
                              {account.amount?.toFixed(2) || '0.00'} MAD
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              account.accountStatus === 'OPENED'
                                ? 'bg-green-100 text-green-800'
                                : account.accountStatus === 'CLOSED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {account.accountStatus === 'OPENED' ? 'Ouvert' : 
                               account.accountStatus === 'CLOSED' ? 'Fermé' : 
                               'Bloqué'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {account.createdAt
                              ? new Date(account.createdAt).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'N/D'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && paginationInfo.totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
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

          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
            {onAddAccount && (
              <Button
                type="button"
                onClick={onAddAccount}
                variant="primary"
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un compte
                </span>
              </Button>
            )}
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

