import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Vendor {
  id: number
  name: string
  slug: string
  location: string
  latitude: string
  longitude: string
  avg_rating: number | null
}

export default function VendorMap({ vendors }: { vendors: Vendor[] }) {
  const center: [number, number] = [45.1, 15.2] // Centar HR

  return (
    <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vendors.map((v) => (
        <Marker key={v.id} position={[parseFloat(v.latitude), parseFloat(v.longitude)]}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{v.name}</p>
              <p className="text-gray-500">{v.location}</p>
              {v.avg_rating && <p className="text-yellow-500">{'★'.repeat(Math.round(v.avg_rating))}</p>}
              <Link to={`/opgovi/${v.slug}`} className="text-green-600 font-medium hover:underline">
                Pogledaj profil →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
