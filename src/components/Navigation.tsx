import { Link } from 'wouter'
import { Wallet } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-primary-dark to-primary-light/10 border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <img src="/CryptoEx.png" alt="CryptoEx" className="h-10 w-10 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold gradient-text">CryptoEx</span>
            </a>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/swap"><a className="text-gray-300 hover:text-primary transition-colors">Swap</a></Link>
            <Link href="/spot"><a className="text-gray-300 hover:text-primary transition-colors">Spot</a></Link>
            <Link href="/bridge"><a className="text-gray-300 hover:text-primary transition-colors">Bridge</a></Link>
            <Link href="/p2p"><a className="text-gray-300 hover:text-primary transition-colors">P2P</a></Link>
            <Link href="/portfolio"><a className="text-gray-300 hover:text-primary transition-colors">Portfolio</a></Link>
            <Link href="/usdtz"><a className="text-gray-300 hover:text-primary transition-colors">USDTz</a></Link>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/50">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  )
}
