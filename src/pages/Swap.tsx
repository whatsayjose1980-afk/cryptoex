import { ArrowRightLeft, Settings } from 'lucide-react'
import { useState } from 'react'
import {
  calculateSwapAmount,
  formatTokenDisplay,
  getSupportedSwapTokens,
  getToken,
  getExchangeRate,
  isImageIcon,
} from '../utils/tokenConfig'
import TokenIcon from '../components/TokenIcon'
import LogoButton from '../components/LogoButton'

export default function Swap() {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDT')
  const [slippage, setSlippage] = useState('0.1')

  const supportedTokens = getSupportedSwapTokens()

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && parseFloat(value) > 0) {
      const result = calculateSwapAmount(value, fromToken, toToken)
      setToAmount(result.amount)
    } else {
      setToAmount('')
    }
  }

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    alert(`Swap initiated: ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`)
  }

  const rate = getExchangeRate(fromToken, toToken)
  const result = fromAmount ? calculateSwapAmount(fromAmount, fromToken, toToken) : null
  const fromTokenData = getToken(fromToken)
  const toTokenData = getToken(toToken)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <LogoButton size="md" />
          <div>
            <h1 className="text-4xl font-bold">Token Swap</h1>
            <p className="text-gray-400">Swap tokens instantly with the best rates</p>
          </div>
        </div>

        <div className="card">
          {/* From Token */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1 bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <select
                value={fromToken}
                onChange={(e) => {
                  setFromToken(e.target.value)
                  if (fromAmount) {
                    const result = calculateSwapAmount(fromAmount, e.target.value, toToken)
                    setToAmount(result.amount)
                  }
                }}
                className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary cursor-pointer"
              >
                {supportedTokens.map((token) => {
                  const icon = getToken(token)?.icon
                  const isImg = isImageIcon(icon || '')
                  return (
                    <option key={token} value={token}>
                      {isImg ? '' : icon} {token} - {getToken(token)?.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSwapTokens}
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/50"
            >
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* To Token */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">To</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className="flex-1 bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <select
                value={toToken}
                onChange={(e) => {
                  setToToken(e.target.value)
                  if (fromAmount) {
                    const result = calculateSwapAmount(fromAmount, fromToken, e.target.value)
                    setToAmount(result.amount)
                  }
                }}
                className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary cursor-pointer"
              >
                {supportedTokens.map((token) => {
                  const icon = getToken(token)?.icon
                  const isImg = isImageIcon(icon || '')
                  return (
                    <option key={token} value={token}>
                      {isImg ? '' : icon} {token} - {getToken(token)?.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Details */}
          {result && (
            <div className="bg-primary-dark/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Exchange Rate</span>
                <span>
                  1 {fromToken} = {rate.toFixed(6)} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fee</span>
                <span>{result.feePercentage.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fee Amount</span>
                <span>
                  {result.fee} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage Tolerance</span>
                <span>{slippage}%</span>
              </div>
              <div className="border-t border-primary/20 pt-2 flex justify-between font-semibold">
                <span className="text-gray-300">You will receive</span>
                <span className="text-primary">
                  {result.amount} {toToken}
                </span>
              </div>
            </div>
          )}

          {/* Slippage Settings */}
          <div className="mb-6 p-4 bg-primary-dark/50 rounded-lg">
            <label className="block text-sm font-medium mb-3">Slippage Tolerance</label>
            <div className="flex gap-2">
              {['0.1', '0.5', '1'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    slippage === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-primary-light border border-primary/20 hover:border-primary'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                placeholder="Custom"
                className="flex-1 bg-primary-dark border border-primary/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSwap}
              disabled={!fromAmount || parseFloat(fromAmount) <= 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fromAmount && parseFloat(fromAmount) > 0 ? 'Swap Now' : 'Enter Amount'}
            </button>
            <button className="p-3 border border-primary/20 rounded-lg hover:border-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-primary-light/10 border border-primary/20 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Best Price</div>
            <div className="text-lg font-semibold">Guaranteed</div>
          </div>
          <div className="bg-primary-light/10 border border-primary/20 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Speed</div>
            <div className="text-lg font-semibold">Instant</div>
          </div>
          <div className="bg-primary-light/10 border border-primary/20 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Security</div>
            <div className="text-lg font-semibold">100%</div>
          </div>
        </div>

        {/* Supported Tokens */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold mb-4">Supported Tokens</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {supportedTokens.map((token) => {
              const tokenData = getToken(token)
              return (
                <div key={token} className="p-3 bg-primary-dark/50 rounded-lg border border-primary/10">
                  <div className="mb-1">
                    <TokenIcon symbol={token} size="medium" />
                  </div>
                  <div className="text-sm font-semibold">{token}</div>
                  <div className="text-xs text-gray-400">{tokenData?.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
