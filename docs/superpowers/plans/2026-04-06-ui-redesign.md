# UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace emoji icons with Lucide SVGs, warm up palette, redesign hero, add OPG posts section on landing page, and fix admin panel icons.

**Architecture:** Pure frontend changes across two apps — OPG-app-web (promo landing) and OPG-app/frontend (admin panel). No backend changes needed; the `/api/vendors/feed/` endpoint already exists and is public. All icon replacements are direct Lucide component swaps. New ObjaveSection fetches the feed and renders null if empty.

**Tech Stack:** React 19, Tailwind v4, lucide-react, DM Sans (Google Fonts), axios (already installed)

---

## File Map

**OPG-app-web:**
- Modify: `src/index.css` — font import, body palette, hero animation classes
- Modify: `src/components/Hero.tsx` — remove gradient+blobs, add SVG decos, stagger animation
- Modify: `src/components/Problem.tsx` — replace 🔍🏪📦 with Lucide
- Modify: `src/components/HowItWorks.tsx` — replace emoji tab labels + step icons
- Modify: `src/components/Features.tsx` — replace 8 emoji icons
- Modify: `src/components/CtaSection.tsx` — replace ✓ trust badges
- Create: `src/components/ObjaveSection.tsx` — new posts feed section
- Modify: `src/pages/LandingPage.tsx` — add ObjaveSection between Categories and CtaSection

**OPG-app/frontend:**
- Modify: `src/components/Layout.tsx` — replace OPG nav emoji icons
- Modify: `src/components/AdminLayout.tsx` — replace admin nav emoji icons
- Modify: `src/pages/DashboardPage.tsx` — replace stat card emoji icons

---

### Task 1: Install lucide-react in both projects

**Files:**
- Modify: `OPG-app-web/package.json` (via npm install)
- Modify: `OPG-app/frontend/package.json` (via npm install)

- [ ] **Step 1: Install in promo web**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm install lucide-react
```

Expected: `added X packages` with no errors.

- [ ] **Step 2: Install in admin panel**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app/frontend"
npm install lucide-react
```

Expected: `added X packages` with no errors.

---

### Task 2: Promo web — index.css font + palette + hero animation classes

**Files:**
- Modify: `OPG-app-web/src/index.css`

- [ ] **Step 1: Replace index.css**

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
@import "tailwindcss";

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  background-color: #faf7f2;
  color: #1c1917;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Fade-in on scroll animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-delay-100 { animation-delay: 0.1s; opacity: 0; }
.animate-delay-200 { animation-delay: 0.2s; opacity: 0; }
.animate-delay-300 { animation-delay: 0.3s; opacity: 0; }
.animate-delay-400 { animation-delay: 0.4s; opacity: 0; }
.animate-delay-500 { animation-delay: 0.5s; opacity: 0; }

.section-visible .animate-delay-100,
.section-visible .animate-delay-200,
.section-visible .animate-delay-300,
.section-visible .animate-delay-400,
.section-visible .animate-delay-500 {
  animation-name: fadeInUp;
}

/* Hero staggered entrance */
.hero-animate-1 { animation: fadeInUp 0.6s ease-out 0ms both; }
.hero-animate-2 { animation: fadeInUp 0.6s ease-out 120ms both; }
.hero-animate-3 { animation: fadeInUp 0.6s ease-out 240ms both; }
.hero-animate-4 { animation: fadeInUp 0.6s ease-out 360ms both; }
```

- [ ] **Step 2: Verify build passes**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 3: Promo web — Redesign Hero.tsx

**Files:**
- Modify: `OPG-app-web/src/components/Hero.tsx`

- [ ] **Step 1: Replace Hero.tsx**

```tsx
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
        {[0,1,2,3].map(row =>
          [0,1,2,3].map(col => (
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
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 4: Promo web — Update Problem.tsx icons

**Files:**
- Modify: `OPG-app-web/src/components/Problem.tsx`

- [ ] **Step 1: Replace Problem.tsx**

```tsx
import { useEffect, useRef, useState } from 'react'
import { Search, Store, Package, X, Check } from 'lucide-react'

const problems = [
  {
    Icon: Search,
    title: 'Teško je pronaći lokalnog proizvođača',
    desc: 'OPG-ovi nemaju online prisutnost. Kupci ne znaju ni da postoje farme u svojoj regiji.',
  },
  {
    Icon: Store,
    title: 'Supermarketi uzimaju veliki udio',
    desc: 'Posrednici smanjuju zaradu OPG-ovima na minimum, a kupci plaćaju višu cijenu za manje svježu hranu.',
  },
  {
    Icon: Package,
    title: 'Nema sigurnog načina narudžbe',
    desc: 'Sve se radi telefonom ili osobno. Nema pregleda dostupnosti, cijena ni pouzdane isporuke.',
  },
]

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-red-50 text-red-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Problem koji rješavamo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Lokalna hrana postoji, ali je teška za naći
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Hrvatska ima više od 150.000 OPG-ova, a većina kupaca ne zna gdje ih naći.
            Sustav je broken — mi ga popravljamo.
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 ${visible ? 'section-visible' : ''}`}>
          {problems.map((p, i) => (
            <div
              key={p.title}
              className={`animate-fade-in animate-delay-${(i + 1) * 100} bg-red-50 border border-red-100 rounded-2xl p-8 text-center`}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-5">
                <p.Icon className="w-7 h-7 text-red-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{p.title}</h3>
              <p className="text-stone-700 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* VS banner */}
        <div className="mt-14 rounded-2xl overflow-hidden grid md:grid-cols-2">
          <div className="bg-red-50 p-8">
            <h3 className="font-bold text-red-800 mb-4 text-lg flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" /> Bez Tržnjaka
            </h3>
            <ul className="space-y-2 text-red-700">
              {[
                'Tražiš OPG-ove na Facebook grupama',
                'Plaćaš 3× veću cijenu u supermarketu',
                'Hrana ima 5-7 dana transporta',
                'Ne znaš odakle dolazi tvoja hrana',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 p-8">
            <h3 className="font-bold text-green-800 mb-4 text-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> S Tržnjakom
            </h3>
            <ul className="space-y-2 text-green-700">
              {[
                'Naruči od lokalnog OPG-a za nekoliko minuta',
                'Pravedna cijena — direktno od proizvođača',
                'Hrana ubrana isti ili prethodni dan',
                'Znaš ime i priču iza svake farme',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 5: Promo web — Update HowItWorks.tsx icons

**Files:**
- Modify: `OPG-app-web/src/components/HowItWorks.tsx`

- [ ] **Step 1: Replace HowItWorks.tsx**

```tsx
import { useState, useEffect, useRef } from 'react'
import { Wheat, ShoppingCart, FileText, ShoppingBasket, TrendingUp, Map, UtensilsCrossed } from 'lucide-react'

const tabs = {
  opg: {
    label: 'Za OPG vlasnike',
    TabIcon: Wheat,
    steps: [
      {
        num: '01',
        Icon: FileText,
        title: 'Registriraj se besplatno',
        desc: 'Otvori profil svog OPG-a u 5 minuta. Dodaj fotografije, opis i lokaciju. Bez naknade dok ne počneš prodavati.',
      },
      {
        num: '02',
        Icon: ShoppingBasket,
        title: 'Dodaj svoje proizvode',
        desc: 'Unesi što trenutno imaš dostupno — voće, povrće, mlijeko, med, jaja... Postavi cijenu i dostupnu količinu.',
      },
      {
        num: '03',
        Icon: TrendingUp,
        title: 'Prima narudžbe i zarađuj',
        desc: 'Kupci ti šalju narudžbe direktno. Ti potvrđuješ, pripremaš i dostavljaš ili organiziraš preuzimanje.',
      },
    ],
  },
  kupac: {
    label: 'Za kupce',
    TabIcon: ShoppingCart,
    steps: [
      {
        num: '01',
        Icon: Map,
        title: 'Pronađi OPG-ove u svojoj regiji',
        desc: 'Pretraži kartu ili listu lokalnih OPG-ova. Pogledaj što nude, pročitaj recenzije i odaberi po ukusu.',
      },
      {
        num: '02',
        Icon: ShoppingCart,
        title: 'Naruči svježe proizvode',
        desc: 'Dodaj željene proizvode u košaricu i odaberi dostavu ili osobno preuzimanje. Plaćanje online ili gotovinom.',
      },
      {
        num: '03',
        Icon: UtensilsCrossed,
        title: 'Uživaj u svježe ubranoj hrani',
        desc: 'Primaj svježu hranu direktno od farme — bez posrednika, bez čekanja na kamion iz Španjolske.',
      },
    ],
  },
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'opg' | 'kupac'>('kupac')
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const current = tabs[activeTab]

  return (
    <section id="kako-radi" className="py-20 bg-[#faf7f2]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Kako funkcionira
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Jednostavno kao kupovina na tržnici
          </h2>
          <p className="text-stone-600 text-lg max-w-xl mx-auto">
            Tržnjak radi za obje strane — i za producente i za kupce.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl overflow-hidden border-2 border-stone-200 bg-white">
            {(Object.keys(tabs) as Array<'opg' | 'kupac'>).map(key => {
              const { TabIcon } = tabs[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base transition-colors ${
                    activeTab === key
                      ? 'bg-green-600 text-white'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tabs[key].label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Steps */}
        <div className={`grid md:grid-cols-3 gap-8 ${visible ? 'section-visible' : ''}`}>
          {current.steps.map((step, i) => (
            <div
              key={step.num}
              className={`animate-fade-in animate-delay-${(i + 1) * 100} relative bg-white rounded-2xl p-8 shadow-sm border border-stone-100`}
            >
              {i < current.steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-stone-200 z-10" />
              )}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-black text-stone-200">{step.num}</span>
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <step.Icon className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 6: Promo web — Update Features.tsx icons

**Files:**
- Modify: `OPG-app-web/src/components/Features.tsx`

- [ ] **Step 1: Replace Features.tsx**

```tsx
import { useEffect, useRef, useState } from 'react'
import { Sprout, MapPin, Handshake, Banknote, Smartphone, ShieldCheck, Leaf, Star } from 'lucide-react'

const features = [
  {
    Icon: Sprout,
    title: 'Svježe ubrano',
    desc: 'Proizvodi se beru dan-dva prije isporuke. Ne tjednima u hladnjačama.',
  },
  {
    Icon: MapPin,
    title: '100% lokalno',
    desc: 'Samo OPG-ovi iz tvoje regije. Kraći put = svježije i ekološki prihvatljivije.',
  },
  {
    Icon: Handshake,
    title: 'Direktno od farmera',
    desc: 'Znaš od koga kupuješ. Pročitaj priču iza farme i provjeri certifikate.',
  },
  {
    Icon: Banknote,
    title: 'Bez posrednika',
    desc: 'OPG dobiva pravednu cijenu, kupac plaća manje nego u supermarketu.',
  },
  {
    Icon: Smartphone,
    title: 'Sve na jednom mjestu',
    desc: 'Web i mobilna aplikacija. Naruči, prati isporuku i ocijeni — sve u par klikova.',
  },
  {
    Icon: ShieldCheck,
    title: 'Sigurno plaćanje',
    desc: 'Online plaćanje karticom ili gotovinom pri preuzimanju — odabereš što ti odgovara.',
  },
  {
    Icon: Leaf,
    title: 'Ekološki svjesno',
    desc: 'Manje prijevoza, manje ambalaže, manje otpada. Lokalno kupovanje je zeleno kupovanje.',
  },
  {
    Icon: Star,
    title: 'Ocjene i recenzije',
    desc: 'Transparentna zajednica — čitaj iskustva drugih kupaca i dijeli svoja.',
  },
]

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="prednosti" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Zašto Tržnjak
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Prednosti koje čine razliku
          </h2>
          <p className="text-stone-600 text-lg max-w-xl mx-auto">
            Dizajnirano da bude jednostavno za OPG-ove i ugodno za kupce.
          </p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ${visible ? 'section-visible' : ''}`}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-in animate-delay-${Math.min((i % 4 + 1) * 100, 400)} group p-6 rounded-2xl border border-stone-100 hover:border-green-200 hover:shadow-md transition-all`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 mb-4 group-hover:bg-green-100 transition-colors">
                <f.Icon className="w-6 h-6 text-green-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 7: Promo web — Update CtaSection.tsx

**Files:**
- Modify: `OPG-app-web/src/components/CtaSection.tsx`

- [ ] **Step 1: Replace CtaSection.tsx**

```tsx
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
      className="py-24 relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700"
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl bg-lime-400" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl bg-green-300" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex justify-center mb-6">
          <Logo size={56} variant="white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Budi prvi u svojoj regiji
        </h2>
        <p className="text-green-200 text-lg mb-4 leading-relaxed">
          Prijavi se na listu čekanja i dobij ekskluzivan rani pristup.
          OPG vlasnici koji se prijave kao prvi dobit će premium profil{' '}
          <strong className="text-white">besplatno</strong>.
        </p>
        <p className="text-green-300 text-sm mb-10">
          Platforma dolazi <strong className="text-white">uskoro</strong> — prijavi se i budi među prvima.
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
              Kupac
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
              OPG vlasnik
            </button>
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
            <div className="flex justify-center mb-3">
              <CircleCheck className="w-12 h-12 text-green-400" />
            </div>
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
          {['Bez pretplate', 'Bez spama', 'Odjavi se kad god'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CircleCheck className="w-4 h-4 text-green-400" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 8: Promo web — Create ObjaveSection.tsx

**Files:**
- Create: `OPG-app-web/src/components/ObjaveSection.tsx`

- [ ] **Step 1: Create ObjaveSection.tsx**

```tsx
import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

interface Post {
  id: number
  content: string
  image: string | null
  created_at: string
  vendor_name: string
  vendor_slug: string
  vendor_logo: string | null
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'danas'
  if (days === 1) return 'jučer'
  if (days < 7) return `${days} dana`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} ${weeks === 1 ? 'tjedan' : 'tjedna'}`
  return `${Math.floor(days / 30)} mjes.`
}

function vendorInitials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ObjaveSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    api.get('/vendors/feed/')
      .then(r => setPosts((r.data as Post[]).slice(0, 6)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (posts.length === 0) return null

  return (
    <section className="py-20 bg-[#faf7f2]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Iz naše zajednice
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Što se događa na hrvatskim farmama
          </h2>
          <p className="text-stone-600 text-lg max-w-xl mx-auto">
            Prati aktualna događanja — sve direktno od OPG vlasnika.
          </p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ${visible ? 'section-visible' : ''}`}>
          {posts.map((post, i) => (
            <a
              key={post.id}
              href={`/opgovi/${post.vendor_slug}`}
              className={`animate-fade-in animate-delay-${Math.min((i % 3 + 1) * 100, 300)} group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-green-300 hover:shadow-md transition-all`}
            >
              {post.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.vendor_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {post.vendor_logo ? (
                    <img
                      src={post.vendor_logo}
                      alt={post.vendor_name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{vendorInitials(post.vendor_name)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 text-sm truncate">{post.vendor_name}</p>
                    <p className="text-stone-400 text-xs">{relativeDate(post.created_at)}</p>
                  </div>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed line-clamp-3">{post.content}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 9: Promo web — Wire ObjaveSection into LandingPage + commit

**Files:**
- Modify: `OPG-app-web/src/pages/LandingPage.tsx`

- [ ] **Step 1: Update LandingPage.tsx**

```tsx
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Problem from '../components/Problem'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Categories from '../components/Categories'
import ObjaveSection from '../components/ObjaveSection'
import CtaSection from '../components/CtaSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Categories />
      <ObjaveSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Final build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

- [ ] **Step 3: Commit promo web changes**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
git add -A
git commit -m "feat: UI redesign — DM Sans, warm palette, hero rework, Lucide icons, ObjaveSection"
```

---

### Task 10: Admin panel — Update Layout.tsx OPG nav icons

**Files:**
- Modify: `OPG-app/frontend/src/components/Layout.tsx`

- [ ] **Step 1: Replace navItems and icon rendering in Layout.tsx**

Find the `navItems` array (lines 9–16) and the `<span>{item.icon}</span>` render. Replace with Lucide icon components.

At the top of the file, add the import after existing imports:
```tsx
import { LayoutDashboard, Package, ShoppingBag, Star, Megaphone, MessageSquare } from 'lucide-react'
```

Replace the `navItems` array:
```tsx
const navItems = [
  { to: "/", label: "Nadzorna ploča", Icon: LayoutDashboard, end: true },
  { to: "/products", label: "Proizvodi", Icon: Package },
  { to: "/orders", label: "Narudžbe", Icon: ShoppingBag },
  { to: "/reviews", label: "Recenzije", Icon: Star },
  { to: "/posts", label: "Objave", Icon: Megaphone },
  { to: "/feedback", label: "Primjedbe", Icon: MessageSquare },
];
```

In the JSX where navItems are rendered, find:
```tsx
<span>{item.icon}</span>
```
Replace with:
```tsx
<item.Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
```

Also find the `TYPE_ICON` record — this is for bell dropdown, not nav, leave it as-is (string emoji used in JSX, not performance-sensitive).

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app/frontend"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 11: Admin panel — Update AdminLayout.tsx nav icons

**Files:**
- Modify: `OPG-app/frontend/src/components/AdminLayout.tsx`

- [ ] **Step 1: Add imports and replace navItems**

Add import after existing imports:
```tsx
import {
  LayoutDashboard, Users, Home, Package, Star, FolderOpen,
  ShoppingBag, MessageSquare, Headphones, Bell, TrendingUp, LogOut, Menu
} from 'lucide-react'
```

Replace the `navItems` array:
```tsx
const navItems = [
  { to: "/admin", label: "Pregled", Icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Korisnici", Icon: Users },
  { to: "/admin/vendors", label: "OPG-ovi", Icon: Home },
  { to: "/admin/products", label: "Proizvodi", Icon: Package },
  { to: "/admin/reviews", label: "Recenzije", Icon: Star },
  { to: "/admin/categories", label: "Kategorije", Icon: FolderOpen },
  { to: "/admin/orders", label: "Narudžbe", Icon: ShoppingBag },
  { to: "/admin/feedbacks", label: "Primjedbe", Icon: MessageSquare },
  { to: "/admin/support", label: "Podrška", Icon: Headphones },
  { to: "/admin/push", label: "Push notifikacije", Icon: Bell },
  { to: "/admin/revenue", label: "Prihodi OPG-ova", Icon: TrendingUp },
];
```

In the nav render, find `<span>{item.icon}</span>` and replace:
```tsx
<item.Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
```

Find the logout button `<span>🚪</span>` and replace:
```tsx
<LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
```

Find the mobile hamburger `<button ...>☰</button>` and replace the `☰` character:
```tsx
<Menu className="w-5 h-5" strokeWidth={1.5} />
```

- [ ] **Step 2: Verify build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app/frontend"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

---

### Task 12: Admin panel — Update DashboardPage.tsx stat icons + commit

**Files:**
- Modify: `OPG-app/frontend/src/pages/DashboardPage.tsx`

- [ ] **Step 1: Add imports**

Add after existing imports:
```tsx
import { ShoppingBag, Clock, Euro, BarChart2 } from 'lucide-react'
```

- [ ] **Step 2: Replace stats array and card render**

Replace the `stats` array:
```tsx
const stats = [
  { label: "Narudžbe danas", value: todayOrders.length, Icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Na čekanju", value: pending, Icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Prihod danas", value: `${revenue.toFixed(2)} EUR`, Icon: Euro, color: "text-green-600", bg: "bg-green-50" },
  { label: "Ukupno narudžbi", value: orders.length, Icon: BarChart2, color: "text-purple-600", bg: "bg-purple-50" },
];
```

Replace the stat card JSX (currently renders `<div className="text-2xl mb-2">{s.icon}</div>`):
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  {stats.map((s) => (
    <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.bg} mb-3`}>
        <s.Icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.5} />
      </div>
      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
      <p className="text-sm text-gray-500 mt-1">{s.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 3: Final build**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app/frontend"
npm run build 2>&1 | tail -5
```

Expected: `✓ built in Xs` with no errors.

- [ ] **Step 4: Commit admin panel changes**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app"
git add frontend/
git commit -m "feat: admin panel — replace emoji icons with Lucide SVGs in nav + dashboard"
```

---

### Task 13: Deploy both apps

- [ ] **Step 1: Push promo web to Cloudflare**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app-web"
git push origin master
npx wrangler deploy
```

Expected: `Published trznjak-web` or similar success message.

- [ ] **Step 2: Push admin panel + trigger CI/CD**

```bash
cd "C:/Users/Lenovo.DESKTOP-7HJOOS6/Desktop/OPG-app"
git push origin main
```

Expected: GitHub Actions CI/CD triggers, deploys to Hetzner. Monitor at GitHub Actions tab.

---

## Self-Review

**Spec coverage:**
- DM Sans font ✓ Task 2
- Warm palette (#faf7f2, stone-900) ✓ Tasks 2, 3, 4, 5, 6, 7
- Hero redesign (SVG decos, stagger animation, no blobs) ✓ Task 3
- Problem.tsx icons ✓ Task 4
- HowItWorks.tsx icons ✓ Task 5
- Features.tsx icons ✓ Task 6
- CtaSection.tsx icons ✓ Task 7
- ObjaveSection (feed, 6 posts, card layout, null if empty) ✓ Task 8
- LandingPage wiring ✓ Task 9
- OPG Layout.tsx nav icons ✓ Task 10
- AdminLayout.tsx nav icons ✓ Task 11
- DashboardPage.tsx stat icons ✓ Task 12
- Deploy ✓ Task 13

**Notes:**
- Categories.tsx food emojis intentionally kept — food emojis are semantic for category cards, no Lucide equivalents
- TYPE_ICON in Layout.tsx (bell dropdown) intentionally kept as emoji strings — minor, not visible in nav
