import { useEffect, useRef, useState } from 'react'
import {
  IconSeedling as Sprout, IconMapPin as MapPin, IconHeartHandshake as Handshake, IconCash as Banknote,
  IconDeviceMobile as Smartphone, IconShieldCheck as ShieldCheck, IconLeaf as Leaf, IconStar as Star,
} from '@tabler/icons-react'

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
    desc: 'Znaš od koga kupuješ. Pročitaj priču iza farme koja stoji iza svakog proizvoda.',
  },
  {
    Icon: Banknote,
    title: 'Bez posrednika',
    desc: 'OPG dobiva pravednu cijenu, kupac plaća manje nego u supermarketu.',
  },
  {
    Icon: Smartphone,
    title: 'Sve na jednom mjestu',
    desc: 'Web i mobilna aplikacija. Naruči, prati isporuku i ocijeni. Sve u par klikova.',
  },
  {
    Icon: ShieldCheck,
    title: 'Sigurno plaćanje',
    desc: 'Online plaćanje karticom ili gotovinom pri preuzimanju. Odabereš što ti odgovara.',
  },
  {
    Icon: Leaf,
    title: 'Ekološki svjesno',
    desc: 'Manje prijevoza, manje ambalaže, manje otpada. Lokalno kupovanje je zeleno kupovanje.',
  },
  {
    Icon: Star,
    title: 'Ocjene i recenzije',
    desc: 'Transparentna zajednica. Čitaj iskustva drugih kupaca i dijeli svoja.',
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
          <span className="inline-block bg-[#EAF2E0] text-[#2D5016] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Zašto Tržnjak
          </span>
          <h2 className="playfair text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
            Prednosti koje čine razliku
          </h2>
          <p className="text-[#555] text-lg max-w-xl mx-auto">
            Dizajnirano da bude jednostavno za OPG-ove i ugodno za kupce.
          </p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ${visible ? 'section-visible' : ''}`}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-in animate-delay-${Math.min((i % 4 + 1) * 100, 400)} group p-6 rounded-lg border border-[#E8E8E8] hover:border-[#EAF2E0] hover:shadow-md transition-all`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#EAF2E0] mb-4 group-hover:bg-[#d4ecc0] transition-colors">
                <f.Icon className="w-6 h-6 text-[#2D5016]" stroke={1.5} />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2">{f.title}</h3>
              <p className="text-[#555] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
