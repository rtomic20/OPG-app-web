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
