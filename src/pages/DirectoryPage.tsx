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

const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

export default function DirectoryPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [Map, setMap] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    api.get('/vendors/').then((r) => setVendors(r.data)).finally(() => setLoading(false))
  }, [])

  // Lazy load Leaflet map
  useEffect(() => {
    import('./VendorMap').then((m) => setMap(() => m.default))
  }, [])

  const filtered = search
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.location.toLowerCase().includes(search.toLowerCase())
      )
    : vendors

  const withCoords = filtered.filter((v) => v.latitude && v.longitude)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">OPG-ovi na Tržnjaku</h1>
            <p className="text-gray-500 mt-2">Pronađi lokalne proizvođače u tvojoj blizini</p>
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

          {/* Grid */}
          {loading ? (
            <div className="text-gray-500 py-12 text-center">Učitavanje OPG-ova...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-medium">Nema rezultata za "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </div>
      </div>
      <Footer />
    </div>
  )
}
