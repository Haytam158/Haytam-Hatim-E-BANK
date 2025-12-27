export default function AccountSelector({ accounts, selectedAccountId, onAccountChange, className = '' }) {
  if (!accounts || accounts.length === 0) {
    return null
  }

  if (accounts.length === 1) {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">RIB</label>
        <input
          type="text"
          value={accounts[0].rib}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 font-mono cursor-not-allowed"
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <label htmlFor="account-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Sélectionner un compte
      </label>
      <div className="relative">
        <select
          id="account-select"
          value={selectedAccountId || ''}
          onChange={(e) => onAccountChange(Number(e.target.value))}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
        >
          {accounts.map((account) => (
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
  )
}

