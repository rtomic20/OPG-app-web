import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'EMAILJS_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'EMAILJS_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'EMAILJS_PUBLIC_KEY'

export default function Hero() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'kupac' | 'opg'>('kupac')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { email, role, source: 'hero' },
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
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: '#16a34a' }}
      />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: '#65a30d' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 border border-green-200 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Uskoro dostupno — prijavi se na listu čekanja
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-950 leading-tight mb-6">
          Svježa lokalna hrana,{' '}
          <span className="text-green-600">direktno od proizvođača</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-green-800 max-w-2xl mx-auto mb-10 leading-relaxed">
          Povežite se s OPG vlasnicima iz svoje regije. Bez posrednika, bez kompromisa
          u svježini — pravo od polja do stola.
        </p>

        {/* Waitlist form */}
        <div id="waitlist" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl mx-auto mb-12">
          <h2 className="text-xl font-bold text-green-900 mb-4">
            Budi prvi koji sazna kad krenemo 🚀
          </h2>

          {/* Role toggle */}
          <div className="flex rounded-lg overflow-hidden border border-green-200 mb-5">
            <button
              type="button"
              onClick={() => setRole('kupac')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                role === 'kupac'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              🛒 Kupac
            </button>
            <button
              type="button"
              onClick={() => setRole('opg')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                role === 'opg'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              🌾 OPG vlasnik
            </button>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="text-4xl">🎉</span>
              <p className="text-green-700 font-semibold text-lg">Hvala! Javit ćemo se uskoro.</p>
              <p className="text-green-600 text-sm">Provjeri email za potvrdu.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tvoj@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-green-200 bg-white text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                {status === 'sending' ? 'Šaljem...' : 'Prijavi me'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-2">Greška pri slanju. Pokušaj ponovo.</p>
          )}
          <p className="text-green-500 text-xs mt-3">Bez spama. Odjavi se kad god želiš.</p>
        </div>

        {/* Social proof stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {[
            { num: '50+', label: 'OPG-ova na čekanju' },
            { num: '200+', label: 'zainteresiranih kupaca' },
            { num: '5', label: 'regija pokriveno' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-green-600">{stat.num}</div>
              <div className="text-sm text-green-700 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
