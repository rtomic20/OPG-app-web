import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import api from '../services/api'
import Logo from './Logo'

export default function CtaSection() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'kupac' | 'opg'>('kupac')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

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
      id="waitlist-cta"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A2E0A 0%, #2D5016 60%, #3A6418 100%)' }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#EAF2E0' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#5A8B35' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex justify-center mb-6">
          <Logo size={56} variant="white" />
        </div>
        <h2 className="playfair text-3xl sm:text-4xl font-bold text-white mb-4">
          Budi prvi u svojoj regiji
        </h2>
        <p className="text-[#b8d4a0] text-lg mb-4 leading-relaxed">
          Prijavi se na listu čekanja i dobij ekskluzivan rani pristup.
          OPG vlasnici koji se prijave kao prvi dobit će premium profil{' '}
          <strong className="text-white">besplatno</strong>.
        </p>
        <p className="text-[#8ab870] text-sm mb-10">
          Platforma dolazi <strong className="text-white">uskoro</strong>. Prijavi se i budi među prvima.
        </p>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded overflow-hidden border border-[#5A8B35]">
            <button
              type="button"
              onClick={() => setRole('kupac')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                role === 'kupac'
                  ? 'bg-[#CDA274] text-[#111]'
                  : 'text-[#b8d4a0] hover:text-white'
              }`}
            >
              Kupac
            </button>
            <button
              type="button"
              onClick={() => setRole('opg')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                role === 'opg'
                  ? 'bg-[#CDA274] text-[#111]'
                  : 'text-[#b8d4a0] hover:text-white'
              }`}
            >
              OPG vlasnik
            </button>
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-white/10 rounded-lg p-8 max-w-md mx-auto">
            <div className="flex justify-center mb-3">
              <CircleCheck className="w-12 h-12 text-[#CDA274]" />
            </div>
            <p className="text-white font-bold text-xl mb-2">Prijava uspješna!</p>
            <p className="text-[#b8d4a0]">Javit ćemo se prije otvaranja platforme.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tvoj@email.com"
              required
              className="flex-1 px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-[#5A8B35] text-white placeholder-[#8ab870] focus:outline-none focus:ring-2 focus:ring-[#CDA274]/50"
              style={{ borderRadius: '4px' }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-[#CDA274] hover:bg-[#BF9264] disabled:opacity-60 text-white font-bold px-6 py-3.5 transition-colors whitespace-nowrap"
              style={{ borderRadius: '4px' }}
            >
              {status === 'sending' ? 'Šaljem...' : 'Prijavi se →'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3">Greška pri slanju. Pokušaj ponovo.</p>
        )}

        <div className="flex flex-wrap justify-center gap-6 mt-10 text-[#8ab870] text-sm">
          {['Bez pretplate', 'Bez spama', 'Odjavi se kad god'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CircleCheck className="w-4 h-4 text-[#CDA274]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
