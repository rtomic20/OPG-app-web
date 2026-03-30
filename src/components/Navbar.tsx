import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isLanding = location.pathname === '/'
  const isAuth = ['/prijava', '/registracija'].includes(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  const navBg = isLanding
    ? scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    : 'bg-white shadow-sm'

  const initials = user
    ? (user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()
    : '?'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-xl">
            <Logo size={30} />
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-green-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{initials}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.first_name || user.email}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Moj profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Odjava
                    </button>
                  </div>
                )}
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
            {user && (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{initials}</span>
              </div>
            )}
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
          <div className="md:hidden bg-white border-t border-green-100 py-4 space-y-1">
            {!isAuth && <Link to="/opgovi" className="block px-4 py-2.5 text-green-800 font-medium" onClick={() => setMenuOpen(false)}>OPG-ovi</Link>}
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{user.first_name || user.email}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Link to="/profil" className="block px-4 py-2.5 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Moj profil</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-red-500 font-medium">Odjava</button>
              </>
            ) : (
              <>
                <Link to="/prijava" className="block px-4 py-2.5 text-green-800 font-medium" onClick={() => setMenuOpen(false)}>Prijava</Link>
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
