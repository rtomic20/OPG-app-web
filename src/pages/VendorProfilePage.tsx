import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'

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

const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

export default function VendorProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { addItem } = useCart()

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'products' | 'posts' | 'reviews'>('products')
  const [followEmail, setFollowEmail] = useState('')
  const [followStatus, setFollowStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [added, setAdded] = useState<number | null>(null)

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

  const handleAddToCart = (product: Product) => {
    if (!vendor) return
    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1,
      vendor_id: vendor.id,
      vendor_name: vendor.name,
      vendor_slug: vendor.slug,
    })
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1500)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 text-center text-gray-500">Učitavanje...</div>
    </div>
  )

  if (!vendor) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 text-center text-gray-500">OPG nije pronađen.</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cover + Header */}
      <div className="pt-16">
        <div className="h-48 bg-gradient-to-br from-green-200 to-emerald-100 relative">
          {vendor.cover_image && (
            <img src={vendor.cover_image} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end gap-4 -mt-10 pb-4 relative z-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              {vendor.logo ? (
                <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🌿</span>
              )}
            </div>
            <div className="pb-2 flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words">{vendor.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm text-gray-500">📍 {vendor.location}</span>
                {vendor.avg_rating && (
                  <span className="text-sm">
                    <span className="text-yellow-400">{stars(vendor.avg_rating)}</span>
                    <span className="text-gray-500 ml-1">({vendor.review_count})</span>
                  </span>
                )}
                {vendor.delivery && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">Dostava</span>}
                {vendor.pickup && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">Preuzimanje</span>}
              </div>
            </div>
          </div>

          {vendor.description && (
            <p className="text-gray-600 text-sm pb-4">{vendor.description}</p>
          )}

          {/* Follow */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">🔔 Prati ovaj OPG</p>
            <p className="text-xs text-gray-500 mb-3">Dobivaj obavijesti o novim proizvodima i objavama</p>
            {followStatus === 'done' ? (
              <p className="text-sm text-green-600 font-medium">✓ Pratitelj si ovog OPG-a!</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tvoj@email.hr"
                  value={followEmail}
                  onChange={(e) => setFollowEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  onKeyDown={(e) => e.key === 'Enter' && handleFollow()}
                />
                <button
                  onClick={handleFollow}
                  disabled={followStatus === 'loading' || !followEmail}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Prati
                </button>
              </div>
            )}
            {followStatus === 'error' && <p className="text-xs text-red-500 mt-1">Greška. Pokušaj ponovno.</p>}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-6">
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
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
                <p className="text-gray-400 col-span-3 text-center py-8">Nema dostupnih proizvoda.</p>
              ) : products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="h-36 bg-gray-50 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-4xl">🥦</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                    {p.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-green-700">{parseFloat(String(p.price)).toFixed(2)} € / {p.unit}</span>
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={!p.is_available}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          added === p.id
                            ? 'bg-green-100 text-green-700'
                            : p.is_available
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {added === p.id ? '✓ Dodano' : p.is_available ? 'Dodaj' : 'Nedostupno'}
                      </button>
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
                <p className="text-gray-400 text-center py-8">Nema objava.</p>
              ) : posts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{p.content}</p>
                  {p.image && <img src={p.image} alt="" className="mt-3 rounded-xl w-full max-h-72 object-cover" />}
                  <p className="text-xs text-gray-400 mt-2">
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
                <p className="text-gray-400 text-center py-8">Nema recenzija.</p>
              ) : reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-800">{r.customer_name}</span>
                    <span className="text-yellow-400 text-sm">{stars(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">
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
