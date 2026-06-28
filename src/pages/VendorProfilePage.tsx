import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Leaf, Sprout } from 'lucide-react'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Vendor {
  id: number
  name: string
  slug: string
  description: string
  location: string
  address: string
  phone: string
  email: string
  logo: string | null
  cover_image: string | null
  delivery: boolean
  pickup: boolean
  min_order: number
  delivery_radius_km: number
  avg_rating: number | null
  review_count: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  stock: number
  image: string | null
  is_available: boolean
  category_name?: string
}

interface Review {
  id: number
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

interface Post {
  id: number
  content: string
  image: string | null
  created_at: string
}

const starRating = (n: number) =>
  Array.from({ length: 5 }, (_, i) => (i < Math.round(n) ? '★' : '☆')).join('')

export default function VendorProfilePage() {
  const { slug } = useParams<{ slug: string }>()

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'products' | 'posts' | 'reviews'>('products')
  const [followEmail, setFollowEmail] = useState('')
  const [followStatus, setFollowStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!slug) return
    Promise.allSettled([
      api.get(`/vendors/${slug}/`),
      api.get(`/vendors/${slug}/products/`),
      api.get(`/vendors/${slug}/reviews/`),
      api.get(`/vendors/${slug}/posts/`),
    ]).then(([v, p, r, po]) => {
      if (v.status === 'fulfilled') setVendor(v.value.data)
      if (p.status === 'fulfilled') setProducts(p.value.data?.results ?? p.value.data)
      if (r.status === 'fulfilled') setReviews(r.value.data)
      if (po.status === 'fulfilled') setPosts(po.value.data)
    }).finally(() => setLoading(false))
  }, [slug])

  const handleFollow = async () => {
    if (!followEmail || !slug) return
    setFollowStatus('loading')
    try {
      await api.post(`/vendors/${slug}/follow/`, { email: followEmail })
      setFollowStatus('done')
    } catch {
      setFollowStatus('error')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />
      <div className="pt-28 text-center text-[#888]">Učitavanje...</div>
    </div>
  )

  if (!vendor) return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />
      <div className="pt-28 text-center text-[#888]">OPG nije pronađen.</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />

      {/* Cover + Header */}
      <div className="pt-16">
        <div className="h-48 bg-[#EAF2E0] relative">
          {vendor.cover_image && (
            <>
              <img src={vendor.cover_image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            </>
          )}
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end gap-4 -mt-10 pb-4 relative z-10">
            <div className="w-20 h-20 rounded-lg border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              {vendor.logo ? (
                <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
              ) : (
                <Leaf size={32} style={{ color: '#5A8B35' }} />
              )}
            </div>
            <div className="pb-2 flex-1 min-w-0">
              <h1 className={`playfair text-2xl font-bold break-words ${vendor.cover_image ? 'text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]' : 'text-[#111111]'}`}>
                {vendor.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm text-[#888] flex items-center gap-1">
                  <MapPin size={13} style={{ color: '#2D5016' }} />
                  {vendor.location}
                </span>
                {vendor.avg_rating && (
                  <span className="text-sm">
                    <span className="text-[#D4652A]">{starRating(vendor.avg_rating)}</span>
                    <span className="text-[#888] ml-1">({vendor.review_count})</span>
                  </span>
                )}
                {vendor.delivery && (
                  <span className="text-xs bg-[#EAF2E0] text-[#2D5016] px-2 py-0.5 rounded-full border border-[#c8ddb8]">
                    Dostava
                  </span>
                )}
                {vendor.pickup && (
                  <span className="text-xs bg-[#FBF0E8] text-[#D4652A] px-2 py-0.5 rounded-full border border-[#f0d4b8]">
                    Preuzimanje
                  </span>
                )}
              </div>
            </div>
          </div>

          {vendor.description && (
            <p className="text-[#555] text-sm pb-4">{vendor.description}</p>
          )}

          {/* Follow */}
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-4 mb-6">
            <p className="text-sm font-semibold text-[#111] mb-1">Prati ovaj OPG</p>
            <p className="text-xs text-[#888] mb-3">Dobivaj obavijesti o novim proizvodima i objavama</p>
            {followStatus === 'done' ? (
              <p className="text-sm text-[#2D5016] font-medium">✓ Pratitelj si ovog OPG-a!</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tvoj@email.hr"
                  value={followEmail}
                  onChange={(e) => setFollowEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#D8D8D8] rounded text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleFollow()}
                />
                <button
                  onClick={handleFollow}
                  disabled={followStatus === 'loading' || !followEmail}
                  className="px-4 py-2 bg-[#2D5016] hover:bg-[#3D6A1F] text-white text-sm font-medium disabled:opacity-50 transition-colors"
                  style={{ borderRadius: '4px' }}
                >
                  Prati
                </button>
              </div>
            )}
            {followStatus === 'error' && <p className="text-xs text-red-500 mt-1">Greška. Pokušaj ponovno.</p>}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#E8E8E8] mb-6">
            {([
              { key: 'products', label: `Proizvodi (${products.length})` },
              { key: 'posts', label: `Objave (${posts.length})` },
              { key: 'reviews', label: `Recenzije (${reviews.length})` },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t.key
                    ? 'border-[#2D5016] text-[#2D5016]'
                    : 'border-transparent text-[#888] hover:text-[#333]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Proizvodi */}
          {tab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
              {products.length === 0 ? (
                <p className="text-[#888] col-span-3 text-center py-8">Nema dostupnih proizvoda.</p>
              ) : products.map((p) => (
                <div key={p.id} className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
                  <div className="h-36 bg-[#EAF2E0] flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <Sprout size={36} style={{ color: '#5A8B35' }} />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-[#111] text-sm">{p.name}</h3>
                    {p.description && <p className="text-xs text-[#888] mt-0.5 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-[#2D5016]">{parseFloat(String(p.price)).toFixed(2)} € / {p.unit}</span>
                      {!p.is_available && (
                        <span className="text-xs text-[#888] bg-[#F5F5F5] px-3 py-1.5 rounded">Nedostupno</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Objave */}
          {tab === 'posts' && (
            <div className="space-y-4 pb-12">
              {posts.length === 0 ? (
                <p className="text-[#888] text-center py-8">Nema objava.</p>
              ) : posts.map((p) => (
                <div key={p.id} className="bg-white rounded-lg border border-[#E8E8E8] p-4">
                  <p className="text-sm text-[#333] whitespace-pre-wrap">{p.content}</p>
                  {p.image && <img src={p.image} alt="" className="mt-3 rounded-lg w-full max-h-72 object-cover" />}
                  <p className="text-xs text-[#888] mt-2">
                    {new Date(p.created_at).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Recenzije */}
          {tab === 'reviews' && (
            <div className="space-y-3 pb-12">
              {reviews.length === 0 ? (
                <p className="text-[#888] text-center py-8">Nema recenzija.</p>
              ) : reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-lg border border-[#E8E8E8] p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-[#111]">{r.customer_name}</span>
                    <span className="text-[#D4652A] text-sm">{starRating(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-sm text-[#555]">{r.comment}</p>}
                  <p className="text-xs text-[#888] mt-1">
                    {new Date(r.created_at).toLocaleDateString('hr-HR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
