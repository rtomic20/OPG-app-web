import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

export default function LoginPage() {
  const { login, loginWithTokens } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passVisible, setPassVisible] = useState(false)
  const [mfaSession, setMfaSession] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectToPanel = async (access: string, refresh: string, panelTab: Window | null) => {
    const apiBase = import.meta.env.VITE_API_URL || 'https://api.trznjak.com/api'
    const codeRes = await fetch(`${apiBase}/auth/transfer-token/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    const { code } = await codeRes.json()
    const panelBase = import.meta.env.VITE_PANEL_URL || 'http://46.224.189.114'
    const url = `${panelBase}/auto-login?code=${code}`
    if (panelTab) {
      panelTab.location.href = url
    } else {
      window.location.href = url
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const panelTab = window.open('', '_blank')
    try {
      const result = await login(email, password)
      if (result.role === 'mfa_required') {
        panelTab?.close()
        setMfaSession(result.mfa_session!)
        setStep('mfa')
      } else if (result.role === 'opg_owner' || result.role === 'admin' || result.role === 'customer_support') {
        await redirectToPanel(result.access!, result.refresh!, panelTab)
        if (panelTab) navigate('/', { replace: true })
      } else {
        panelTab?.close()
        navigate(from === '/' ? '/profil' : from, { replace: true })
      }
    } catch {
      panelTab?.close()
      setError('Pogrešan email ili lozinka.')
    } finally {
      setPassword('')
      setEmail('')
      setLoading(false)
    }
  }

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const panelTab = window.open('', '_blank')
    try {
      const { data } = await api.post('/auth/mfa/verify/', { mfa_session: mfaSession, code: mfaCode })
      const result = await loginWithTokens(data.access, data.refresh)
      if (result.role === 'opg_owner' || result.role === 'admin' || result.role === 'customer_support') {
        await redirectToPanel(result.access, result.refresh, panelTab)
        if (panelTab) navigate('/', { replace: true })
      } else {
        panelTab?.close()
        navigate(from === '/' ? '/profil' : from, { replace: true })
      }
    } catch {
      panelTab?.close()
      setError('Neispravan kod. Pokušaj ponovo.')
    } finally {
      setMfaCode('')
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[#D8D8D8] rounded text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-colors"

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm border border-[#E8E8E8] p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size={48} />
            </div>
            <h1 className="playfair text-xl font-bold text-[#111111]">Prijava</h1>
            <p className="text-sm text-[#888] mt-1">Dobrodošao/la na Tržnjak</p>
          </div>
          {step === 'mfa' ? (
            <form onSubmit={handleMfa} className="space-y-4">
              <div className="text-center text-sm text-[#888] mb-2">
                Unesite 6-znamenkasti kod iz autentifikacijske aplikacije
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">Verifikacijski kod</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  className={`${inputClass} text-center tracking-widest text-lg`}
                  placeholder="000000"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={loading || mfaCode.length !== 6}
                className="w-full bg-[#2D5016] hover:bg-[#3D6A1F] text-white py-2.5 font-medium disabled:opacity-50 transition-colors"
                style={{ borderRadius: '4px' }}>
                {loading ? 'Provjera...' : 'Potvrdi'}
              </button>
              <button type="button" onClick={() => { setStep('credentials'); setError(''); setMfaCode(''); setMfaSession('') }}
                className="w-full text-sm text-[#888] hover:text-[#555]">
                ← Natrag
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">Email</label>
              <input
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">Lozinka</label>
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  style={{ WebkitTextSecurity: passVisible ? 'none' : 'disc' } as React.CSSProperties}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setPassVisible(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#555]">
                  {passVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              className="w-full bg-[#2D5016] hover:bg-[#3D6A1F] text-white py-2.5 font-medium disabled:opacity-50 transition-colors"
              style={{ borderRadius: '4px' }}
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </button>
          </form>
          )}
          <div className="flex justify-between items-center mt-4">
            <Link to="/zaboravili-lozinku" className="text-sm text-[#888] hover:text-[#555] hover:underline">
              Zaboravili ste lozinku?
            </Link>
            <p className="text-sm text-[#888]">
              Nemaš račun?{' '}
              <Link to="/registracija" className="text-[#2D5016] font-medium hover:underline">Registriraj se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
