import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'

export default function CartPage() {
  const { items, updateQty, removeItem, total, vendorSlug } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 text-center pb-16">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Košarica je prazna</h2>
        <p className="text-gray-500 mb-6">Dodaj proizvode od lokalnih OPG-ova</p>
        <Link to="/opgovi" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
          Pregledaj OPG-ove
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Košarica</h1>
        {vendorSlug && (
          <p className="text-sm text-gray-500 mb-6">
            Narudžba od{' '}
            <Link to={`/opgovi/${vendorSlug}`} className="text-green-600 hover:underline font-medium">
              {items[0]?.vendor_name}
            </Link>
          </p>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          {items.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-500">{item.price.toFixed(2)} € / {item.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.product_id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm"
                >−</button>
                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.product_id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm"
                >+</button>
              </div>
              <p className="text-sm font-semibold text-gray-900 w-16 text-right">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
              <button onClick={() => removeItem(item.product_id)} className="text-gray-300 hover:text-red-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Međuzbroj</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <div className="flex items-center justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-2 mt-2">
            <span>Ukupno</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">* Plaćanje pri dostavi / preuzimanju</p>
        </div>

        <button
          onClick={() => navigate('/narudzba')}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Nastavi na narudžbu →
        </button>
      </div>
      <Footer />
    </div>
  )
}
