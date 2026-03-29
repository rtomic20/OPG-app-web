import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const uid = searchParams.get('uid') ?? ''
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!uid || !token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">❌</div>
            <p className="text-gray-700 mb-4">Nevažeći link za resetiranje lozinke.</p>
            <Link to="/prijava" className="text-green-600 hover:underline">Natrag na prijavu</Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Lozinke se ne podudaraju.')
      return
    }
    if (password.length < 8) {
      setError('Lozinka mora imati najmanje 8 znakova.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/password-reset/confirm/', { uid, token, new_password: password })
      setDone(true)
      setTimeout(() => navigate('/prijava'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Greška. Link je možda istekao.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          {done ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h1 className="text-xl font-bold text-gray-900">Lozinka promijenjena</h1>
              <p className="text-sm text-gray-500 mt-2">Preusmjeravamo vas na prijavu...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🔒</div>
                <h1 className="text-xl font-bold text-gray-900">Nova lozinka</h1>
                <p className="text-sm text-gray-500 mt-1">Unesite novu lozinku za vaš račun</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova lozinka</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoFocus
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Potvrdi lozinku</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
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
                  {loading ? 'Mijenja...' : 'Postavi novu lozinku'}
                </button>
                <p className="text-center text-sm text-gray-500">
                  <Link to="/prijava" className="text-green-600 hover:underline">← Natrag na prijavu</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
