import { useEffect, useRef, useState } from 'react'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  image: string
  minute: number
  placeholder: boolean
}

const MJESECI = [
  'siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja',
  'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca',
]

function croDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}. ${MJESECI[m - 1]} ${y}.`
}

export default function BlogSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])

  // ponytail: posts.json is emitted by scripts/build-blog.mjs, already newest-first.
  // Fetched rather than imported because the blog is built AFTER vite (vite empties dist).
  useEffect(() => {
    fetch('/blog/posts.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: BlogPost[]) => setPosts(data.slice(0, 3)))
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

  const [lead, ...rest] = posts

  return (
    <section id="blog" className="py-20 bg-[#FAF7F2]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-white text-[#2D5016] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-[#c8ddb8]">
            Iz Tržnjaka
          </span>
          <h2 className="playfair text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
            Priče o domaćoj hrani
          </h2>
          <p className="text-[#2D5016] text-lg max-w-xl mx-auto">
            Savjeti, sezonska ponuda i ljudi iza proizvoda.
          </p>
        </div>

        <div className={`grid gap-6 lg:grid-cols-2 ${visible ? 'section-visible' : ''}`}>
          {/* Najnovija objava - velika */}
          <a
            href={`/blog/${lead.slug}`}
            className="animate-fade-in animate-delay-100 group block bg-white rounded-lg overflow-hidden shadow-sm border border-[#e3ded4] hover:border-[#5A8B35] hover:shadow-md transition-all"
          >
            {lead.image && (
              <img
                src={lead.image}
                alt=""
                width={1200}
                height={630}
                loading="lazy"
                className="w-full aspect-[1200/630] object-cover bg-[#EAF2E0]"
              />
            )}
            <div className="p-6">
              <p className="text-[#5A8B35] text-xs font-semibold uppercase tracking-wide mb-2">
                Najnovije · {croDate(lead.date)} · {lead.minute} min čitanja
              </p>
              <h3 className="playfair text-2xl font-bold text-[#111111] mb-3 leading-snug group-hover:text-[#2D5016] transition-colors">
                {lead.title}
              </h3>
              <p className="text-[#555] leading-relaxed">{lead.description}</p>
              <span className="inline-block mt-4 text-[#2D5016] font-semibold text-sm group-hover:underline">
                Pročitaj objavu →
              </span>
            </div>
          </a>

          {/* Ostale objave */}
          <div className="grid gap-6 content-start">
            {rest.map((p, i) => (
              <a
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={`animate-fade-in animate-delay-${(i + 2) * 100} group flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm border border-[#e3ded4] hover:border-[#5A8B35] hover:shadow-md transition-all p-4`}
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    width={200}
                    height={105}
                    loading="lazy"
                    className="hidden sm:block w-32 h-20 shrink-0 rounded object-cover bg-[#EAF2E0]"
                  />
                )}
                <div>
                  <p className="text-[#5A8B35] text-xs font-semibold uppercase tracking-wide mb-1">
                    {croDate(p.date)} · {p.minute} min
                  </p>
                  <h3 className="font-bold text-[#111111] leading-snug mb-1 group-hover:text-[#2D5016] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[#555] text-sm leading-snug line-clamp-2">{p.description}</p>
                </div>
              </a>
            ))}

            <a
              href="/blog"
              className="animate-fade-in animate-delay-400 text-center bg-[#2D5016] text-white font-semibold rounded-lg px-6 py-3.5 hover:bg-[#24400f] transition-colors"
            >
              Sve objave na blogu
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
