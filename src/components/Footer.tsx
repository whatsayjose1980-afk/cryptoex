import { Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-primary/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">CryptoEx</h3>
            <p className="text-gray-400 text-sm">Trade crypto across 7 major blockchains with the best rates.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Swap</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Spot Trading</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bridge</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">P2P</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://x.com/CryptoEx1054084?t=bBg5pXU7ksO9eBciXoAwCQ&s=08" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" title="Follow on X"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/cryptoex83/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" title="Follow on Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/profile.php?id=61584087310458" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" title="Follow on Facebook"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary/20 pt-8 flex justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 CryptoEx. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
