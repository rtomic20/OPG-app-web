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
  const [passVisible, setPassVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

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
                  <div className="relative">
                    <input
                      type={passVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoFocus
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <button type="button" onClick={() => setPassVisible(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {passVisible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Potvrdi lozinku</label>
                  <div className="relative">
                    <input
                      type={confirmVisible ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <button type="button" onClick={() => setConfirmVisible(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {confirmVisible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
