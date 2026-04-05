import { useState, useRef } from 'react'
import api from '../services/api'

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
      await api.post('/auth/waitlist/', { email, role })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-[#faf7f2]"
    >
      {/* Top-right organic wave lines */}
      <svg
        className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
        viewBox="0 0 320 320"
        fill="none"
        aria-hidden="true"
      >
        <path d="M320 0 Q 260 80 180 140 Q 100 200 40 320" stroke="#bbf7d0" strokeWidth="2.5" fill="none"/>
        <path d="M320 60 Q 255 130 180 180 Q 105 230 60 320" stroke="#bbf7d0" strokeWidth="1.5" fill="none" opacity="0.55"/>
        <path d="M320 120 Q 255 175 185 215 Q 115 255 85 320" stroke="#bbf7d0" strokeWidth="1" fill="none" opacity="0.3"/>
      </svg>

      {/* Bottom-left dot grid */}
      <svg
        className="absolute bottom-10 left-8 pointer-events-none opacity-35"
        width="88"
        height="88"
        viewBox="0 0 88 88"
        fill="none"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map(row =>
          [0, 1, 2, 3].map(col => (
            <circle key={`${row}-${col}`} cx={col * 22 + 11} cy={row * 22 + 11} r="2.8" fill="#92400e"/>
          ))
        )}
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="hero-animate-1 inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Uskoro dostupno — prijavi se na listu čekanja
        </div>

        {/* Headline */}
        <h1 className="hero-animate-2 text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 leading-tight mb-6">
          Svježa lokalna hrana,{' '}
          <span className="text-green-600">direktno od proizvođača</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-animate-3 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Povežite se s OPG vlasnicima iz svoje regije. Bez posrednika, bez kompromisa
          u svježini — pravo od polja do stola.
        </p>

        {/* Waitlist form */}
        <div id="waitlist" className="hero-animate-4 bg-white rounded-2xl shadow-lg border border-stone-100 p-6 sm:p-8 max-w-xl mx-auto mb-12">
          <h2 className="text-xl font-bold text-stone-900 mb-4">
            Budi prvi koji sazna kad krenemo
          </h2>

          {/* Role toggle */}
          <div className="flex rounded-lg overflow-hidden border border-stone-200 mb-5">
            <button
              type="button"
              onClick={() => setRole('kupac')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                role === 'kupac'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              Kupac
            </button>
            <button
              type="button"
              onClick={() => setRole('opg')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                role === 'opg'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              OPG vlasnik
            </button>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-stone-800 font-semibold text-lg">Hvala! Javit ćemo se uskoro.</p>
              <p className="text-stone-500 text-sm">Provjeri email za potvrdu.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tvoj@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <p className="text-stone-400 text-xs mt-3">Bez spama. Odjavi se kad god želiš.</p>
        </div>
      </div>
    </section>
  )
}
