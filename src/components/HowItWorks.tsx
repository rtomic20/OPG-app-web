import { useState, useEffect, useRef } from 'react'
import {
  IconWheat as Wheat, IconShoppingCart as ShoppingCart, IconFileText as FileText,
  IconBasket as ShoppingBasket, IconTrendingUp as TrendingUp, IconMap as Map, IconToolsKitchen as UtensilsCrossed,
} from '@tabler/icons-react'

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
        desc: 'Unesi što trenutno imaš dostupno: voće, povrće, mlijeko, med, jaja... Postavi cijenu i dostupnu količinu.',
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
        desc: 'Primaj svježu hranu direktno od farme, bez posrednika i bez čekanja na kamion iz Španjolske.',
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
          <span className="inline-block bg-[#EAF2E0] text-[#2D5016] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Kako funkcionira
          </span>
          <h2 className="playfair text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
            Jednostavno kao kupovina na tržnici
          </h2>
          <p className="text-[#555] text-lg max-w-xl mx-auto">
            Tržnjak radi za obje strane: za OPG-ove i za kupce.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded overflow-hidden border border-[#E8E8E8] bg-white">
            {(Object.keys(tabs) as Array<'opg' | 'kupac'>).map(key => {
              const { TabIcon } = tabs[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base transition-colors ${
                    activeTab === key
                      ? 'bg-[#2D5016] text-white'
                      : 'text-[#555] hover:bg-[#FAF7F2]'
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
              className={`animate-fade-in animate-delay-${(i + 1) * 100} relative bg-white rounded-lg p-8 shadow-sm border border-[#E8E8E8]`}
            >
              {i < current.steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-[#E8E8E8] z-10" />
              )}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-black text-[#E0E0E0]">{step.num}</span>
                <div className="w-10 h-10 rounded-lg bg-[#EAF2E0] flex items-center justify-center">
                  <step.Icon className="w-5 h-5 text-[#2D5016]" stroke={1.5} />
                </div>
              </div>
              <h3 className="playfair text-xl font-bold text-[#111111] mb-3">{step.title}</h3>
              <p className="text-[#555] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
