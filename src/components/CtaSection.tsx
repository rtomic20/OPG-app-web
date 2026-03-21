import { useState } from 'react'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'EMAILJS_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'EMAILJS_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'EMAILJS_PUBLIC_KEY'

export default function CtaSection() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'kupac' | 'opg'>('kupac')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { email, role, source: 'cta' },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="waitlist-cta"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
      }}
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl bg-lime-400" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl bg-green-300" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-5xl mb-6">🌿</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Budi prvi u svojoj regiji
        </h2>
        <p className="text-green-200 text-lg mb-4 leading-relaxed">
          Prijavi se na listu čekanja i dobij ekskluzivan rani pristup.
          OPG vlasnici koji se prijave kao prvi dobit će premium profil <strong className="text-white">besplatno</strong>.
        </p>
        <p className="text-green-300 text-sm mb-10">
          ⏳ Platforma se otvara u travnju 2026. — ostalo je još samo {' '}
          <strong className="text-white">par tjedana</strong>.
        </p>

        {/* Role toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg overflow-hidden border border-green-500">
            <button
              type="button"
              onClick={() => setRole('kupac')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                role === 'kupac'
                  ? 'bg-green-400 text-green-950'
                  : 'text-green-200 hover:text-white'
              }`}
            >
              🛒 Kupac
            </button>
            <button
              type="button"
              onClick={() => setRole('opg')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                role === 'opg'
                  ? 'bg-green-400 text-green-950'
                  : 'text-green-200 hover:text-white'
              }`}
            >
              🌾 OPG vlasnik
            </button>
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
            <span className="text-5xl block mb-3">🎉</span>
            <p className="text-white font-bold text-xl mb-2">Prijava uspješna!</p>
            <p className="text-green-200">Javit ćemo se prije otvaranja platforme.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tvoj@email.com"
              required
              className="flex-1 px-4 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-green-500 text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-green-400 hover:bg-green-300 disabled:bg-green-600 text-green-950 font-bold px-6 py-3.5 rounded-lg transition-colors whitespace-nowrap"
            >
              {status === 'sending' ? 'Šaljem...' : 'Prijavi se →'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3">Greška pri slanju. Pokušaj ponovo.</p>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-green-300 text-sm">
          <span>✓ Bez pretplate</span>
          <span>✓ Bez spama</span>
          <span>✓ Odjavi se kad god</span>
        </div>
      </div>
    </section>
  )
}
