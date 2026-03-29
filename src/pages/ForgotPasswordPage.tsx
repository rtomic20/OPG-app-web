import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/password-reset/', { email })
      setSent(true)
    } catch {
      setError('Greška. Provjerite internetsku vezu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">📧</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Email poslan</h1>
              <p className="text-sm text-gray-500 mb-6">
                Ako račun postoji, poslali smo upute za resetiranje lozinke.
              </p>
              <Link
                to="/prijava"
                className="block w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 text-center transition-colors"
              >
                Natrag na prijavu
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🔑</div>
                <h1 className="text-xl font-bold text-gray-900">Resetiranje lozinke</h1>
                <p className="text-sm text-gray-500 mt-1">Unesite email i poslat ćemo vam link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Slanje...' : 'Pošalji link'}
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
