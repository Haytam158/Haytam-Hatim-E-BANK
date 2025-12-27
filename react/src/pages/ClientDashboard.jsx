import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { clientService } from '../services/clientService'
import { bankAccountService } from '../services/bankAccountService'
import PageHeader from '../components/layout/PageHeader'
import AccountSelector from '../components/features/AccountSelector'
import TransactionsList from '../components/features/TransactionsList'
import TransferModal from '../components/features/TransferModal'
import BotpressChat from '../components/features/BotpressChat'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import Card from '../components/ui/Card'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [customer, setCustomer] = useState(null)
  const [accounts, setAccounts] = useState([]) // All accounts for dropdown
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const customerData = await clientService.getCustomerByUserId(user.userId)
        setCustomer(customerData)

        if (customerData.id) {
          // Fetch all accounts for dropdown
          const accountsResponse = await bankAccountService.getBankAccountsByCustomer(customerData.id, 0, 100)
          setAccounts(accountsResponse.content || [])
          if (accountsResponse.content && accountsResponse.content.length > 0) {
            const defaultAccount = accountsResponse.content[0]
            setSelectedAccountId(defaultAccount.id)
            setSelectedAccount(defaultAccount)
          }
        }
      } catch (err) {
        setError('Échec du chargement des données')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.userId) {
      fetchData()
    }
  }, [user])

  const handleAccountChange = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId)
    setSelectedAccountId(accountId)
    setSelectedAccount(account)
  }

  const handleTransferSuccess = () => {
    setShowTransferModal(false)
    // Refresh accounts and transactions
    const fetchData = async () => {
      if (customer?.id) {
        const accountsResponse = await bankAccountService.getBankAccountsByCustomer(customer.id, 0, 100)
        setAccounts(accountsResponse.content || [])
        const updatedAccount = accountsResponse.content.find(acc => acc.id === selectedAccountId)
        if (updatedAccount) {
          setSelectedAccount(updatedAccount)
        }
        // Force transactions list to refresh
        setTransactionsRefreshKey(prev => prev + 1)
      }
    }
    fetchData()
  }

  const icon = (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )

  if (loading) {
    return <LoadingSpinner size="md" className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} className="m-4" />
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <PageHeader
        icon={icon}
        title="Tableau de bord"
        description="Consultez vos comptes et opérations bancaires"
      />

      {/* Account Selection */}
      {accounts.length > 0 && (
        <div className="mb-6">
          <AccountSelector
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountChange={handleAccountChange}
          />
        </div>
      )}

      {/* Account Balance Card */}
      {selectedAccount && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">RIB</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {selectedAccount.rib}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Solde du compte</p>
              <p className="text-2xl font-bold text-indigo-600">
                {selectedAccount.amount?.toFixed(2) || '0.00'} MAD
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Transfer Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowTransferModal(true)}
          variant="primary"
          disabled={!selectedAccount || selectedAccount.accountStatus !== 'OPENED'}
        >
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Nouveau virement
          </span>
        </Button>
      </div>

      {/* Transactions List */}
      {selectedAccount && (
        <TransactionsList
          accountId={selectedAccount.id}
          rib={selectedAccount.rib}
          refreshKey={transactionsRefreshKey}
        />
      )}

      {/* Chatbot Widget Flottant */}
      <BotpressChat />

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          accounts={accounts}
          onClose={() => setShowTransferModal(false)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  )
}

