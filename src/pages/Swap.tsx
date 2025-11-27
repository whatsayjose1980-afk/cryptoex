import { ArrowRightLeft, Settings } from 'lucide-react'
import { useState } from 'react'

export default function Swap() {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Token Swap</h1>
        <p className="text-gray-400 mb-8">Swap tokens instantly with the best rates</p>

        <div className="card">
          {/* From Token */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 hover:border-primary transition-colors">
                <div className="text-sm font-medium">ETH</div>
                <div className="text-xs text-gray-400">Ethereum</div>
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/50">
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
              <button className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 hover:border-primary transition-colors">
                <div className="text-sm font-medium">USDT</div>
                <div className="text-xs text-gray-400">Tether</div>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-primary-dark/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Price</span>
              <span>1 ETH = 2,450.50 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fee</span>
              <span>0.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slippage</span>
              <span>0.1%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 btn-primary">Connect Wallet</button>
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
      </div>
    </div>
  )
}
