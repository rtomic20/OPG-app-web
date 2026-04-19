import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function UvjetiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Uvjeti korištenja</h1>
        <p className="text-sm text-gray-500 mb-10">Datum stupanja na snagu: 19. travnja 2026.</p>

        <section className="space-y-10 text-gray-700 leading-relaxed">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. O platformi</h2>
            <p>Tržnjak je digitalna tržnica koja spaja kupce s lokalnim OPG-ovima (Obiteljskim Poljoprivrednim Gospodarstvima) u Hrvatskoj. Platforma omogućuje pregled ponude, komunikaciju i naručivanje proizvoda.</p>
            <p className="mt-2">Vlasnik i operater platforme: <strong>Rino Tomić</strong><br />Kontakt: <a href="mailto:tomic.rino@gmail.com" className="text-green-600 underline">tomic.rino@gmail.com</a></p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Prihvaćanje uvjeta</h2>
            <p>Korištenjem platforme Tržnjak prihvaćate ove Uvjete korištenja. Ako se ne slažete s uvjetima, molimo vas da ne koristite platformu.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Tko može koristiti platformu</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Platformu mogu koristiti fizičke osobe starije od 18 godina</li>
              <li>OPG vlasnici moraju biti registrirani kao OPG u Republici Hrvatskoj</li>
              <li>Zabranjeno je kreiranje više od jednog računa za istu osobu ili poslovni subjekt</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Odgovornost za proizvode</h2>
            <p>Tržnjak je posrednička platforma. OPG vlasnici su isključivo odgovorni za:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Točnost opisa i fotografija proizvoda</li>
              <li>Kvalitetu i svježinu isporučenih proizvoda</li>
              <li>Usklađenost s propisima o prodaji hrane</li>
              <li>Ispunjenje narudžbi u dogovorenom roku</li>
            </ul>
            <p className="mt-3">Tržnjak ne odgovara za kvalitetu proizvoda, kašnjenja u dostavi niti sporove između kupaca i OPG-ova, osim u slučaju tehničkih grešaka platforme.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Plaćanje</h2>
            <p>Plaćanje se vrši putem platforme Stripe. Tržnjak ne pohranjuje podatke o platnoj kartici. Sva plaćanja su sigurna i zaštićena SSL enkripcijom.</p>
            <p className="mt-2">U slučaju otkazivanja narudžbe, povrat sredstava vrši se prema pravilima OPG prodavača i platforme Stripe.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Zabranjena ponašanja</h2>
            <p>Korisnicima je zabranjeno:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Lažno predstavljanje ili kreiranje lažnih profila</li>
              <li>Objavljivanje netočnih informacija o proizvodima</li>
              <li>Zlouporaba sustava recenzija i ocjenjivanja</li>
              <li>Pokušaj zaobilaženja platforme radi izravnog plaćanja</li>
              <li>Spam, ometanje ili zlouporaba komunikacijskih kanala</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Ukidanje računa</h2>
            <p>Tržnjak zadržava pravo privremeno ili trajno obustaviti račun koji krši ove Uvjete korištenja, bez prethodne najave.</p>
            <p className="mt-2">Korisnici mogu sami obrisati račun u postavkama profila. Brisanjem računa osobni podaci se anonimiziraju, a povijest narudžbi čuva se u skladu s poreznim propisima RH.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Intelektualno vlasništvo</h2>
            <p>Naziv, logo i dizajn platforme Tržnjak vlasništvo su Rina Tomića. Zabranjeno je kopiranje, reproduciranje ili korištenje bez izričitog pisanog odobrenja.</p>
            <p className="mt-2">Fotografije i opisi proizvoda koje objavljuju OPG vlasnici ostaju njihovo vlasništvo. Objavom na platformi daju Tržnjaku pravo prikazivanja tih sadržaja.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Izmjene uvjeta</h2>
            <p>Tržnjak može izmijeniti ove Uvjete korištenja uz obavijest putem emaila ili platforme najmanje 14 dana unaprijed. Nastavak korištenja platforme znači prihvaćanje izmijenjenih uvjeta.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Mjerodavno pravo</h2>
            <p>Na ove Uvjete korištenja primjenjuje se pravo Republike Hrvatske. Za rješavanje sporova nadležan je sud u Rijeci.</p>
          </div>

        </section>

        <p className="mt-16 text-sm text-gray-400 italic">Tržnjak — svježa lokalna hrana, direktno od farmera.</p>
      </main>
      <Footer />
    </div>
  )
}
