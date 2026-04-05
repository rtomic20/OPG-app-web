import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Problem from '../components/Problem'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Categories from '../components/Categories'
import ObjaveSection from '../components/ObjaveSection'
import CtaSection from '../components/CtaSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Categories />
      <ObjaveSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
