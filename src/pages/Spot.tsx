import { TrendingUp, TrendingDown } from 'lucide-react'

export default function Spot() {
  const pairs = [
    { symbol: 'ETH/USDT', price: 2450.50, change: 2.45, high: 2485.30, low: 2398.50 },
    { symbol: 'BTC/USDT', price: 42150.00, change: -1.23, high: 42500.00, low: 41800.00 },
    { symbol: 'BNB/USDT', price: 612.45, change: 3.12, high: 625.00, low: 595.00 },
    { symbol: 'MATIC/USDT', price: 0.8950, change: 5.67, high: 0.92, low: 0.84 },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Spot Trading</h1>
        <p className="text-gray-400 mb-8">Trade crypto pairs with real-time data</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trading Chart */}
          <div className="lg:col-span-2 card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">ETH/USDT</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary/20 border border-primary/50 rounded text-sm hover:bg-primary/30 transition-colors">1H</button>
                <button className="px-3 py-1 bg-blue-600 border border-blue-500 rounded text-sm">4H</button>
                <button className="px-3 py-1 bg-primary/20 border border-primary/50 rounded text-sm hover:bg-primary/30 transition-colors">1D</button>
              </div>
            </div>
            
            <div className="h-64 bg-primary-dark/50 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$2,450.50</div>
                <div className="text-green-400 text-lg">+2.45%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">24h High</div>
                <div className="font-semibold">$2,485.30</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">24h Low</div>
                <div className="font-semibold">$2,398.50</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">24h Volume</div>
                <div className="font-semibold">125,450 ETH</div>
              </div>
            </div>
          </div>

          {/* Order Panel */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Place Order</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Type</label>
                <select className="w-full bg-primary-dark border border-primary/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary">
                  <option>Market</option>
                  <option>Limit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (USDT)</label>
                <input
                  type="number"
                  placeholder="2450.50"
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <button className="w-full btn-primary">Buy ETH</button>
            </div>
          </div>
        </div>

        {/* Trading Pairs */}
        <div className="mt-12 card">
          <h2 className="text-xl font-semibold mb-6">Top Trading Pairs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 font-semibold">Pair</th>
                  <th className="text-right py-3 px-4 font-semibold">Price</th>
                  <th className="text-right py-3 px-4 font-semibold">24h Change</th>
                  <th className="text-right py-3 px-4 font-semibold">24h High</th>
                  <th className="text-right py-3 px-4 font-semibold">24h Low</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair) => (
                  <tr key={pair.symbol} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{pair.symbol}</td>
                    <td className="text-right py-3 px-4">${pair.price.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">
                      <div className={`flex items-center justify-end gap-1 ${pair.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(pair.change)}%
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">${pair.high.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">${pair.low.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
