import { useState, useEffect, useCallback } from 'react'
import { clientService } from '../services/clientService'
import { bankAccountService } from '../services/bankAccountService'
import CreateCustomerModal from './CreateCustomerModal'
import CreateBankAccountModal from './CreateBankAccountModal'
import ViewBankAccountsModal from './features/ViewBankAccountsModal'
import Button from './ui/Button'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorMessage from './ui/ErrorMessage'
import EmptyState from './ui/EmptyState'
import Card from './ui/Card'
import Pagination from './ui/Pagination'

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBankAccountModal, setShowBankAccountModal] = useState(false)
  const [showViewAccountsModal, setShowViewAccountsModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('ASC')
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
  })

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await clientService.getCustomersPaginated({
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
      })
      const customersList = data.content || []
      
      // Vérifier les comptes bancaires pour chaque client pour corriger hasBankAccount
      // Le backend peut parfois renvoyer hasBankAccount: false même si le client a des comptes
      const customersWithVerifiedAccounts = await Promise.all(
        customersList.map(async (customer) => {
          try {
            // Vérifier si le client a des comptes bancaires
            const accountsResponse = await bankAccountService.getBankAccountsByCustomer(customer.id, 0, 1)
            const hasAccounts = accountsResponse.content && accountsResponse.content.length > 0
            return {
              ...customer,
              hasBankAccount: hasAccounts
            }
          } catch (err) {
            // En cas d'erreur, garder la valeur du backend
            console.warn(`Erreur lors de la vérification des comptes pour le client ${customer.id}:`, err)
            return customer
          }
        })
      )
      
      setCustomers(customersWithVerifiedAccounts)
      setPaginationInfo({
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
      })
      setError('')
    } catch (err) {
      setError('Échec du chargement des clients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, sortBy, sortDir])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(0) // Reset to first page when changing page size
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

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientService.deleteCustomerByUserId(userId)
        fetchCustomers()
      } catch (err) {
        alert('Échec de la suppression du client')
        console.error(err)
      }
    }
  }

  const handleCustomerCreated = () => {
    setShowCreateModal(false)
    // Reset to first page and refresh
    setCurrentPage(0)
    fetchCustomers()
  }

  const handleCustomerSelect = (customer) => {
    if (selectedCustomerId === customer.id) {
      // Deselect if clicking the same customer
      setSelectedCustomerId(null)
      setSelectedCustomer(null)
    } else {
      setSelectedCustomerId(customer.id)
      setSelectedCustomer(customer)
    }
  }

  const handleViewAccounts = () => {
    if (selectedCustomer) {
      setShowViewAccountsModal(true)
    }
  }

  const handleViewAccountsClose = () => {
    setShowViewAccountsModal(false)
  }

  const handleViewAccountsAddAccount = () => {
    setShowViewAccountsModal(false)
    setShowBankAccountModal(true)
  }

  const handleAddAccount = () => {
    if (selectedCustomer) {
      setShowBankAccountModal(true)
    }
  }

  const handleDeleteSelected = () => {
    if (selectedCustomer) {
      handleDelete(selectedCustomer.userId)
      setSelectedCustomerId(null)
      setSelectedCustomer(null)
    }
  }

  const handleBankAccountCreated = () => {
    setShowBankAccountModal(false)
    // Keep selection but refresh customers to update hasBankAccount status
    fetchCustomers()
  }

  if (loading) {
    return <LoadingSpinner size="md" className="h-64" />
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter nouveau client
            </span>
          </Button>
        </div>

        {/* Action buttons - always visible */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border mb-4 transition-all duration-200 ${
          selectedCustomer 
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          {selectedCustomer ? (
            <>
              <div className="flex items-center gap-2 flex-1">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {selectedCustomer.firstname?.[0]}{selectedCustomer.lastname?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedCustomer.firstname} {selectedCustomer.lastname}
                  </p>
                  <p className="text-xs text-gray-500">Client sélectionné</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleViewAccounts}
                  variant="secondary"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir comptes
                  </span>
                </Button>
                <Button
                  onClick={handleAddAccount}
                  variant="primary"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter compte
                  </span>
                </Button>
                <Button
                  onClick={handleDeleteSelected}
                  variant="danger"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </span>
                </Button>
                <button
                  onClick={() => {
                    setSelectedCustomerId(null)
                    setSelectedCustomer(null)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                  title="Désélectionner"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Aucun client sélectionné
                  </p>
                  <p className="text-xs text-gray-500">Sélectionnez un client dans le tableau pour effectuer une action</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleViewAccounts}
                  variant="secondary"
                  size="sm"
                  disabled
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir comptes
                  </span>
                </Button>
                <Button
                  onClick={handleAddAccount}
                  variant="primary"
                  size="sm"
                  disabled
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter compte
                  </span>
                </Button>
                <Button
                  onClick={handleDeleteSelected}
                  variant="danger"
                  size="sm"
                  disabled
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <ErrorMessage message={error} className="mb-6" />

      {showCreateModal && (
        <CreateCustomerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCustomerCreated}
        />
      )}

      {showBankAccountModal && selectedCustomer && (
        <CreateBankAccountModal
          customer={selectedCustomer}
          onClose={() => {
            setShowBankAccountModal(false)
            setSelectedCustomer(null)
          }}
          onSuccess={handleBankAccountCreated}
        />
      )}

      {showViewAccountsModal && selectedCustomer && (
        <ViewBankAccountsModal
          customer={selectedCustomer}
          onClose={handleViewAccountsClose}
          onAddAccount={handleViewAccountsAddAccount}
        />
      )}

      <Card>
        {customers.length === 0 ? (
          <EmptyState
            icon={(
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
            title="Aucun client trouvé"
            description="Créez votre premier client pour commencer"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={(e) => handleSort('id', e)}
                  >
                    <div className="flex items-center gap-2">
                      ID
                      {sortBy === 'id' && (
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
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={(e) => handleSort('firstname', e)}
                  >
                    <div className="flex items-center gap-2">
                      Nom
                      {sortBy === 'firstname' && (
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={(e) => handleSort('birthdate', e)}
                  >
                    <div className="flex items-center gap-2">
                      Date de naissance
                      {sortBy === 'birthdate' && (
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Référence d'identité
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Adresse postale
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Compte bancaire
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {customers.map((customer, index) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => handleCustomerSelect(customer)}
                    className={`cursor-pointer transition-all duration-150 ${
                      selectedCustomerId === customer.id
                        ? 'bg-indigo-100 border-l-4 border-indigo-600'
                        : 'hover:bg-indigo-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      #{customer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {customer.firstname?.[0]}{customer.lastname?.[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstname} {customer.lastname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.email || <span className="text-gray-400">N/D</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.birthdate
                        ? new Date(customer.birthdate).toLocaleDateString()
                        : <span className="text-gray-400">N/D</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {customer.identityRef}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.postalAddress || <span className="text-gray-400">N/D</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.hasBankAccount ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Oui
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Non
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {paginationInfo.totalPages > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={paginationInfo.totalPages}
            pageSize={pageSize}
            totalElements={paginationInfo.totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  )
}

