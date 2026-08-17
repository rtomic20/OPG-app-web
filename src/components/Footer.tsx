import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-12" style={{ backgroundColor: '#111E0B' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Logo size={28} variant="white" />
              <span className="playfair font-bold text-xl text-white">Tržnjak</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#7BA562' }}>
              Spajamo lokalne OPG-ove s kupcima koji cijene svježu i domaću hranu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="playfair text-white font-semibold mb-3">Navigacija</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#7BA562' }}>
              <li>
                <Link to="/opgovi" className="hover:text-white transition-colors">OPG-ovi</Link>
              </li>
              <li>
                {/* Plain <a>: /blog is a build-time static file, not a React route */}
                <a href="/blog" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <Link to="/prijava" className="hover:text-white transition-colors">Prijava</Link>
              </li>
              <li>
                <Link to="/registracija" className="hover:text-white transition-colors">Registracija</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="playfair text-white font-semibold mb-3">Kontakt</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#7BA562' }}>
              <li>
                <a href="mailto:infotrznjak@gmail.com" className="hover:text-white transition-colors">
                  infotrznjak@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+385996319003" className="hover:text-white transition-colors">
                  +385 99 631 9003
                </a>
              </li>
              <li style={{ color: '#7BA562' }}>Hrvatska</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm" style={{ borderColor: '#1E3A10', color: '#4E7A38' }}>
          <span>© {year} Tržnjak. Sva prava pridržana.</span>
          <div className="flex gap-4">
            <Link to="/privatnost" className="hover:text-white transition-colors">Privatnost</Link>
            <Link to="/uvjeti" className="hover:text-white transition-colors">Uvjeti korištenja</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
