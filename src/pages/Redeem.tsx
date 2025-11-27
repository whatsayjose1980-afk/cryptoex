import { Zap } from 'lucide-react'

export default function Redeem() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Mint & Redeem</h1>
        <p className="text-gray-400 mb-8">Mint USDTz or redeem your tokens</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mint USDTz */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Mint USDTz</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Network</label>
                <select className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                  <option>Ethereum</option>
                  <option>BSC</option>
                  <option>Polygon</option>
                  <option>Arbitrum</option>
                </select>
              </div>

              <div className="bg-primary-dark/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">You'll receive</span>
                  <span className="font-semibold">0 USDTz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span>0.5%</span>
                </div>
              </div>

              <button className="w-full btn-primary">Connect Wallet to Mint</button>
            </div>
          </div>

          {/* Redeem USDTz */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Redeem USDTz</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDTz)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Network</label>
                <select className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                  <option>Ethereum</option>
                  <option>BSC</option>
                  <option>Polygon</option>
                  <option>Arbitrum</option>
                </select>
              </div>

              <div className="bg-primary-dark/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">You'll receive</span>
                  <span className="font-semibold">0 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span>0.5%</span>
                </div>
              </div>

              <button className="w-full btn-primary">Connect Wallet to Redeem</button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 card">
          <h2 className="text-xl font-semibold mb-6">About USDTz</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">What is USDTz?</h3>
              <p className="text-gray-400 text-sm">
                USDTz is a USDT-backed hybrid stablecoin that combines the stability of Tether with the flexibility of multi-chain deployment. Each USDTz is backed 1:1 by USDT held in secure reserves.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Benefits</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>✓ 1:1 USDT backing</li>
                <li>✓ Multi-chain support</li>
                <li>✓ Instant redemption</li>
                <li>✓ Low fees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
