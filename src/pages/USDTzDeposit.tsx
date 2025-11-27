import { useState } from 'react'
import { Copy, Download, ArrowDown, ArrowUp } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

export default function USDTzDeposit() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [network, setNetwork] = useState('ethereum')
  const [amount, setAmount] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', chainId: 1 },
    { id: 'bsc', name: 'BSC', icon: '🟡', chainId: 56 },
    { id: 'polygon', name: 'Polygon', icon: '🟣', chainId: 137 },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', chainId: 42161 },
    { id: 'optimism', name: 'Optimism', icon: '🔴', chainId: 10 },
    { id: 'base', name: 'Base', icon: '⚪', chainId: 8453 },
    { id: 'avalanche', name: 'Avalanche', icon: '🔺', chainId: 43114 },
  ]

  const depositAddress = '0xB537A89b71F34985433d3A3E17A0824F1e30FD17'
  const userWallet = '0x1234567890123456789012345678901234567890'

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (qrCanvasRef.current && activeTab === 'deposit') {
      QRCode.toCanvas(qrCanvasRef.current, `ethereum:${depositAddress}`, {
        errorCorrectionLevel: 'H',
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      } as any)
    }
  }, [activeTab])

  const handleDownloadQR = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `usdtz-deposit-${Date.now()}.png`
      link.click()
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">USDTz Deposits & Withdrawals</h1>
        <p className="text-gray-400 mb-8">Native ERC-20 USDTz deposits and withdrawals with QR code support</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'deposit'
                ? 'bg-blue-600 text-white'
                : 'bg-primary-light border border-primary/20 text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDown className="w-5 h-5" />
            Deposit USDTz
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'withdraw'
                ? 'bg-blue-600 text-white'
                : 'bg-primary-light border border-primary/20 text-gray-400 hover:text-white'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
            Withdraw USDTz
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-semibold mb-6">
              {activeTab === 'deposit' ? 'Deposit USDTz' : 'Withdraw USDTz'}
            </h2>

            {/* Network Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Network</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {networks.map((net) => (
                  <button
                    key={net.id}
                    onClick={() => setNetwork(net.id)}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      network === net.id
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary'
                    }`}
                  >
                    <div className="text-2xl mb-1">{net.icon}</div>
                    <div className="text-xs font-medium">{net.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amount (USDTz)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-primary-dark border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <div className="text-xs text-gray-400 mt-2">
                Min: $10 | Max: $1,000,000 | Fee: 0.5%
              </div>
            </div>

            {/* Details */}
            {amount && (
              <div className="bg-primary-dark/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-semibold">${parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee (0.5%)</span>
                  <span className="font-semibold">${(parseFloat(amount) * 0.005).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-primary/20 pt-2">
                  <span className="text-gray-400">You will {activeTab === 'deposit' ? 'receive' : 'send'}</span>
                  <span className="font-semibold text-primary">
                    ${(parseFloat(amount) * 0.995).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Address Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {activeTab === 'deposit' ? 'Deposit To' : 'Withdraw From'}
              </label>
              <div className="bg-primary-dark border border-primary/20 rounded-lg p-3 flex items-center justify-between">
                <code className="text-xs font-mono break-all">
                  {activeTab === 'deposit' ? depositAddress : userWallet}
                </code>
                <button
                  onClick={() => handleCopy(activeTab === 'deposit' ? depositAddress : userWallet)}
                  className="ml-2 p-2 hover:bg-primary/10 rounded transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full btn-primary py-3">
              {activeTab === 'deposit' ? 'Deposit USDTz' : 'Withdraw USDTz'}
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg text-sm text-blue-300">
              <p className="font-semibold mb-2">💡 How it works:</p>
              <p>
                {activeTab === 'deposit'
                  ? 'Send USDTz to the deposit address above. Your deposit will be credited after network confirmation (usually 1-5 minutes).'
                  : 'Enter the amount you want to withdraw and confirm. USDTz will be sent to your connected wallet.'}
              </p>
            </div>
          </div>

          {/* QR Code Sidebar */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">QR Code</h3>

            {activeTab === 'deposit' && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Scan this QR code to quickly copy the deposit address
                </p>

                {/* QR Code */}
                <div className="bg-white p-3 rounded-lg mb-4 flex justify-center">
                  <canvas ref={qrCanvasRef} />
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary/20 hover:border-primary rounded-lg transition-colors mb-4"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
              </>
            )}

            {/* Network Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Network Details</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-gray-400">Network</div>
                  <div className="font-semibold">
                    {networks.find((n) => n.id === network)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Confirmations</div>
                  <div className="font-semibold">12 blocks</div>
                </div>
                <div>
                  <div className="text-gray-400">Est. Time</div>
                  <div className="font-semibold">1-5 minutes</div>
                </div>
                <div>
                  <div className="text-gray-400">Min Amount</div>
                  <div className="font-semibold">$10 USDTz</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 p-3 bg-green-600/10 border border-green-600/30 rounded-lg text-xs text-green-400">
              ✓ Network is operational
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>

          <div className="space-y-4">
            {[
              {
                type: 'Deposit',
                amount: '1,000 USDTz',
                status: 'Completed',
                time: '2 hours ago',
                hash: '0x123...abc',
              },
              {
                type: 'Withdrawal',
                amount: '500 USDTz',
                status: 'Completed',
                time: '1 day ago',
                hash: '0x456...def',
              },
              {
                type: 'Deposit',
                amount: '2,500 USDTz',
                status: 'Pending',
                time: '5 minutes ago',
                hash: '0x789...ghi',
              },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                <div>
                  <div className="font-semibold">{tx.type}</div>
                  <div className="text-sm text-gray-400">{tx.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{tx.amount}</div>
                  <div className={`text-sm ${tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
