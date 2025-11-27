import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import CandlestickChart from '../components/CandlestickChart'
import LogoButton from '../components/LogoButton'

interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export default function Spot() {
  const [selectedPair, setSelectedPair] = useState('ETH/USDT')
  const [timeframe, setTimeframe] = useState('4H')

  const pairs = [
    { symbol: 'ETH/USDT', price: 2450.50, change: 2.45, high: 2485.30, low: 2398.50, volume: '125,450 ETH' },
    { symbol: 'BTC/USDT', price: 42150.00, change: -1.23, high: 42500.00, low: 41800.00, volume: '12,500 BTC' },
    { symbol: 'BNB/USDT', price: 612.45, change: 3.12, high: 625.00, low: 595.00, volume: '850,000 BNB' },
    { symbol: 'POL/USDT', price: 0.8950, change: 5.67, high: 0.92, low: 0.84, volume: '5.2M POL' },
  ]

  // Sample candlestick data
  const candleData: Record<string, Candle[]> = {
    'ETH/USDT': [
      { time: '09:00', open: 2420, high: 2450, low: 2410, close: 2445 },
      { time: '10:00', open: 2445, high: 2480, low: 2440, close: 2475 },
      { time: '11:00', open: 2475, high: 2490, low: 2460, close: 2465 },
      { time: '12:00', open: 2465, high: 2500, low: 2450, close: 2495 },
      { time: '13:00', open: 2495, high: 2510, low: 2480, close: 2505 },
      { time: '14:00', open: 2505, high: 2520, low: 2490, close: 2515 },
      { time: '15:00', open: 2515, high: 2530, low: 2500, close: 2520 },
      { time: '16:00', open: 2520, high: 2540, low: 2510, close: 2535 },
    ],
    'BTC/USDT': [
      { time: '09:00', open: 41800, high: 42100, low: 41700, close: 42050 },
      { time: '10:00', open: 42050, high: 42300, low: 42000, close: 42250 },
      { time: '11:00', open: 42250, high: 42400, low: 42100, close: 42200 },
      { time: '12:00', open: 42200, high: 42500, low: 42150, close: 42400 },
      { time: '13:00', open: 42400, high: 42600, low: 42300, close: 42550 },
      { time: '14:00', open: 42550, high: 42700, low: 42450, close: 42650 },
      { time: '15:00', open: 42650, high: 42800, low: 42500, close: 42750 },
      { time: '16:00', open: 42750, high: 42900, low: 42600, close: 42850 },
    ],
    'BNB/USDT': [
      { time: '09:00', open: 595, high: 615, low: 590, close: 610 },
      { time: '10:00', open: 610, high: 625, low: 605, close: 620 },
      { time: '11:00', open: 620, high: 630, low: 615, close: 625 },
      { time: '12:00', open: 625, high: 635, low: 620, close: 630 },
      { time: '13:00', open: 630, high: 640, low: 625, close: 635 },
      { time: '14:00', open: 635, high: 645, low: 630, close: 640 },
      { time: '15:00', open: 640, high: 650, low: 635, close: 645 },
      { time: '16:00', open: 645, high: 660, low: 640, close: 655 },
    ],
    'POL/USDT': [
      { time: '09:00', open: 0.84, high: 0.87, low: 0.83, close: 0.86 },
      { time: '10:00', open: 0.86, high: 0.89, low: 0.85, close: 0.88 },
      { time: '11:00', open: 0.88, high: 0.91, low: 0.87, close: 0.90 },
      { time: '12:00', open: 0.90, high: 0.92, low: 0.89, close: 0.91 },
      { time: '13:00', open: 0.91, high: 0.93, low: 0.90, close: 0.92 },
      { time: '14:00', open: 0.92, high: 0.94, low: 0.91, close: 0.93 },
      { time: '15:00', open: 0.93, high: 0.95, low: 0.92, close: 0.94 },
      { time: '16:00', open: 0.94, high: 0.96, low: 0.93, close: 0.95 },
    ],
  }

  const currentPair = pairs.find((p) => p.symbol === selectedPair) || pairs[0]
  const chartData = candleData[selectedPair] || candleData['ETH/USDT']

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <LogoButton size="md" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Spot Trading</h1>
            <p className="text-gray-400 text-sm md:text-base">Trade crypto pairs with real-time data</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Trading Chart Section */}
          <div className="lg:col-span-2 card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">{selectedPair}</h2>
              <div className="flex gap-2 flex-wrap">
                {['1H', '4H', '1D', '1W'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      timeframe === tf
                        ? 'bg-blue-600 border border-blue-500 text-white'
                        : 'bg-primary/20 border border-primary/50 text-gray-300 hover:bg-primary/30'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Candlestick Chart */}
            <div className="mb-6 overflow-x-auto">
              <div className="min-w-full">
                <CandlestickChart data={chartData} width={Math.max(400, 600)} height={300} />
              </div>
            </div>

            {/* Price Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Current Price</div>
                <div className="font-semibold text-lg">${currentPair.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">24h Change</div>
                <div className={`font-semibold text-lg ${currentPair.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {currentPair.change > 0 ? '+' : ''}{currentPair.change}%
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">24h High</div>
                <div className="font-semibold text-lg">${currentPair.high.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">24h Low</div>
                <div className="font-semibold text-lg">${currentPair.low.toFixed(2)}</div>
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
                <label className="block text-sm font-medium mb-2">Amount</label>
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
                  placeholder={currentPair.price.toFixed(2)}
                  className="w-full bg-primary-dark border border-primary/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <button className="w-full btn-primary">Buy {selectedPair.split('/')[0]}</button>
            </div>
          </div>
        </div>

        {/* Trading Pairs Table */}
        <div className="mt-8 md:mt-12 card">
          <h2 className="text-xl font-semibold mb-6">Top Trading Pairs</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-2 md:px-4 font-semibold">Pair</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold">Price</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold">24h Change</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold hidden sm:table-cell">24h High</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold hidden sm:table-cell">24h Low</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair) => (
                  <tr
                    key={pair.symbol}
                    className="border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedPair(pair.symbol)}
                  >
                    <td className="py-3 px-2 md:px-4 font-medium">{pair.symbol}</td>
                    <td className="text-right py-3 px-2 md:px-4">${pair.price.toFixed(2)}</td>
                    <td className="text-right py-3 px-2 md:px-4">
                      <div className={`flex items-center justify-end gap-1 ${pair.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change > 0 ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
                        {Math.abs(pair.change)}%
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 md:px-4 hidden sm:table-cell">${pair.high.toFixed(2)}</td>
                    <td className="text-right py-3 px-2 md:px-4 hidden sm:table-cell">${pair.low.toFixed(2)}</td>
                    <td className="text-right py-3 px-2 md:px-4">
                      <button className="text-blue-400 hover:text-blue-300 text-xs md:text-sm font-semibold">Trade</button>
                    </td>
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
