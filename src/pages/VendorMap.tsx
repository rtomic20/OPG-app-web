import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const pinIcon = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="#16a34a"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
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
        <Marker key={v.id} position={[parseFloat(v.latitude), parseFloat(v.longitude)]} icon={pinIcon}>
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
