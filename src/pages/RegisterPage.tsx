import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

type Step = 'choose' | 'customer'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('choose')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', phone: '', delivery_address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Sva obavezna polja moraju biti ispunjena.')
      return
    }
    if (form.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 znakova.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register/customer/', form)
      navigate('/prijava', { state: { message: 'Registracija uspješna! Prijavi se.' } })
    } catch (err: any) {
      const data = err?.response?.data
      if (data?.email) setError('Ovaj email već postoji.')
      else setError('Greška pri registraciji. Pokušaj ponovno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center px-4">

        {step === 'choose' && (
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">🌿</div>
              <h1 className="text-2xl font-bold text-gray-900">Kreiraj račun</h1>
              <p className="text-sm text-gray-500 mt-1">Odaberi kako želiš koristiti Tržnjak</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStep('customer')}
                className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-2xl p-6 text-left transition-all group"
              >
                <div className="text-3xl mb-3">🛒</div>
                <h2 className="font-bold text-gray-900 group-hover:text-green-700">Kupac</h2>
                <p className="text-xs text-gray-500 mt-1">Naručujem od lokalnih OPG-ova</p>
              </button>
              <a
                href="https://panel.trznjak.com/register"
                className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-2xl p-6 text-left transition-all group block"
              >
                <div className="text-3xl mb-3">🌾</div>
                <h2 className="font-bold text-gray-900 group-hover:text-green-700">OPG vlasnik</h2>
                <p className="text-xs text-gray-500 mt-1">Prodajem svoje proizvode</p>
              </a>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Već imaš račun?{' '}
              <Link to="/prijava" className="text-green-600 font-medium hover:underline">Prijavi se</Link>
            </p>
          </div>
        )}

        {step === 'customer' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
            <button
              onClick={() => setStep('choose')}
              className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
            >
              ← Natrag
            </button>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🛒</div>
              <h1 className="text-xl font-bold text-gray-900">Registracija kupca</h1>
              <p className="text-sm text-gray-500 mt-1">Naručuj direktno od lokalnih OPG-ova</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ime *</label>
                  <input value={form.first_name} onChange={set('first_name')} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prezime *</label>
                  <input value={form.last_name} onChange={set('last_name')} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lozinka *</label>
                <input type="password" value={form.password} onChange={set('password')} required placeholder="Min. 6 znakova"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Telefon</label>
                <input value={form.phone} onChange={set('phone')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Adresa dostave</label>
                <input value={form.delivery_address} onChange={set('delivery_address')} placeholder="Ulica i broj, grad"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors mt-2">
                {loading ? 'Kreiranje računa...' : 'Kreiraj račun'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Već imaš račun?{' '}
              <Link to="/prijava" className="text-green-600 font-medium hover:underline">Prijavi se</Link>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
