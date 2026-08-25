import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DirectoryPage from './pages/DirectoryPage'
import VendorProfilePage from './pages/VendorProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PrivatnostPage from './pages/PrivatnostPage'
import UvjetiPage from './pages/UvjetiPage'
import './index.css'

const SITE = 'https://trznjak.com'
// Pages behind auth or with no standalone value should not be indexed on their own.
const NOINDEX = new Set(['/profil', '/prijava', '/registracija', '/zaboravili-lozinku', '/reset-lozinka'])

/**
 * The SPA shipped with no <link rel="canonical"> on any route, so Search Console
 * reported "Duplicate without user-selected canonical". Blog pages already have one
 * (written by scripts/build-blog.mjs); this gives the React routes the same.
 */
function useCanonical() {
  const { pathname } = useLocation()

  useEffect(() => {
    const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = `${SITE}${clean}`

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (NOINDEX.has(clean)) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        document.head.appendChild(robots)
      }
      robots.content = 'noindex, follow'
    } else if (robots) {
      robots.remove()
    }
  }, [pathname])
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <>{children}</> : <Navigate to="/prijava" replace />
}

function AppRoutes() {
  useCanonical()
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/opgovi" element={<DirectoryPage />} />
      <Route path="/opgovi/:slug" element={<VendorProfilePage />} />
      <Route path="/prijava" element={<LoginPage />} />
      <Route path="/registracija" element={<RegisterPage />} />
      <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/zaboravili-lozinku" element={<ForgotPasswordPage />} />
      <Route path="/reset-lozinka" element={<ResetPasswordPage />} />
      <Route path="/privatnost" element={<PrivatnostPage />} />
      <Route path="/uvjeti" element={<UvjetiPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
