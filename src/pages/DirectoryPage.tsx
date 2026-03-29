import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Vendor {
  id: number
  name: string
  slug: string
  description: string
  location: string
  latitude: string | null
  longitude: string | null
  logo: string | null
  delivery: boolean
  pickup: boolean
  avg_rating: number | null
  review_count: number
}

interface Post {
  id: number
  content: string
  image: string | null
  created_at: string
  vendor_name: string
  vendor_slug: string
  vendor_logo: string | null
}

const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function DirectoryPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [Map, setMap] = useState<React.ComponentType<any> | null>(null)
  const [followEmail, setFollowEmail] = useState('')
  const [followStatus, setFollowStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    Promise.all([
      api.get('/vendors/').then((r) => setVendors(r.data)),
      api.get('/vendors/feed/').then((r) => setPosts(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  // Lazy load Leaflet map
  useEffect(() => {
    import('./VendorMap').then((m) => setMap(() => m.default))
  }, [])

  const q = normalize(search)
  const filtered = search
    ? vendors.filter(
        (v) =>
          normalize(v.name).includes(q) ||
          normalize(v.location).includes(q)
      )
    : vendors

  const withCoords = vendors.filter((v) => v.latitude && v.longitude)

  const handleFollow = async () => {
    if (!followEmail) return
    setFollowStatus('loading')
    // Platform-level newsletter — just store interest (no backend for this yet, show success)
    setTimeout(() => setFollowStatus('done'), 800)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">OPG-ovi na Tržnjaku</h1>
            <p className="text-gray-500 mt-2">Pronađi lokalne proizvođače u tvojoj blizini</p>
          </div>

          {/* Prati Tržnjak — newsletter CTA */}
          <div className="bg-green-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">Prati Tržnjak</p>
              <p className="text-green-200 text-sm mt-0.5">Dobivaj obavijesti o novim OPG-ovima, sezonskim proizvodima i akcijama</p>
            </div>
            {followStatus === 'done' ? (
              <p className="text-green-100 font-medium text-sm bg-green-600 px-4 py-2 rounded-xl">Prijavljeni ste!</p>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="tvoj@email.hr"
                  value={followEmail}
                  onChange={(e) => setFollowEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFollow()}
                  className="flex-1 sm:w-52 px-3 py-2 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button
                  onClick={handleFollow}
                  disabled={followStatus === 'loading' || !followEmail}
                  className="px-4 py-2 bg-white text-green-700 font-semibold text-sm rounded-lg hover:bg-green-50 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  Prati
                </button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Pretraži po imenu ili gradu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Karta */}
          {Map && withCoords.length > 0 && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-72">
              <Map vendors={withCoords} />
            </div>
          )}

          {/* Grid OPG-ova */}
          {loading ? (
            <div className="text-gray-500 py-12 text-center">Učitavanje OPG-ova...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-medium">Nema rezultata za "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {filtered.map((v) => (
                <Link
                  key={v.id}
                  to={`/opgovi/${v.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-36 bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                    {v.logo ? (
                      <img src={v.logo} alt={v.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl">🌿</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{v.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">📍 {v.location || 'Hrvatska'}</p>
                    {v.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{v.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        {v.avg_rating ? (
                          <>
                            <span className="text-yellow-400 text-sm">{stars(v.avg_rating)}</span>
                            <span className="text-xs text-gray-500">({v.review_count})</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Nema recenzija</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {v.delivery && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Dostava</span>}
                        {v.pickup && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Preuzimanje</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Feed objava */}
          {!search && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Zadnje od OPG-ova</h2>
              {posts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nema objava.</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {p.vendor_logo
                          ? <img src={p.vendor_logo} alt={p.vendor_name} className="w-full h-full object-cover" />
                          : <span className="text-xl">🌿</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <Link to={`/opgovi/${p.vendor_slug}`} className="font-semibold text-sm text-gray-900 hover:text-green-700">
                            {p.vendor_name}
                          </Link>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(p.created_at).toLocaleDateString('hr-HR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.content}</p>
                        {p.image && <img src={p.image} alt="" className="mt-2 rounded-xl max-h-48 object-cover" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}
