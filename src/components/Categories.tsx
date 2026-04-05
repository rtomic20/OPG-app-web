import { useEffect, useRef, useState } from 'react'

const categories = [
  { icon: '🍅', name: 'Voće i povrće', desc: 'Rajčice, tikvice, paprika, jabuke, jagode...' },
  { icon: '🍯', name: 'Med i pčelinji proizvodi', desc: 'Med, propolis, vosak, matična mliječ' },
  { icon: '🥚', name: 'Jaja', desc: 'Svježa jaja slobodnih kokoši, domaća perad' },
  { icon: '🥛', name: 'Mliječni proizvodi', desc: 'Svježe mlijeko, sir, jogurt, vrhnje, skuta' },
  { icon: '🥩', name: 'Meso i mesne prerađevine', desc: 'Janjetina, svinjetina, kobasice, pršut, slanina' },
  { icon: '🫒', name: 'Maslinovo ulje', desc: 'Extra djevičansko ulje, masline, paste' },
  { icon: '🍷', name: 'Vino', desc: 'Domaće vino, bijelo, crno, rosé, prošek' },
  { icon: '🍞', name: 'Pekarski proizvodi', desc: 'Domaći kruh, pogača, kolači, štrukli' },
  { icon: '🌿', name: 'Začini i biljni proizvodi', desc: 'Lavanda, ružmarin, bazilika, origano, čajevi' },
  { icon: '🍓', name: 'Džemovi, sokovi i zimnica', desc: 'Domaći džemovi, voćni sokovi, ajvar, ukiseljeno' },
]

export default function Categories() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="kategorije" className="py-20 bg-green-50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-lime-100 text-lime-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Što možeš naručiti
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-950 mb-4">
            10 kategorija domaćih proizvoda
          </h2>
          <p className="text-green-700 text-lg max-w-xl mx-auto">
            Od povrća do vina — sve što treba jednoj zdravoj, lokalno ukorijenjnoj kuhinji.
          </p>
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ${visible ? 'section-visible' : ''}`}>
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`animate-fade-in animate-delay-${Math.min((i % 5 + 1) * 100, 500)} group bg-white rounded-2xl p-5 text-center shadow-sm border border-green-100 hover:border-green-300 hover:shadow-md transition-all cursor-default`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {cat.icon}
              </div>
              <h3 className="font-bold text-green-950 text-sm leading-tight mb-1">{cat.name}</h3>
              <p className="text-green-600 text-xs leading-snug">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-10">
          <p className="text-green-600 text-sm">
            + mnogo više kategorija u planu — sugestije su dobrodošle!
          </p>
        </div>
      </div>
    </section>
  )
}
