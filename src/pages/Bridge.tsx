import { ArrowRight } from 'lucide-react'

export default function Bridge() {
  const networks = [
    { name: 'Ethereum', icon: '⟠', color: 'from-purple-600 to-purple-800' },
    { name: 'BSC', icon: '🟡', color: 'from-yellow-600 to-yellow-800' },
    { name: 'Polygon', icon: '🟣', color: 'from-purple-600 to-purple-800' },
    { name: 'Arbitrum', icon: '🔵', color: 'from-blue-600 to-blue-800' },
    { name: 'Optimism', icon: '🔴', color: 'from-red-600 to-red-800' },
    { name: 'Base', icon: '⚪', color: 'from-gray-600 to-gray-800' },
    { name: 'Avalanche', icon: '🔺', color: 'from-red-600 to-red-800' },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Cross-Chain Bridge</h1>
        <p className="text-gray-400 mb-12">Bridge your assets across 7 major blockchains</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bridge Form */}
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-semibold mb-6">Bridge Assets</h2>

            <div className="space-y-6">
              {/* From Network */}
              <div>
                <label className="block text-sm font-medium mb-3">From Network</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {networks.map((net) => (
                    <button
                      key={net.name}
                      className="p-3 border border-primary/20 rounded-lg hover:border-primary hover:bg-primary/10 transition-all text-center"
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
                      key={net.name}
                      className="p-3 border border-primary/20 rounded-lg hover:border-primary hover:bg-primary/10 transition-all text-center"
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
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <button className="w-full btn-primary">Connect Wallet to Bridge</button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">Bridge Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span>0.5%</span>
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
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ USDT</li>
                <li>✓ USDC</li>
                <li>✓ ETH</li>
                <li>✓ BTC</li>
                <li>✓ USDTz</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
