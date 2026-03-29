import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-green-950 text-green-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <span>🌿</span>
              <span>Tržnjak</span>
            </div>
            <p className="text-green-400 text-sm leading-relaxed">
              Spajamo lokalne OPG-ove s kupcima koji cijene svježu i domaću hranu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Navigacija</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/opgovi" className="hover:text-white transition-colors">OPG-ovi</Link>
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
            <h3 className="text-white font-semibold mb-3">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:infotrznjak@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  infotrznjak@gmail.com
                </a>
              </li>
              <li className="text-green-400">Hrvatska</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-green-500">
          <span>© {year} Tržnjak. Sva prava pridržana.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-green-300 transition-colors">Privatnost</a>
            <a href="#" className="hover:text-green-300 transition-colors">Uvjeti korištenja</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
