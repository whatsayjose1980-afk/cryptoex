import { MapPin, Star } from 'lucide-react'
import { useState } from 'react'

export default function P2P() {
  const [region, setRegion] = useState('US')

  const regions = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'EU', name: 'Europe', flag: '🇪🇺' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
  ]

  const sellers = [
    {
      id: 1,
      name: '0x1234...5678',
      price: 1.02,
      available: 5000,
      limit: '₹100 - ₹5000',
      rating: 4.8,
      trades: 1250,
      methods: ['Bank Transfer', 'PayPal'],
    },
    {
      id: 2,
      name: '0xabcd...ef01',
      price: 1.01,
      available: 10000,
      limit: '₹500 - ₹10000',
      rating: 4.9,
      trades: 2100,
      methods: ['UPI', 'Bank Transfer'],
    },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">P2P Marketplace</h1>
        <p className="text-gray-400 mb-8">Buy and sell crypto directly with other users</p>

        {/* Region Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">Select Region</label>
          <div className="flex flex-wrap gap-3">
            {regions.map((r) => (
              <button
                key={r.code}
                onClick={() => setRegion(r.code)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  region === r.code
                    ? 'bg-blue-600 border border-blue-500'
                    : 'bg-primary-light border border-primary/20 hover:border-primary'
                }`}
              >
                <span className="text-xl">{r.flag}</span>
                <span>{r.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Token</label>
            <select className="w-full bg-primary-light border border-primary/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary">
              <option>USDT</option>
              <option>USDC</option>
              <option>ETH</option>
              <option>BTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select className="w-full bg-primary-light border border-primary/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary">
              <option>All Methods</option>
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>PayPal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full bg-primary-light border border-primary/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full btn-primary">Search</button>
          </div>
        </div>

        {/* Sellers List */}
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div key={seller.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {seller.name.slice(2, 4).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{seller.name}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {seller.rating} ({seller.trades} trades)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Price</div>
                  <div className="text-2xl font-bold">₹{seller.price}</div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Available</div>
                  <div className="font-semibold">{seller.available.toLocaleString()} USDT</div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Limit</div>
                  <div className="font-semibold">{seller.limit}</div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Methods</div>
                  <div className="flex flex-wrap gap-1">
                    {seller.methods.map((method) => (
                      <span key={method} className="text-xs bg-primary/20 border border-primary/50 px-2 py-1 rounded">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="btn-primary whitespace-nowrap">Trade</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
