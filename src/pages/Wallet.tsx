import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowDownUp, Download, Upload, Copy, Check } from 'lucide-react'
import LogoButton from '../components/LogoButton'
import { multiCurrencyHandler, CURRENCY_CONFIG, NETWORK_CONFIG } from '../utils/multiCurrencyHandler'

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [selectedCurrency, setSelectedCurrency] = useState('USDT')
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum')
  const [amount, setAmount] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [transactionHistory, setTransactionHistory] = useState<any[]>([])
  const [copiedTx, setCopiedTx] = useState<string | null>(null)

  useEffect(() => {
    // Load transaction history
    const history = multiCurrencyHandler.getTransactionHistory(10)
    setTransactionHistory(history)
  }, [])

  const handleDeposit = async () => {
    if (!amount || !userAddress) {
      setMessage('Please fill in all required fields')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const result = await multiCurrencyHandler.processDeposit({
        currency: selectedCurrency,
        amount,
        network: selectedNetwork,
        userAddress,
        timestamp: Date.now(),
      })

      if (result.success) {
        setMessage(result.message)
        setMessageType('success')
        setAmount('')
        // Refresh history
        const history = multiCurrencyHandler.getTransactionHistory(10)
        setTransactionHistory(history)
      } else {
        setMessage(result.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred during deposit')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!amount || !userAddress || !destinationAddress) {
      setMessage('Please fill in all required fields')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const result = await multiCurrencyHandler.processWithdraw({
        currency: selectedCurrency,
        amount,
        network: selectedNetwork,
        userAddress,
        destinationAddress,
        timestamp: Date.now(),
      })

      if (result.success) {
        setMessage(result.message)
        setMessageType('success')
        setAmount('')
        setDestinationAddress('')
        // Refresh history
        const history = multiCurrencyHandler.getTransactionHistory(10)
        setTransactionHistory(history)
      } else {
        setMessage(result.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred during withdrawal')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyTx = (txHash: string) => {
    navigator.clipboard.writeText(txHash)
    setCopiedTx(txHash)
    setTimeout(() => setCopiedTx(null), 2000)
  }

  const availableNetworks = multiCurrencyHandler.getAvailableNetworks(selectedCurrency)
  const fee = activeTab === 'deposit'
    ? multiCurrencyHandler.calculateDepositFee(amount)
    : multiCurrencyHandler.calculateWithdrawFee(amount)
  const netAmount = amount ? multiCurrencyHandler.getNetAmount(amount, fee.percentage) : '0'

  const currencyConfig = CURRENCY_CONFIG[selectedCurrency]

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <LogoButton size="md" />
          <h1 className="text-3xl font-bold">Wallet</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'deposit'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Upload className="w-5 h-5" />
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'withdraw'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Download className="w-5 h-5" />
            Withdraw
          </button>
        </div>

        {/* Main Card */}
        <div className="card max-w-2xl">
          {/* Currency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Select Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              {multiCurrencyHandler.getSupportedCurrencies().map((currency) => (
                <option key={currency} value={currency}>
                  {currency} - {CURRENCY_CONFIG[currency]?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Network Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Select Network</label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              {availableNetworks.map((network) => (
                <option key={network} value={network}>
                  {NETWORK_CONFIG[network]?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
              <span className="absolute right-4 top-3 text-gray-400">{selectedCurrency}</span>
            </div>
          </div>

          {/* Fee Breakdown */}
          {amount && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Amount:</span>
                <span>{amount} {selectedCurrency}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Fee ({fee.percentage}%):</span>
                <span className="text-red-400">-{fee.amount} {selectedCurrency}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
                <span>You will receive:</span>
                <span className="text-primary">{netAmount} {selectedCurrency}</span>
              </div>
            </div>
          )}

          {/* User Address */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Your Wallet Address</label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary text-sm"
            />
          </div>

          {/* Destination Address (Withdraw only) */}
          {activeTab === 'withdraw' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Destination Address</label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary text-sm"
              />
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : messageType === 'error'
                  ? 'bg-red-500/20 border border-red-500 text-red-400'
                  : 'bg-blue-500/20 border border-blue-500 text-blue-400'
              }`}
            >
              {message}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
            disabled={loading || !amount || !userAddress}
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </section>

      {/* Transaction History */}
      {transactionHistory.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Currency</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Network</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.type === 'deposit'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{tx.currency}</td>
                    <td className="px-4 py-3">{tx.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{tx.network}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : tx.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCopyTx(tx.txHash)}
                        className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                      >
                        {copiedTx === tx.txHash ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-xs">{tx.txHash.slice(0, 8)}...</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Supported Currencies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Supported Currencies</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {multiCurrencyHandler.getSupportedCurrencies().map((currency) => {
            const config = CURRENCY_CONFIG[currency]
            const networks = multiCurrencyHandler.getAvailableNetworks(currency)
            return (
              <div key={currency} className="card">
                <div className="text-3xl mb-2">{config?.icon}</div>
                <h3 className="font-semibold mb-1">{currency}</h3>
                <p className="text-sm text-gray-400 mb-3">{config?.name}</p>
                <div className="text-xs text-gray-500">
                  {networks.length} network{networks.length !== 1 ? 's' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
