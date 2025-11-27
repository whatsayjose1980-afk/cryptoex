import { useState, useEffect, useRef } from 'react'
import { Copy, Download, ArrowDown, ArrowUp, AlertCircle, CheckCircle } from 'lucide-react'
import QRCode from 'qrcode'
import {
  getSourceBalance,
  validateDepositParams,
  getDepositFeeStructure,
  formatDepositAmount,
  DEFAULT_DEPOSIT_CONFIG,
} from '../utils/erc20DepositHandler'
import { USDTZ_CONTRACTS } from '../utils/usdtzERC20'
import LogoButton from '../components/LogoButton'

export default function USDTzDeposit() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [network, setNetwork] = useState<string>('ethereum')
  const [amount, setAmount] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sourceBalance, setSourceBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [userAddress, setUserAddress] = useState('0x1234567890123456789012345678901234567890')

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', chainId: 1 },
    { id: 'bsc', name: 'BSC', icon: '🟡', chainId: 56 },
    { id: 'polygon', name: 'Polygon', icon: '🟣', chainId: 137 },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', chainId: 42161 },
    { id: 'optimism', name: 'Optimism', icon: '🔴', chainId: 10 },
    { id: 'base', name: 'Base', icon: '⚪', chainId: 8453 },
    { id: 'avalanche', name: 'Avalanche', icon: '🔺', chainId: 43114 },
  ]

  const depositAddress = DEFAULT_DEPOSIT_CONFIG.sourceAddress
  const userWallet = userAddress

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Load source balance on network change
  useEffect(() => {
    const loadSourceBalance = async () => {
      try {
        setLoading(true)
        const balance = await getSourceBalance(network)
        setSourceBalance(balance)
        setError(null)
      } catch (err) {
        console.error('Error loading source balance:', err)
        setError('Failed to load source balance')
        setSourceBalance('0')
      } finally {
        setLoading(false)
      }
    }

    loadSourceBalance()
  }, [network])

  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR code
  useEffect(() => {
    if (qrCanvasRef.current && activeTab === 'deposit') {
      const qrData = `ethereum:${depositAddress}?amount=${amount || '0'}`
      QRCode.toCanvas(qrCanvasRef.current, qrData, {
        errorCorrectionLevel: 'H',
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      } as any)
    }
  }, [activeTab, amount])

  const handleDownloadQR = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `usdtz-deposit-${Date.now()}.png`
      link.click()
    }
  }

  const handleDeposit = async () => {
    try {
      setError(null)
      setLoading(true)

      // Validate inputs
      const validation = validateDepositParams(amount, userWallet, network)
      if (!validation.valid) {
        setError(validation.error || 'Invalid deposit parameters')
        return
      }

      // Simulate deposit
      const mockHash = `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
      setTxHash(mockHash)

      // In production, this would send the actual transaction via wagmi/ethers
      console.log('Deposit initiated:', { amount, network, userWallet })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed')
    } finally {
      setLoading(false)
    }
  }

  const feeStructure = amount ? getDepositFeeStructure(amount) : null

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <LogoButton size="md" />
          <div>
            <h1 className="text-4xl font-bold mb-2">USDTz Deposits & Withdrawals</h1>
            <p className="text-gray-400">Native ERC-20 USDTz deposits and withdrawals with QR code support</p>
          </div>
        </div>

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
                {activeTab === 'deposit' ? 'Deposit From (Source)' : 'Withdraw From'}
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

            {/* Your Wallet Address */}
            {activeTab === 'deposit' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Receive To (Your Wallet)</label>
                <div className="bg-primary-dark border border-primary/20 rounded-lg p-3">
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-transparent text-xs font-mono text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-600/10 border border-red-600/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Success Display */}
            {txHash && (
              <div className="mb-6 p-4 bg-green-600/10 border border-green-600/30 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-300">
                  <p className="font-semibold mb-1">Deposit Initiated</p>
                  <p className="text-xs font-mono break-all">{txHash}</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={activeTab === 'deposit' ? handleDeposit : undefined}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit USDTz' : 'Withdraw USDTz'}
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg text-sm text-blue-300">
              <p className="font-semibold mb-2">💡 How it works:</p>
              <p>
                {activeTab === 'deposit'
                  ? 'USDTz is transferred directly from our reserve (0xB537A89b71F34985433d3A3E17A0824F1e30FD17) to your wallet on the selected network. Each USDTz is pegged 1:1 to USD and backed by USDT reserves.'
                  : 'Enter the amount you want to withdraw and confirm. USDTz will be sent to your connected wallet.'}
              </p>
            </div>

            {/* Source Balance Info */}
            <div className="mt-4 p-4 bg-primary-dark/50 rounded-lg text-sm">
              <p className="text-gray-400 mb-1">Available at Source</p>
              <p className="text-lg font-semibold text-primary">{formatDepositAmount(sourceBalance)} USDTz</p>
              <p className="text-xs text-gray-500 mt-1">From: {depositAddress.slice(0, 10)}...{depositAddress.slice(-8)}</p>
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
                  <div className="text-gray-400">Contract Address</div>
                  <div className="font-mono text-xs break-all text-primary">
                    {(USDTZ_CONTRACTS as any)[network]}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Decimals</div>
                  <div className="font-semibold">{DEFAULT_DEPOSIT_CONFIG.decimals}</div>
                </div>
                <div>
                  <div className="text-gray-400">USD Peg</div>
                  <div className="font-semibold text-green-400">1:1 (1 USDTz = $1 USD)</div>
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

            {/* Fee Structure */}
            {feeStructure && (
              <div className="mt-4 p-3 bg-primary-dark/50 rounded-lg text-xs space-y-1">
                <h4 className="font-semibold text-gray-300 mb-2">Fee Breakdown</h4>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-semibold">${feeStructure.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee ({feeStructure.feePercentage}%)</span>
                  <span className="font-semibold">-${feeStructure.fee}</span>
                </div>
                <div className="flex justify-between border-t border-primary/20 pt-1 mt-1">
                  <span className="text-gray-300">You Receive</span>
                  <span className="font-semibold text-primary">${feeStructure.net}</span>
                </div>
              </div>
            )}
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
