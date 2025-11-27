import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import {
  calculateBridgeAmount,
  formatTokenDisplay,
  getSupportedBridgeTokens,
  getToken,
  isImageIcon,
} from '../utils/tokenConfig'
import TokenIcon from '../components/TokenIcon'
import LogoButton from '../components/LogoButton'

export default function Bridge() {
  const [fromNetwork, setFromNetwork] = useState('ethereum')
  const [toNetwork, setToNetwork] = useState('bsc')
  const [token, setToken] = useState('USDTz')
  const [amount, setAmount] = useState('')

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: 'from-purple-600 to-purple-800' },
    { id: 'bsc', name: 'BSC', icon: '🟡', color: 'from-yellow-600 to-yellow-800' },
    { id: 'polygon', name: 'Polygon', icon: '🟣', color: 'from-purple-600 to-purple-800' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', color: 'from-blue-600 to-blue-800' },
    { id: 'optimism', name: 'Optimism', icon: '🔴', color: 'from-red-600 to-red-800' },
    { id: 'base', name: 'Base', icon: '⚪', color: 'from-gray-600 to-gray-800' },
    { id: 'avalanche', name: 'Avalanche', icon: '🔺', color: 'from-red-600 to-red-800' },
  ]

  const supportedTokens = getSupportedBridgeTokens()

  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    if (fromNetwork === toNetwork) {
      alert('Please select different networks')
      return
    }
    alert(
      `Bridge initiated: ${amount} ${token} from ${networks.find((n) => n.id === fromNetwork)?.name} to ${networks.find((n) => n.id === toNetwork)?.name}`
    )
  }

  const result = amount ? calculateBridgeAmount(amount, token) : null
  const fromNetworkData = networks.find((n) => n.id === fromNetwork)
  const toNetworkData = networks.find((n) => n.id === toNetwork)
  const tokenData = getToken(token)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <LogoButton size="md" />
          <div>
            <h1 className="text-4xl font-bold">Cross-Chain Bridge</h1>
            <p className="text-gray-400">Bridge your assets across 7 major blockchains</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bridge Form */}
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-semibold mb-6">Bridge Assets</h2>

            <div className="space-y-6">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Token</label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary cursor-pointer"
                >
                {supportedTokens.map((t) => {
                  const icon = getToken(t)?.icon
                  const isImg = isImageIcon(icon || '')
                  return (
                    <option key={t} value={t}>
                      {isImg ? '' : icon} {t} - {getToken(t)?.name}
                    </option>
                  )
                })}
                </select>
              </div>

              {/* From Network */}
              <div>
                <label className="block text-sm font-medium mb-3">From Network</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {networks.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => setFromNetwork(net.id)}
                      className={`p-3 border rounded-lg transition-all text-center ${
                        fromNetwork === net.id
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="text-2xl mb-1">{net.icon}</div>
                      <div className="text-sm font-medium">{net.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="bg-blue-600 p-3 rounded-full">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* To Network */}
              <div>
                <label className="block text-sm font-medium mb-3">To Network</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {networks.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => setToNetwork(net.id)}
                      className={`p-3 border rounded-lg transition-all text-center ${
                        toNetwork === net.id
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="text-2xl mb-1">{net.icon}</div>
                      <div className="text-sm font-medium">{net.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Bridge Details */}
              {result && (
                <div className="bg-primary-dark/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span>
                      {amount} {token}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee ({result.feePercentage.toFixed(2)}%)</span>
                    <span>
                      {result.fee} {token}
                    </span>
                  </div>
                  <div className="border-t border-primary/20 pt-2 flex justify-between font-semibold">
                    <span className="text-gray-300">You will receive</span>
                    <span className="text-primary">
                      {result.amount} {token}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBridge}
                disabled={!amount || parseFloat(amount) <= 0 || fromNetwork === toNetwork}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!amount || parseFloat(amount) <= 0
                  ? 'Enter Amount'
                  : fromNetwork === toNetwork
                    ? 'Select Different Networks'
                    : 'Bridge Now'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">Bridge Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">From</span>
                  <span className="font-semibold">{fromNetworkData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To</span>
                  <span className="font-semibold">{toNetworkData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token</span>
                  <span className="font-semibold">{formatTokenDisplay(token)}</span>
                </div>
                <div className="border-t border-primary/20 pt-2 flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span>{result ? `${result.feePercentage.toFixed(2)}%` : '0.5%'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time</span>
                  <span>2-5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Amount</span>
                  <span>$10</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Supported Tokens</h3>
              <ul className="space-y-2 text-sm">
                {supportedTokens.map((t) => {
                  const tokenInfo = getToken(t)
                  return (
                    <li key={t} className="flex items-center gap-2">
                      <TokenIcon symbol={t} size="small" />
                      <span>
                        {t} - {tokenInfo?.name}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Available Networks</h3>
              <div className="space-y-2">
                {networks.map((net) => (
                  <div key={net.id} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{net.icon}</span>
                    <span>{net.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Token Icons</h3>
              <div className="grid grid-cols-3 gap-2">
                {supportedTokens.map((t) => {
                  const tokenInfo = getToken(t)
                  return (
                    <div key={t} className="flex flex-col items-center text-xs">
                      <div className="mb-1">
                        <TokenIcon symbol={t} size="medium" />
                      </div>
                      <span className="font-semibold">{t}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
