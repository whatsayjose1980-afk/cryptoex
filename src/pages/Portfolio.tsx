import { TrendingUp, Send, Download } from 'lucide-react'

export default function Portfolio() {
  const assets = [
    { symbol: 'ETH', name: 'Ethereum', amount: 2.5, value: 6126.25, change: 2.45 },
    { symbol: 'USDT', name: 'Tether', amount: 10000, value: 10000, change: 0 },
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.15, value: 6322.50, change: -1.23 },
    { symbol: 'MATIC', name: 'Polygon', amount: 5000, value: 4475, change: 5.67 },
  ]

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
        <p className="text-gray-400 mb-8">Manage your digital assets</p>

        {/* Portfolio Summary */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-gray-400 text-sm mb-2">Total Balance</div>
              <div className="text-5xl font-bold mb-4">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                +$1,250.50 (4.2%) today
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button className="flex items-center gap-2 btn-primary">
                <Send className="w-4 h-4" />
                Send
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-primary rounded-lg text-primary hover:bg-primary/10 transition-colors">
                <Download className="w-4 h-4" />
                Receive
              </button>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Your Assets</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 font-semibold">Asset</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold">Value</th>
                  <th className="text-right py-3 px-4 font-semibold">24h Change</th>
                  <th className="text-right py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold">{asset.symbol}</div>
                        <div className="text-sm text-gray-400">{asset.name}</div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-medium">{asset.amount.toLocaleString()}</td>
                    <td className="text-right py-4 px-4 font-medium">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className={`text-right py-4 px-4 font-medium ${asset.change > 0 ? 'text-green-400' : asset.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                    </td>
                    <td className="text-right py-4 px-4">
                      <button className="text-primary hover:text-primary-light transition-colors text-sm font-medium">Trade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
          
          <div className="space-y-4">
            {[
              { type: 'Swap', from: 'ETH', to: 'USDT', amount: 2.5, date: '2 hours ago', status: 'Completed' },
              { type: 'Receive', from: 'Wallet', to: 'MATIC', amount: 5000, date: '1 day ago', status: 'Completed' },
              { type: 'Send', from: 'BTC', to: 'Exchange', amount: 0.05, date: '3 days ago', status: 'Completed' },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                <div>
                  <div className="font-semibold">{tx.type}</div>
                  <div className="text-sm text-gray-400">{tx.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{tx.amount} {tx.to}</div>
                  <div className="text-sm text-green-400">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
