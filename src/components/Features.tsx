import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: '🌱',
    title: 'Svježe ubrano',
    desc: 'Proizvodi se beru dan-dva prije isporuke. Ne tjednima u hladnjačama.',
  },
  {
    icon: '📍',
    title: '100% lokalno',
    desc: 'Samo OPG-ovi iz tvoje regije. Kraći put = svježije i ekološki prihvatljivije.',
  },
  {
    icon: '🤝',
    title: 'Direktno od farmera',
    desc: 'Znaš od koga kupuješ. Pročitaj priču iza farme i provjeri certifikate.',
  },
  {
    icon: '💸',
    title: 'Bez posrednika',
    desc: 'OPG dobiva pravednu cijenu, kupac plaća manje nego u supermarketu.',
  },
  {
    icon: '📱',
    title: 'Sve na jednom mjestu',
    desc: 'Web i mobilna aplikacija. Naruči, prati isporuku i ocijeni — sve u par klikova.',
  },
  {
    icon: '🔒',
    title: 'Sigurno plaćanje',
    desc: 'Online plaćanje karticom ili gotovinom pri preuzimanju — odabereš što ti odgovara.',
  },
  {
    icon: '🌍',
    title: 'Ekološki svjesno',
    desc: 'Manje prijevoza, manje ambalaže, manje otpada. Lokalno kupovanje je zeleno kupovanje.',
  },
  {
    icon: '⭐',
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
            Zašto OPG Marketplace
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-950 mb-4">
            Prednosti koje čine razliku
          </h2>
          <p className="text-green-700 text-lg max-w-xl mx-auto">
            Dizajnirano da bude jednostavno za OPG-ove i ugodno za kupce.
          </p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ${visible ? 'section-visible' : ''}`}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-in animate-delay-${Math.min((i % 4 + 1) * 100, 400)} group p-6 rounded-2xl border border-green-100 hover:border-green-300 hover:shadow-md transition-all`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-green-950 mb-2">{f.title}</h3>
              <p className="text-green-700 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
