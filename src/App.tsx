import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import LandingPage from './pages/LandingPage'
import DirectoryPage from './pages/DirectoryPage'
import VendorProfilePage from './pages/VendorProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/opgovi" element={<DirectoryPage />} />
          <Route path="/opgovi/:slug" element={<VendorProfilePage />} />
          <Route path="/prijava" element={<LoginPage />} />
          <Route path="/registracija" element={<RegisterPage />} />
          <Route path="/kosarica" element={<CartPage />} />
          <Route path="/narudzba" element={<CheckoutPage />} />
          <Route path="/narudzba/uspjeh" element={<OrderSuccessPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
