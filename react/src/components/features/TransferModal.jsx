import { useState, useEffect } from 'react'
import { transactionService } from '../../services/transactionService'
import { bankAccountService } from '../../services/bankAccountService'
import ErrorMessage from '../ui/ErrorMessage'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useAuth } from '../../context/AuthContext'
import { clientService } from '../../services/clientService'

export default function TransferModal({ accounts: initialAccounts, onClose, onSuccess }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    sourceRib: '',
    destinationRib: '',
    amount: 0,
    motif: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [allAccounts, setAllAccounts] = useState([])

  useEffect(() => {
    // Fetch all accounts for the dropdown (using large page size)
    const fetchAllAccounts = async () => {
      try {
        const customerData = await clientService.getCustomerByUserId(user.userId)
        if (customerData?.id) {
          const accountsResponse = await bankAccountService.getBankAccountsByCustomer(customerData.id, 0, 100)
          setAllAccounts(accountsResponse.content || [])
          
          // Set default account (backend should return accounts sorted by most recently active first)
          if (accountsResponse.content && accountsResponse.content.length > 0) {
            const defaultAccount = accountsResponse.content[0] // First account is the most recently active (sorted by backend)
            setSelectedAccount(defaultAccount)
            setFormData(prev => ({ ...prev, sourceRib: defaultAccount.rib }))
          }
        }
      } catch (err) {
        console.error('Error fetching all accounts:', err)
        // Fallback to initial accounts if available
        if (initialAccounts && initialAccounts.length > 0) {
          setAllAccounts(initialAccounts)
          const defaultAccount = initialAccounts[0]
          setSelectedAccount(defaultAccount)
          setFormData(prev => ({ ...prev, sourceRib: defaultAccount.rib }))
        }
      }
    }
    fetchAllAccounts()
  }, [user, initialAccounts])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAccountChange = (accountId) => {
    const account = allAccounts.find(acc => acc.id === accountId)
    if (account) {
      setSelectedAccount(account)
      setFormData(prev => ({ ...prev, sourceRib: account.rib }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate account is not blocked or closed
      if (selectedAccount.accountStatus !== 'OPENED') {
        setError('Le compte bancaire ne doit pas être bloqué ou clôturé')
        setLoading(false)
        return
      }

      // Validate balance is sufficient
      if (selectedAccount.amount < parseFloat(formData.amount)) {
        setError('Le solde du compte doit être supérieur au montant du virement')
        setLoading(false)
        return
      }

      const data = {
        sourceRib: formData.sourceRib,
        destinationRib: formData.destinationRib,
        amount: parseFloat(formData.amount),
        motif: formData.motif
      }
      
      await transactionService.createTransfer(data)
      onSuccess()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Échec du virement'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200/50">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Nouveau virement
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
          
          <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
            {selectedAccount && (
              <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <p className="text-sm text-gray-600 mb-1">Compte source:</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">
                  {selectedAccount.rib}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Solde disponible: <span className="font-semibold text-indigo-600">{selectedAccount.amount?.toFixed(2) || '0.00'} MAD</span>
                </p>
              </div>
            )}

            <ErrorMessage message={error} className="mb-6" />

            <div className="space-y-5">
              {allAccounts && allAccounts.length > 1 ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">RIB source</label>
                  <div className="relative">
                    <select
                      name="sourceRib"
                      value={selectedAccount?.id || ''}
                      onChange={(e) => handleAccountChange(Number(e.target.value))}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono appearance-none bg-white"
                      required
                    >
                      {allAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.rib} - {account.amount?.toFixed(2) || '0.00'} MAD
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <Input
                  id="sourceRib"
                  name="sourceRib"
                  label="RIB source"
                  type="text"
                  value={formData.sourceRib}
                  onChange={handleChange}
                  required
                  disabled
                  className="font-mono bg-gray-100"
                />
              )}

              <Input
                id="destinationRib"
                name="destinationRib"
                label="RIB destinataire"
                type="text"
                placeholder="Entrez le RIB du destinataire"
                value={formData.destinationRib}
                onChange={handleChange}
                required
                className="font-mono"
              />

              <Input
                id="amount"
                name="amount"
                label="Montant (MAD)"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />

              <div>
                <label htmlFor="motif" className="block text-sm font-semibold text-gray-700 mb-2">
                  Motif
                </label>
                <textarea
                  id="motif"
                  name="motif"
                  rows="3"
                  placeholder="Raison du virement"
                  value={formData.motif}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 mt-6 sm:flex sm:flex-row-reverse gap-3">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {loading ? 'Traitement...' : 'Valider le virement'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

