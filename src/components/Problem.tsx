import { useEffect, useRef, useState } from 'react'

const problems = [
  {
    icon: '🔍',
    title: 'Teško je pronaći lokalnog proizvođača',
    desc: 'OPG-ovi nemaju online prisutnost. Kupci ne znaju ni da postoje farme u svojoj regiji.',
  },
  {
    icon: '🏪',
    title: 'Supermarketi uzimaju veliki udio',
    desc: 'Posrednici smanjuju zaradu OPG-ovima na minimum, a kupci plaćaju višu cijenu za manje svježu hranu.',
  },
  {
    icon: '📦',
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
          <h2 className="text-3xl sm:text-4xl font-bold text-green-950 mb-4">
            Lokalna hrana postoji, ali je teška za naći
          </h2>
          <p className="text-green-700 text-lg max-w-2xl mx-auto">
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
              <div className="text-5xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-bold text-green-950 mb-3">{p.title}</h3>
              <p className="text-green-800 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* VS banner */}
        <div className="mt-14 rounded-2xl overflow-hidden grid md:grid-cols-2">
          <div className="bg-red-100 p-8">
            <h3 className="font-bold text-red-800 mb-4 text-lg">❌ Bez Tržnjaka</h3>
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
          <div className="bg-green-100 p-8">
            <h3 className="font-bold text-green-800 mb-4 text-lg">✅ S Tržnjakom</h3>
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
