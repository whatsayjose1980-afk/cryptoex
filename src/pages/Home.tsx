import { Link } from 'wouter'
import { Zap, Shield, Globe, TrendingUp } from 'lucide-react'
import LogoButton from '../components/LogoButton'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <LogoButton size="lg" clickable={false} />
          </div>
          <div className="mb-6 inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">🎉 Now Supporting USDTz Hybrid Stablecoin</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trade Crypto Across
            <br />
            <span className="gradient-text">7 Major Blockchains</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Swap, trade, and bridge your assets with the best rates from top DEX aggregators. Native support for USDTz - the USDT-backed hybrid stablecoin.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/swap">
              <a className="px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors border-4 border-yellow-600" style={{
                borderStyle: 'dashed',
                boxShadow: '0 0 0 3px #6B8E23'
              }}>
                Start Trading →
              </a>
            </Link>
            <Link href="/usdtz">
              <a className="px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors border-4 border-yellow-600" style={{
                borderStyle: 'dashed',
                boxShadow: '0 0 0 3px #6B8E23'
              }}>
                Redeem USDTz
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-light/5 to-primary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">$1M+</div>
              <div className="text-gray-400 text-sm">24h Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">7</div>
              <div className="text-gray-400 text-sm">Networks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">100+</div>
              <div className="text-gray-400 text-sm">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">100%</div>
              <div className="text-gray-400 text-sm">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Execute trades in seconds with our optimized routing engine and best price aggregation.</p>
          </div>
          
          <div className="card">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Non-Custodial</h3>
            <p className="text-gray-400">Your keys, your crypto. We never hold your funds. Trade directly from your wallet.</p>
          </div>
          
          <div className="card">
            <Globe className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-Chain</h3>
            <p className="text-gray-400">Access Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, and Avalanche from one interface.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary-light/20 to-primary/20 border border-primary/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-400 mb-8">Connect your wallet and experience the future of DeFi trading.</p>
          <Link href="/swap">
            <a className="px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors border-4 border-yellow-600 inline-block" style={{
              borderStyle: 'dashed',
              boxShadow: '0 0 0 3px #6B8E23'
            }}>
              Launch App →
            </a>
          </Link>
        </div>
      </section>
    </div>
  )
}
