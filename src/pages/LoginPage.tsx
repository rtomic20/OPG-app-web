import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passVisible, setPassVisible] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Otvori blank tab odmah (prije await) — inače popup blocker blokira
    const panelTab = window.open('', '_blank')
    try {
      const result = await login(email, password)
      if (result.role === 'opg_owner' || result.role === 'admin') {
        // Exchange JWT for a one-time code (30s TTL) — code in URL, not the token itself
        const apiBase = import.meta.env.VITE_API_URL || 'https://api.trznjak.com/api'
        const codeRes = await fetch(`${apiBase}/auth/transfer-token/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${result.access}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: result.refresh }),
        })
        const { code } = await codeRes.json()
        panelTab!.location.href = `https://panel.trznjak.com/auto-login?code=${code}`
      } else {
        panelTab?.close()
        navigate(from === '/' ? '/profil' : from, { replace: true })
      }
    } catch {
      panelTab?.close()
      setError('Pogrešan email ili lozinka.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size={48} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Prijava</h1>
            <p className="text-sm text-gray-500 mt-1">Dobrodošao/la na Tržnjak</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
              <div className="relative">
                <input
                  type={passVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button type="button" onClick={() => setPassVisible(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {passVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </button>
          </form>
          <div className="flex justify-between items-center mt-4">
            <Link to="/zaboravili-lozinku" className="text-sm text-gray-400 hover:underline">
              Zaboravili ste lozinku?
            </Link>
            <p className="text-sm text-gray-500">
              Nemaš račun?{' '}
              <Link to="/registracija" className="text-green-600 font-medium hover:underline">Registriraj se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
