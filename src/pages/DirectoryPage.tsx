import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Leaf, Search } from 'lucide-react'
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

const starRating = (n: number) =>
  Array.from({ length: 5 }, (_, i) => (i < Math.round(n) ? '★' : '☆')).join('')

const normalize = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const dmSans: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" }
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" }

export default function DirectoryPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [Map, setMap] = useState<React.ComponentType<any> | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridVisible, setGridVisible] = useState(false)

  const showTest = new URLSearchParams(window.location.search).get('show_test') === '1'

  useEffect(() => {
    api
      .get('/vendors/')
      .then((r) =>
        setVendors(
          (r.data as Vendor[]).filter((v) => showTest || !v.slug.startsWith('test-'))
        )
      )
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    import('./VendorMap').then((m) => setMap(() => m.default))
  }, [])

  const q = normalize(search)
  const filtered = search
    ? vendors.filter(
        (v) => normalize(v.name).includes(q) || normalize(v.location).includes(q)
      )
    : vendors

  const withCoords = vendors.filter((v) => v.latitude && v.longitude)

  useEffect(() => {
    if (loading || filtered.length === 0) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setGridVisible(true) },
      { threshold: 0.1 }
    )
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, filtered.length])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2', ...dmSans }}>
      <Navbar />

      <div className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="py-10">
            <p
              style={{
                ...dmSans,
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#2D5016',
                marginBottom: '10px',
              }}
            >
              Lokalni proizvođači
            </p>
            <h1
              style={{
                ...playfair,
                fontSize: 'clamp(28px, 5vw, 42px)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#111111',
                marginBottom: '10px',
              }}
            >
              OPG-ovi na Tržnjaku
            </h1>
            <p style={{ ...dmSans, fontSize: '15px', lineHeight: '26px', color: '#555' }}>
              Svježi lokalni proizvodi direktno od farmera iz tvoje regije
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 max-w-md">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#2D5016' }}
              />
              <input
                type="text"
                placeholder="Pretraži po imenu ili gradu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  ...dmSans,
                  width: '100%',
                  height: '44px',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  fontSize: '14px',
                  color: '#111',
                  backgroundColor: '#fff',
                  border: `1.5px solid ${searchFocused ? '#2D5016' : '#D8D8D8'}`,
                  borderRadius: '4px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>
          </div>

          {/* Map */}
          {Map && withCoords.length > 0 && (
            <div
              className="mb-8 overflow-hidden"
              style={{ height: '288px', borderRadius: '8px', border: '1px solid #EAF2E0' }}
            >
              <Map vendors={withCoords} />
            </div>
          )}

          {/* Vendor grid */}
          {loading ? (
            <div
              className="py-16 text-center"
              style={{ ...dmSans, fontSize: '15px', color: '#888' }}
            >
              Učitavanje OPG-ova...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{ width: '48px', height: '48px' }}
              >
                <Search size={36} style={{ color: '#CDA274' }} />
              </div>
              <p style={{ ...playfair, fontSize: '20px', color: '#333', marginBottom: '8px' }}>
                Nema rezultata za „{search}"
              </p>
              <p style={{ ...dmSans, fontSize: '14px', color: '#888' }}>
                Pokušaj s drugim pojmom ili gradom
              </p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12 ${gridVisible ? 'section-visible' : ''}`}
            >
              {filtered.map((v, i) => (
                <VendorCard key={v.id} vendor={v} index={i} />
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  )
}

function VendorCard({ vendor: v, index }: { vendor: Vendor; index: number }) {
  const [hovered, setHovered] = useState(false)
  const dmSans: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" }
  const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" }

  return (
    <Link
      to={`/opgovi/${v.slug}`}
      className={`animate-fade-in animate-delay-${Math.min((index % 4 + 1) * 100, 400)}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: `1px solid ${hovered ? '#C8DFB8' : '#E8E8E8'}`,
        overflow: 'hidden',
        boxShadow: hovered ? '0 4px 16px rgba(45,80,22,0.10)' : 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card image */}
      <div
        style={{
          height: '144px',
          backgroundColor: '#EAF2E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {v.logo ? (
          <>
            <img
              src={v.logo}
              alt={v.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.04) 100%)',
              }}
            />
          </>
        ) : (
          <Leaf size={38} style={{ color: '#5A8B35' }} />
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '16px' }}>
        <h3
          style={{
            ...playfair,
            fontSize: '17px',
            fontWeight: 600,
            color: hovered ? '#2D5016' : '#111111',
            marginBottom: '4px',
            transition: 'color 0.15s',
          }}
        >
          {v.name}
        </h3>
        <p
          style={{
            ...dmSans,
            fontSize: '12px',
            color: '#888',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: v.description ? '8px' : '12px',
          }}
        >
          <MapPin size={12} style={{ color: '#2D5016', flexShrink: 0 }} />
          {v.location || 'Hrvatska'}
        </p>
        {v.description && (
          <p
            className="line-clamp-2"
            style={{
              ...dmSans,
              fontSize: '13px',
              color: '#555',
              lineHeight: '20px',
              marginBottom: '12px',
            }}
          >
            {v.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {v.avg_rating ? (
              <>
                <span style={{ color: '#D4652A', fontSize: '12px', letterSpacing: '1px' }}>
                  {starRating(v.avg_rating)}
                </span>
                <span style={{ ...dmSans, fontSize: '11px', color: '#888' }}>
                  ({v.review_count})
                </span>
              </>
            ) : (
              <span style={{ ...dmSans, fontSize: '11px', color: '#AAA' }}>Nema recenzija</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {v.delivery && (
              <span
                style={{
                  ...dmSans,
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: '#EAF2E0',
                  color: '#2D5016',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                Dostava
              </span>
            )}
            {v.pickup && (
              <span
                style={{
                  ...dmSans,
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: '#FBF0E8',
                  color: '#D4652A',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                Preuzimanje
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
