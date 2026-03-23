import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Navbar from '../components/Navbar'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [address, setAddress] = useState(user?.delivery_address || '')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    navigate('/kosarica')
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 text-center pb-16 px-4">
          <p className="text-4xl mb-4">🔐</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Prijava potrebna</h2>
          <p className="text-gray-500 mb-6">Moraš biti prijavljen/a za narudžbu</p>
          <Link
            to="/prijava"
            state={{ from: '/narudzba' }}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Prijavi se
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Nemaš račun?{' '}
            <Link to="/registracija" className="text-green-600 hover:underline">Registriraj se</Link>
          </p>
        </div>
      </div>
    )
  }

  const handleOrder = async () => {
    if (deliveryType === 'delivery' && !address.trim()) {
      setError('Unesi adresu dostave.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/orders/', {
        vendor_id: items[0].vendor_id,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? address : '',
        note,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      })
      clearCart()
      navigate('/narudzba/uspjeh')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0]
      setError(msg || 'Greška pri narudžbi. Pokušaj ponovno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Narudžba</h1>

        {/* Sažetak */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Pregled narudžbe — {items[0].vendor_name}</h2>
          {items.map((i) => (
            <div key={i.product_id} className="flex justify-between text-sm text-gray-600 py-1">
              <span>{i.product_name} × {i.quantity} {i.unit}</span>
              <span className="font-medium">{(i.price * i.quantity).toFixed(2)} €</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold text-gray-900">
            <span>Ukupno</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Način preuzimanja */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Način preuzimanja</h2>
          <div className="grid grid-cols-2 gap-2">
            {(['delivery', 'pickup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDeliveryType(t)}
                className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                  deliveryType === t
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'delivery' ? '🚚 Dostava' : '🏡 Preuzimanje'}
              </button>
            ))}
          </div>
        </div>

        {/* Adresa */}
        {deliveryType === 'delivery' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-2">Adresa dostave</h2>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ulica i broj, grad"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        )}

        {/* Napomena */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <h2 className="font-semibold text-gray-800 text-sm mb-2">Napomena (neobavezno)</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Posebni zahtjevi, alergije..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700">
          💳 Plaćanje pri dostavi / preuzimanju — gotovina ili kartica
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Slanje narudžbe...' : 'Pošalji narudžbu'}
        </button>
      </div>
    </div>
  )
}
