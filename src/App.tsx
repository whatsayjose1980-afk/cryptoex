import { Router, Route } from 'wouter'
import { Toaster } from 'sonner'
import Home from './pages/Home'
import Swap from './pages/Swap'
import Spot from './pages/Spot'
import P2P from './pages/P2P'
import Bridge from './pages/Bridge'
import Portfolio from './pages/Portfolio'
import Redeem from './pages/Redeem'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-primary-light flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Route path="/" component={Home} />
          <Route path="/swap" component={Swap} />
          <Route path="/spot" component={Spot} />
          <Route path="/p2p" component={P2P} />
          <Route path="/bridge" component={Bridge} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/redeem" component={Redeem} />
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  )
}
