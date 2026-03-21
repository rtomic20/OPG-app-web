import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Categories from './components/Categories'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Categories />
      <CtaSection />
      <Footer />
    </div>
  )
}
