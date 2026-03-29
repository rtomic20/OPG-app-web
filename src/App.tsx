import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DirectoryPage from './pages/DirectoryPage'
import VendorProfilePage from './pages/VendorProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import './index.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <>{children}</> : <Navigate to="/prijava" replace />
}

function AppRoutes() {
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
