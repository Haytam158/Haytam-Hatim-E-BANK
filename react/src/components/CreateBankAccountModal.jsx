import { useState } from 'react'
import { bankAccountService } from '../services/bankAccountService'
import ErrorMessage from './ui/ErrorMessage'
import Button from './ui/Button'
import Input from './ui/Input'

export default function CreateBankAccountModal({ customer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    rib: '',
    initialAmount: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        customerId: customer.id,
        rib: formData.rib,
        amount: parseFloat(formData.initialAmount) || 0
      }
      await bankAccountService.createBankAccount(data)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Échec de la création du compte bancaire')
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Nouveau compte bancaire
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
          
          <form onSubmit={handleSubmit}>
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

              <ErrorMessage message={error} className="mb-6" />

              <div className="space-y-5">
                <Input
                  id="rib"
                  name="rib"
                  label="RIB"
                  type="text"
                  placeholder="Entrez le RIB"
                  value={formData.rib}
                  onChange={handleChange}
                  required
                  className="font-mono"
                />
                <Input
                  id="initialAmount"
                  name="initialAmount"
                  label="Montant initial (MAD)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.initialAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {loading ? 'Création...' : 'Créer le compte'}
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
