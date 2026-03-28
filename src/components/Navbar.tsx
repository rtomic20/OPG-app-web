import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isAuth = ['/prijava', '/registracija'].includes(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = isLanding
    ? scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    : 'bg-white shadow-sm'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-xl">
            <span className="text-2xl">🌿</span>
            <span>Tržnjak</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuth && (
              <Link to="/opgovi" className="text-green-800 hover:text-green-600 font-medium transition-colors">
                OPG-ovi
              </Link>
            )}
            {isLanding && (
              <>
                <a href="#kako-radi" className="text-green-800 hover:text-green-600 font-medium transition-colors">Kako radi</a>
                <a href="#prednosti" className="text-green-800 hover:text-green-600 font-medium transition-colors">Prednosti</a>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.first_name || user.email}</span>
                <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Odjava</button>
              </div>
            ) : (
              <>
                <Link to="/prijava" className="text-green-700 font-medium hover:text-green-600 transition-colors text-sm">
                  Prijava
                </Link>
                <Link to="/registracija" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                  Registracija
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button className="text-green-800 p-2" onClick={() => setMenuOpen(!menuOpen)}>
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
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 py-4 space-y-2">
            {!isAuth && <Link to="/opgovi" className="block px-4 py-2 text-green-800 font-medium" onClick={() => setMenuOpen(false)}>OPG-ovi</Link>}
            {user ? (
              <>
                <span className="block px-4 py-2 text-sm text-gray-500">{user.email}</span>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-red-500">Odjava</button>
              </>
            ) : (
              <>
                <Link to="/prijava" className="block px-4 py-2 text-green-800 font-medium" onClick={() => setMenuOpen(false)}>Prijava</Link>
                <div className="px-4 pt-1">
                  <Link to="/registracija" className="block text-center bg-green-600 text-white font-semibold px-5 py-2 rounded-lg" onClick={() => setMenuOpen(false)}>
                    Registracija
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
