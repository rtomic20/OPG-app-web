import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

type Step = 'choose' | 'customer'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('choose')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', phone: '', delivery_address: '',
  })
  const [confirm, setConfirm] = useState('')
  const [passVisible, setPassVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
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
    if (form.password.length < 8) {
      setError('Lozinka mora imati najmanje 8 znakova.')
      return
    }
    if (form.password !== confirm) {
      setError('Lozinke se ne podudaraju.')
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
              <div className="flex justify-center mb-3">
                <Logo size={48} />
              </div>
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
                <div className="relative">
                  <input type={passVisible ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="Min. 8 znakova"
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Potvrda lozinke *</label>
                <div className="relative">
                  <input type={confirmVisible ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Ponovi lozinku"
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
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
