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
