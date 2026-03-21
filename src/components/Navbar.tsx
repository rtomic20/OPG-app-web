import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Kako radi', href: '#kako-radi' },
    { label: 'Prednosti', href: '#prednosti' },
    { label: 'Kategorije', href: '#kategorije' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 text-green-700 font-bold text-xl">
            <span className="text-2xl">🌿</span>
            <span>OPG Marketplace</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-green-800 hover:text-green-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#waitlist"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Prijavi se
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-green-800 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Otvori izbornik"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 py-4 space-y-3">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-green-800 hover:text-green-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <a
                href="#waitlist"
                className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Prijavi se
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
