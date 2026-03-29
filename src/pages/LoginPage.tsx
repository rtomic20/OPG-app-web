import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const role = await login(email, password)
      if (role === 'opg_owner' || role === 'admin') {
        window.location.href = 'http://46.224.189.114'
      } else {
        navigate(from === '/' ? '/profil' : from, { replace: true })
      }
    } catch {
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
            <div className="text-4xl mb-2">🌿</div>
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
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
