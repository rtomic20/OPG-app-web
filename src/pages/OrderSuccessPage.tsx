import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 text-center px-4">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Narudžba primljena!</h1>
        <p className="text-gray-500 mb-2">OPG je obavješten o tvojoj narudžbi.</p>
        <p className="text-gray-500 mb-8">Kontaktirat će te za potvrdu i dogovor dostave.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/opgovi"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Nastavi kupovinu
          </Link>
          <Link
            to="/"
            className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Povratak na početnu
          </Link>
        </div>
      </div>
    </div>
  )
}
