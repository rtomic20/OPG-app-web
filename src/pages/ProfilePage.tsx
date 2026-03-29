import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface OrderItem {
  id: number
  product_name: string
  quantity: number
  unit: string
  unit_price: number
  line_total: number
}

interface Order {
  id: number
  vendor_name: string
  vendor_slug: string
  status: string
  delivery_type: string
  total: number
  payment_method: string
  payment_status: string
  items: OrderItem[]
  created_at: string
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Na čekanju',   color: 'bg-yellow-50 text-yellow-700' },
  confirmed:  { label: 'Potvrđeno',    color: 'bg-blue-50 text-blue-700' },
  preparing:  { label: 'U pripremi',   color: 'bg-purple-50 text-purple-700' },
  ready:      { label: 'Spremo',       color: 'bg-teal-50 text-teal-700' },
  delivering: { label: 'U dostavi',    color: 'bg-orange-50 text-orange-700' },
  delivered:  { label: 'Dostavljeno',  color: 'bg-green-50 text-green-700' },
  cancelled:  { label: 'Otkazano',     color: 'bg-red-50 text-red-600' },
}

type Tab = 'orders' | 'profile'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  // Profile edit
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', phone: '', delivery_address: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: (user as any).phone || '',
        delivery_address: user.delivery_address || '',
      })
    }
  }, [user])

  useEffect(() => {
    api.get('/orders/')
      .then((r) => setOrders(r.data?.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoadingOrders(false))
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    try {
      await api.patch('/auth/me/', profileForm)
      setProfileMsg('Podaci spremljeni.')
    } catch {
      setProfileMsg('Greška pri spremanju.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="py-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Zdravo, {user?.first_name || user?.email}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
              Odjava
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {([
              { key: 'orders', label: 'Moje narudžbe' },
              { key: 'profile', label: 'Moji podaci' },
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

          {/* Narudžbe */}
          {tab === 'orders' && (
            <div className="space-y-3">
              {loadingOrders ? (
                <p className="text-gray-400 text-center py-12">Učitavanje narudžbi...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="text-gray-500 font-medium">Nemaš još narudžbi</p>
                  <Link to="/opgovi" className="text-green-600 text-sm mt-2 block hover:underline">
                    Pregledaj OPG-ove →
                  </Link>
                </div>
              ) : orders.map((order) => {
                const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' }
                const isOpen = expanded === order.id
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">
                            {order.vendor_name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {' · '}
                          {order.delivery_type === 'delivery' ? 'Dostava' : 'Preuzimanje'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-green-700 text-sm">{parseFloat(String(order.total)).toFixed(2)} €</p>
                        <p className="text-xs text-gray-400 mt-0.5">{isOpen ? '▲' : '▼'}</p>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                        <div className="space-y-1.5 mb-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.product_name} × {item.quantity} {item.unit}
                              </span>
                              <span className="text-gray-900 font-medium">{parseFloat(String(item.line_total)).toFixed(2)} €</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400">
                            {order.payment_method === 'card' ? 'Kartica' : 'Gotovina'}
                            {' · '}
                            {order.payment_status === 'paid' ? 'Plaćeno' : 'Nije plaćeno'}
                          </span>
                          <Link
                            to={`/opgovi/${order.vendor_slug}`}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Posjet OPG-u →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Moji podaci */}
          {tab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md">
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ime</label>
                    <input
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm((f) => ({ ...f, first_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prezime</label>
                    <input
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm((f) => ({ ...f, last_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Adresa dostave</label>
                  <input
                    value={profileForm.delivery_address}
                    onChange={(e) => setProfileForm((f) => ({ ...f, delivery_address: e.target.value }))}
                    placeholder="Ulica i broj, grad"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                {profileMsg && (
                  <p className={`text-sm ${profileMsg.includes('Greška') ? 'text-red-600' : 'text-green-600'}`}>
                    {profileMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {profileLoading ? 'Spremanje...' : 'Spremi promjene'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}
