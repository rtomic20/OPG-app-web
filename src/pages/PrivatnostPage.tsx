import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivatnostPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pravila privatnosti</h1>
        <p className="text-sm text-gray-500 mb-10">Datum stupanja na snagu: 19. travnja 2026.</p>

        <section className="space-y-10 text-gray-700 leading-relaxed">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Tko smo i kako nas kontaktirati</h2>
            <p>Voditelj obrade osobnih podataka je:</p>
            <p className="mt-2 font-medium">Rino Tomić, vlasnik platforme Tržnjak</p>
            <p>Email: <a href="mailto:tomic.rino@gmail.com" className="text-green-600 underline">tomic.rino@gmail.com</a></p>
            <p className="mt-2">Za sva pitanja vezana uz obradu osobnih podataka, brisanje računa ili ostvarivanje vaših prava, obratite se na gornji email.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Koje osobne podatke prikupljamo</h2>
            <p className="font-medium mb-1">Podaci koje nam sami dajete:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Ime i prezime</li>
              <li>Email adresa</li>
              <li>Broj mobitela</li>
              <li>Adresa dostave</li>
            </ul>
            <p className="font-medium mb-1">Podaci koji nastaju korištenjem platforme:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Povijest narudžbi i poruka s OPG prodavačima</li>
              <li>Ocjene i recenzije koje ostavite</li>
              <li>Lokacija uređaja (samo kada tražite OPG-ove u blizini — ne pohranjujemo je trajno)</li>
              <li>FCM token uređaja (za slanje push obavijesti)</li>
            </ul>
            <p className="font-medium mb-1">Podaci koje ne prikupljamo:</p>
            <p>Podatke o platnoj kartici — platni promet obrađuje Stripe kao zasebni procesor u skladu s PCI DSS standardima. Mi nikada ne vidimo niti pohranjujemo vaše kartične podatke.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Zašto obrađujemo vaše podatke i na kojoj pravnoj osnovi</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 border border-gray-200 font-medium">Svrha</th>
                    <th className="text-left p-3 border border-gray-200 font-medium">Pravna osnova</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Kreiranje i upravljanje korisničkim računom', 'Izvršenje ugovora'],
                    ['Obrada i dostava narudžbi', 'Izvršenje ugovora'],
                    ['Komunikacija između kupca i OPG prodavača', 'Izvršenje ugovora'],
                    ['Slanje push obavijesti o statusu narudžbe', 'Privola (možete isključiti u postavkama uređaja)'],
                    ['Sigurnost platforme i sprječavanje prijevara', 'Legitimni interes'],
                    ['Ispunjavanje poreznih i računovodstvenih obveza', 'Zakonska obveza'],
                  ].map(([svrha, osnova], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-200">{svrha}</td>
                      <td className="p-3 border border-gray-200">{osnova}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Koliko dugo čuvamo vaše podatke</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Korisnički račun i profil:</strong> dok je račun aktivan, plus 12 mjeseci nakon brisanja</li>
              <li><strong>Narudžbe:</strong> 11 godina od datuma narudžbe (obveza prema poreznim propisima RH)</li>
              <li><strong>Poruke u narudžbi:</strong> 2 godine od datuma narudžbe</li>
              <li><strong>FCM token:</strong> do odjave s uređaja ili brisanja računa</li>
              <li><strong>Lokacija:</strong> ne pohranjujemo trajno — koristi se samo u trenutku pretrage</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. S kim dijelimo vaše podatke</h2>
            <p className="mb-3">Vaše osobne podatke ne prodajemo trećim stranama. Dijelimo ih isključivo s pružateljima usluga nužnih za rad platforme:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Stripe Inc.</strong> — obrada plaćanja</li>
              <li><strong>Google LLC / Firebase</strong> — push obavijesti i autentifikacija</li>
              <li><strong>Pružatelj email usluge</strong> — slanje transakcijskih emailova (potvrde narudžbi, reset lozinke)</li>
            </ul>
            <p className="mt-3">Sve treće strane obvezane su ugovorom o obradi podataka i ne smiju koristiti vaše podatke u vlastite svrhe.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Vaša prava</h2>
            <p className="mb-3">Kao korisnik imate sljedeća prava prema GDPR-u:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Pravo na pristup</strong> — možete zatražiti kopiju osobnih podataka koje čuvamo o vama</li>
              <li><strong>Pravo na ispravak</strong> — možete ispraviti netočne ili nepotpune podatke</li>
              <li><strong>Pravo na brisanje</strong> — možete zatražiti brisanje računa i osobnih podataka (uz napomenu da neke podatke moramo čuvati zbog zakonskih obveza)</li>
              <li><strong>Pravo na prenosivost</strong> — možete zatražiti vaše podatke u strojno čitljivom formatu</li>
              <li><strong>Pravo na prigovor</strong> — možete se usprotiviti određenim vrstama obrade</li>
              <li><strong>Pravo na povlačenje privole</strong> — za obradu temeljenu na privoli (push obavijesti), možete je povući u bilo kojem trenutku bez posljedica</li>
            </ul>
            <p className="mt-3">Za ostvarivanje bilo kojeg od ovih prava pišite na: <a href="mailto:tomic.rino@gmail.com" className="text-green-600 underline">tomic.rino@gmail.com</a><br />Na vaš zahtjev odgovoriti ćemo u roku od 30 dana.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Pravo prigovora nadzornom tijelu</h2>
            <p>Ako smatrate da vaše podatke obrađujemo na nezakonit način, imate pravo podnijeti prigovor Agenciji za zaštitu osobnih podataka (AZOP):</p>
            <p className="mt-2"><strong>AZOP — Agencija za zaštitu osobnih podataka</strong><br />
              Web: <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">azop.hr</a><br />
              Email: <a href="mailto:azop@azop.hr" className="text-green-600 underline">azop@azop.hr</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Sigurnost podataka</h2>
            <p>Koristimo industrijski standardne mjere zaštite:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>HTTPS enkripcija svih komunikacija</li>
              <li>JWT autentifikacija s kratkim rokom trajanja tokena</li>
              <li>Višefaktorska autentifikacija (MFA) dostupna za sve korisnike</li>
              <li>Lozinke se nikada ne pohranjuju u čitljivom obliku</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Kolačići (Cookies)</h2>
            <p>Platforma Tržnjak koristi isključivo session kolačiće nužne za funkcioniranje autentifikacije. Ne koristimo kolačiće za praćenje ili oglašavanje.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Izmjene ovih Pravila</h2>
            <p>O bitnim izmjenama Pravila privatnosti obavijestit ćemo vas emailom ili obavijesti unutar aplikacije najmanje 14 dana unaprijed. Nastavak korištenja platforme nakon stupanja izmjena na snagu znači prihvaćanje novih Pravila.</p>
          </div>

        </section>

        <p className="mt-16 text-sm text-gray-400 italic">Tržnjak — svježa lokalna hrana, direktno od farmera.</p>
      </main>
      <Footer />
    </div>
  )
}
