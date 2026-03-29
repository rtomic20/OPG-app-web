import { useState, useEffect, useRef } from 'react'

const tabs = {
  opg: {
    label: '🌾 Za OPG vlasnike',
    steps: [
      {
        num: '01',
        title: 'Registriraj se besplatno',
        desc: 'Otvori profil svog OPG-a u 5 minuta. Dodaj fotografije, opis i lokaciju. Bez naknade dok ne počneš prodavati.',
        icon: '📝',
      },
      {
        num: '02',
        title: 'Dodaj svoje proizvode',
        desc: 'Unesi što trenutno imaš dostupno — voće, povrće, mlijeko, med, jaja... Postavi cijenu i dostupnu količinu.',
        icon: '🧺',
      },
      {
        num: '03',
        title: 'Prima narudžbe i zarađuj',
        desc: 'Kupci ti šalju narudžbe direktno. Ti potvrđuješ, pripremaš i dostavljaš ili organiziraš preuzimanje.',
        icon: '💰',
      },
    ],
  },
  kupac: {
    label: '🛒 Za kupce',
    steps: [
      {
        num: '01',
        title: 'Pronađi OPG-ove u svojoj regiji',
        desc: 'Pretraži kartu ili listu lokalnih OPG-ova. Pogledaj što nude, pročitaj recenzije i odaberi po ukusu.',
        icon: '🗺️',
      },
      {
        num: '02',
        title: 'Naruči svježe proizvode',
        desc: 'Dodaj željene proizvode u košaricu i odaberi dostavu ili osobno preuzimanje. Plaćanje online ili gotovinom.',
        icon: '📱',
      },
      {
        num: '03',
        title: 'Uživaj u svježe ubranoj hrani',
        desc: 'Primaj svježu hranu direktno od farme — bez posrednika, bez čekanja na kamion iz Španjolske.',
        icon: '🥗',
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
    <section id="kako-radi" className="py-20 bg-green-50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Kako funkcionira
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-950 mb-4">
            Jednostavno kao kupovina na tržnici
          </h2>
          <p className="text-green-700 text-lg max-w-xl mx-auto">
            Tržnjak radi za obje strane — i za producente i za kupce.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl overflow-hidden border-2 border-green-200 bg-white">
            {(Object.keys(tabs) as Array<'opg' | 'kupac'>).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base transition-colors ${
                  activeTab === key
                    ? 'bg-green-600 text-white'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                {tabs[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className={`grid md:grid-cols-3 gap-8 ${visible ? 'section-visible' : ''}`}>
          {current.steps.map((step, i) => (
            <div
              key={step.num}
              className={`animate-fade-in animate-delay-${(i + 1) * 100} relative bg-white rounded-2xl p-8 shadow-sm border border-green-100`}
            >
              {/* Connector line (not on last) */}
              {i < current.steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-green-200 z-10" />
              )}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-black text-green-200">{step.num}</span>
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-green-950 mb-3">{step.title}</h3>
              <p className="text-green-700 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
