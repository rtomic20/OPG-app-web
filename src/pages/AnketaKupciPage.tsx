import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwpKv5aXrkB6X5NqN7P85cjFZlhAli4jejOdFh8Eo_LLDb0x8S7uRPmHWjW4NL89rHU/exec'

const ZUPANIJE = [
  'Grad Zagreb','Zagrebačka','Krapinsko-zagorska','Sisačko-moslavačka','Karlovačka',
  'Varaždinska','Koprivničko-križevačka','Bjelovarsko-bilogorska','Primorsko-goranska',
  'Ličko-senjska','Virovitičko-podravska','Požeško-slavonska','Brodsko-posavska',
  'Zadarska','Osječko-baranjska','Šibensko-kninska','Vukovarsko-srijemska',
  'Splitsko-dalmatinska','Istarska','Dubrovačko-neretvanska','Međimurska',
]

type Answers = Record<string, string | number | string[]>

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1.5px solid #D4C9B8',
  borderRadius: 8, fontSize: 13, color: '#1A1A1A', outline: 'none',
  background: 'white', fontFamily: 'inherit',
}

function RadioGroup({ id, options, answers, setAnswers }: {
  id: string
  options: { label: string; hasOther?: boolean }[]
  answers: Answers
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>
}) {
  const [showOther, setShowOther] = useState(false)
  const [otherVal, setOtherVal] = useState('')

  const select = (label: string, isOther: boolean) => {
    setShowOther(isOther)
    setAnswers(a => ({ ...a, [id]: isOther ? (otherVal || 'Ostalo') : label }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const isSelected = answers[id] === opt.label || (opt.hasOther && showOther)
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => select(opt.label, !!opt.hasOther)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 8, border: `1.5px solid ${isSelected ? '#7CB518' : '#D4C9B8'}`,
              background: isSelected ? '#E8F0D8' : 'white', cursor: 'pointer',
              fontSize: 13, color: isSelected ? '#2D5016' : '#1A1A1A',
              fontWeight: isSelected ? 500 : 400, textAlign: 'left', width: '100%',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            <span style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${isSelected ? '#7CB518' : '#D4C9B8'}`,
              background: isSelected ? '#7CB518' : 'white', position: 'relative',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isSelected && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
            </span>
            {opt.label}
          </button>
        )
      })}
      {showOther && (
        <input
          style={inputStyle}
          placeholder="Molimo opišite..."
          value={otherVal}
          onChange={e => { setOtherVal(e.target.value); setAnswers(a => ({ ...a, [id]: e.target.value || 'Ostalo' })) }}
        />
      )}
    </div>
  )
}

function CheckGroup({ id, options, answers, setAnswers }: {
  id: string
  options: { label: string; hasOther?: boolean }[]
  answers: Answers
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>
}) {
  const [otherChecked, setOtherChecked] = useState(false)
  const [otherVal, setOtherVal] = useState('')

  const toggle = (label: string, isOther: boolean) => {
    if (isOther) {
      const next = !otherChecked
      setOtherChecked(next)
      setAnswers(a => {
        const arr = ((a[id] as string[]) || []).filter(x => x !== otherVal && x !== 'Ostalo')
        if (next) arr.push(otherVal || 'Ostalo')
        return { ...a, [id]: arr }
      })
    } else {
      setAnswers(a => {
        const arr = ((a[id] as string[]) || [])
        const exists = arr.includes(label)
        return { ...a, [id]: exists ? arr.filter(x => x !== label) : [...arr, label] }
      })
    }
  }

  const isChecked = (label: string) => ((answers[id] as string[]) || []).includes(label)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const checked = opt.hasOther ? otherChecked : isChecked(opt.label)
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => toggle(opt.label, !!opt.hasOther)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 8, border: `1.5px solid ${checked ? '#7CB518' : '#D4C9B8'}`,
              background: checked ? '#E8F0D8' : 'white', cursor: 'pointer',
              fontSize: 13, color: checked ? '#2D5016' : '#1A1A1A',
              fontWeight: checked ? 500 : 400, textAlign: 'left', width: '100%',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            <span style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              border: `2px solid ${checked ? '#7CB518' : '#D4C9B8'}`,
              background: checked ? '#7CB518' : 'white', color: 'white',
              fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {checked && '✓'}
            </span>
            {opt.label}
          </button>
        )
      })}
      {otherChecked && (
        <input
          style={inputStyle}
          placeholder="Molimo opišite..."
          value={otherVal}
          onChange={e => {
            const prev = otherVal || 'Ostalo'
            setOtherVal(e.target.value)
            setAnswers(a => {
              const arr = ((a[id] as string[]) || []).filter(x => x !== prev)
              arr.push(e.target.value || 'Ostalo')
              return { ...a, [id]: arr }
            })
          }}
        />
      )}
    </div>
  )
}

function ScaleGroup({ id, answers, setAnswers, lowLabel = '1 = Nisko', highLabel = '5 = Visoko' }: {
  id: string
  answers: Answers
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>
  lowLabel?: string
  highLabel?: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(n => {
          const sel = answers[id] === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => setAnswers(a => ({ ...a, [id]: n }))}
              style={{
                flex: 1, minWidth: 36, height: 40, borderRadius: 8,
                border: `1.5px solid ${sel ? '#2D5016' : '#D4C9B8'}`,
                background: sel ? '#2D5016' : 'white', cursor: 'pointer',
                fontSize: 13, fontWeight: sel ? 600 : 500,
                color: sel ? 'white' : '#6B6B6B', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >{n}</button>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#6B6B6B' }}>
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
    </div>
  )
}

function QCard({ num, label, children }: { num: number; label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: 18, marginBottom: 12,
      border: '1px solid #D4C9B8',
    }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', marginBottom: 12, lineHeight: 1.4 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: '50%', background: '#E8F0D8',
          color: '#2D5016', fontSize: 11, fontWeight: 700, marginRight: 8,
        }}>{num}</span>
        {label}
      </div>
      {children}
    </div>
  )
}

function GroupHeader({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
      color: '#7CB518', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid #D4C9B8',
    }}>{title}</div>
  )
}

export default function AnketaKupciPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [email, setEmail] = useState('')
  const [device, setDevice] = useState('')
  const [os, setOs] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setSending(true)
    setError('')
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'korisnici', answers, email, device, os }),
      })
      setSubmitted(true)
    } catch {
      setError('Greška pri slanju. Molimo pokušajte ponovo.')
    } finally {
      setSending(false)
    }
  }

  const deviceOptions = ['Mobitel', 'Tablet', 'Računalo', 'Podjednako']
  const osOptions = ['Android', 'iOS (Apple)', 'Ne znam']

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE', fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: '#1A1A1A' }}>
      {/* Simple Navbar */}
      <nav style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#2D5016', fontWeight: 700, fontSize: 18 }}>
            <Logo size={28} />
            <span>Tržnjak</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: '#2D5016', padding: '48px 24px 40px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 220, height: 220,
          borderRadius: '50%', background: 'rgba(124,181,24,0.15)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          display: 'inline-block', background: '#7CB518', color: 'white',
          fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
          padding: '4px 14px', borderRadius: 20, marginBottom: 16, position: 'relative', zIndex: 1,
        }}>Istraživanje tržišta · Kupci</div>
        <h1 style={{ fontSize: 32, color: 'white', lineHeight: 1.2, marginBottom: 10, position: 'relative', zIndex: 1, fontWeight: 700 }}>
          Pomozite nam razumjeti<br />vaše potrebe
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 300, position: 'relative', zIndex: 1 }}>
          Anketa za kupce lokalnih proizvoda · ~5 minuta
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 80px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontSize: 24, color: '#2D5016', marginBottom: 8, fontWeight: 700 }}>Hvala vam!</h2>
            <p style={{ color: '#6B6B6B', fontSize: 15 }}>
              Vaši odgovori su zaprimljeni.<br />
              Zajedno gradimo bolji put od polja do stola.
            </p>
            <Link to="/" style={{
              display: 'inline-block', marginTop: 24, background: '#2D5016', color: 'white',
              padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14,
            }}>← Natrag na Tržnjak</Link>
          </div>
        ) : (
          <>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, marginTop: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: '#2D5016',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>🛒</div>
              <div>
                <div style={{ fontSize: 20, color: '#2D5016', fontWeight: 700, lineHeight: 1.2 }}>Upitnik za kupce</div>
                <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2 }}>11 pitanja · ~5 minuta</div>
              </div>
            </div>

            {/* GROUP 1 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="O vama" />

              <QCard num={1} label="Iz koje županije dolazite?">
                <select
                  value={(answers['zupanija'] as string) || ''}
                  onChange={e => setAnswers(a => ({ ...a, zupanija: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none' as React.CSSProperties['appearance'] }}
                >
                  <option value="">— Odaberite županiju —</option>
                  {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </QCard>

              <QCard num={2} label="Tko ste vi kao kupac lokalnih proizvoda?">
                <RadioGroup id="k1" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Privatna osoba / kućanstvo' },
                  { label: 'Restoran ili kafić' },
                  { label: 'Hotel ili smještajni objekt' },
                  { label: 'Catering ili dostava hrane' },
                  { label: 'Maloprodaja / dućan zdrave hrane' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={3} label="Koliko često kupujete lokalne prehrambene proizvode direktno od proizvođača?">
                <RadioGroup id="k2" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Svaki tjedan' },
                  { label: 'Nekoliko puta mjesečno' },
                  { label: 'Jednom mjesečno' },
                  { label: 'Nekoliko puta godišnje' },
                  { label: 'Rijetko ili nikad' },
                ]} />
              </QCard>

              <QCard num={4} label="Što vas motivira da kupujete od lokalnih OPG-ova? (može više odgovora)">
                <CheckGroup id="k3" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Svježina i kvaliteta proizvoda' },
                  { label: 'Podrška lokalnoj ekonomiji' },
                  { label: 'Povoljnije cijene nego u dućanu' },
                  { label: 'Znamo porijeklo hrane' },
                  { label: 'Ekološki aspekt' },
                  { label: 'Osobni odnos s proizvođačem' },
                  { label: 'Jedinstvenost / sezonski proizvodi' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>
            </div>

            {/* GROUP 2 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="Trenutni način nabave" />

              <QCard num={5} label="Gdje trenutno kupujete lokalne proizvode? (može više odgovora)">
                <CheckGroup id="k4" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Zelena tržnica' },
                  { label: 'Direktno na OPG-u' },
                  { label: 'Vlastiti webshop OPG-a' },
                  { label: 'Supermarket (bio/eko polica)' },
                  { label: 'Dostava kutije povrća (box scheme)' },
                  { label: 'Preporuka poznanika / privatno' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={6} label="Koliko vam je važna dostava na kućnu adresu?">
                <RadioGroup id="k6" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Iznimno važno — bez dostave ne kupujem online' },
                  { label: 'Važno, ali i sam/a mogu preuzeti' },
                  { label: 'Svejedno mi je' },
                  { label: 'Radije sam preuzimam' },
                ]} />
              </QCard>

              <QCard num={7} label="Koliko ste daleko spremni otići preuzeti narudžbu od lokalnog OPG-a?">
                <RadioGroup id="k6b" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Do 5 km' },
                  { label: 'Do 10 km' },
                  { label: 'Do 20 km' },
                  { label: 'Ne bih preuzimao/la — jedino dostava na adresu' },
                ]} />
              </QCard>
            </div>

            {/* GROUP 3 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="Problemi i platforma" />

              <QCard num={8} label="Što vas najčešće frustrira pri kupnji od lokalnih OPG-ova? (može više odgovora)">
                <CheckGroup id="k7" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Teško je pronaći pouzdanog dobavljača' },
                  { label: 'Nepredvidiva dostupnost — ne znam što ima' },
                  { label: 'Nema online naručivanja, sve ide telefonom' },
                  { label: 'Nejasne cijene' },
                  { label: 'Loša komunikacija / nema odgovora' },
                  { label: 'Dostava je skupa ili ne postoji' },
                  { label: 'Ne postoji jedna platforma gdje se sve nalazi' },
                  { label: 'Nema recenzija ni ocjena' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={9} label="Ako pronađete OPG koji vam se sviđa kroz aplikaciju, nastavili biste naručivati kroz aplikaciju ili biste ih kontaktirali direktno?">
                <RadioGroup id="k9b" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Uvijek kroz aplikaciju — lakše mi je' },
                  { label: 'Vjerojatno kroz aplikaciju' },
                  { label: 'Kontaktirao/la bih direktno — jednostavnije je' },
                  { label: 'Ovisno o situaciji' },
                ]} />
              </QCard>

              <QCard num={10} label="Što bi vam platforma za kupnju od OPG-ova trebala nužno imati?">
                <CheckGroup id="k11" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Pregled dostupnih proizvoda u realnom vremenu' },
                  { label: 'Jednostavno online naručivanje' },
                  { label: 'Dostava na kućnu adresu' },
                  { label: 'Recenzije i ocjene OPG-ova' },
                  { label: 'Plaćanje karticom online' },
                  { label: 'Chat s proizvođačem' },
                  { label: 'Pretplata / redovita tjedna kutija' },
                  { label: 'Grupna narudžba s prijateljima / susjedima' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={11} label="Koliko je vjerojatno da biste koristili aplikaciju koja vas spaja s lokalnim OPG-ovima za tjednu nabavu? (1 = malo vjerojatno, 5 = sigurno bih)">
                <ScaleGroup id="k12" answers={answers} setAnswers={setAnswers} lowLabel="1 = Malo vjerojatno" highLabel="5 = Sigurno bih" />
              </QCard>
            </div>

            {/* Device */}
            <div style={{
              background: 'white', borderRadius: 12, padding: 18, marginBottom: 12, border: '1px solid #D4C9B8',
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', marginBottom: 8 }}>
                📱 Na kojem uređaju najčešće kupujete online? (opcionalno)
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {deviceOptions.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    style={{
                      flex: 1, minWidth: 100, padding: 10, borderRadius: 8,
                      border: `1.5px solid ${device === d ? '#7CB518' : '#D4C9B8'}`,
                      background: device === d ? '#E8F0D8' : 'white', cursor: 'pointer',
                      fontSize: 13, color: device === d ? '#2D5016' : '#1A1A1A',
                      fontWeight: device === d ? 600 : 400, fontFamily: 'inherit',
                      transition: 'all 0.15s', textAlign: 'center',
                    }}
                  >{d}</button>
                ))}
              </div>
              {device === 'Mobitel' && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 6 }}>Koji operacijski sustav?</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {osOptions.map(o => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOs(o)}
                        style={{
                          flex: 1, minWidth: 100, padding: 10, borderRadius: 8,
                          border: `1.5px solid ${os === o ? '#7CB518' : '#D4C9B8'}`,
                          background: os === o ? '#E8F0D8' : 'white', cursor: 'pointer',
                          fontSize: 13, color: os === o ? '#2D5016' : '#1A1A1A',
                          fontWeight: os === o ? 600 : 400, fontFamily: 'inherit',
                          transition: 'all 0.15s', textAlign: 'center',
                        }}
                      >{o}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{
              background: 'white', borderRadius: 12, padding: 18, marginBottom: 12, border: '1px solid #D4C9B8',
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', marginBottom: 4 }}>
                📬 Zainteresirani ste za projekt? Ostavite email! (opcionalno)
              </div>
              <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 10 }}>
                Obavijestit ćemo vas o lansiranju platforme i prvim OPG-ovima koji se priključe.
              </div>
              <input
                type="email"
                style={inputStyle}
                placeholder="vasa@adresa.hr"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={sending}
              style={{
                width: '100%', padding: 16, background: sending ? '#6B6B6B' : '#2D5016',
                color: 'white', border: 'none', borderRadius: 12, fontSize: 15,
                fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer',
                marginTop: 8, transition: 'all 0.2s', letterSpacing: 0.3,
                fontFamily: 'inherit',
              }}
            >
              {sending ? '⏳ Šaljemo vaše odgovore...' : 'Pošalji odgovore →'}
            </button>

            {error && (
              <p style={{ color: '#dc2626', textAlign: 'center', marginTop: 12, fontSize: 14 }}>{error}</p>
            )}

            <p style={{ fontSize: 11, color: '#6B6B6B', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Vaši odgovori su anonimni i koristit će se isključivo za razvoj platforme.<br />
              Hvala na vremenu! 🛒
            </p>
          </>
        )}
      </div>
    </div>
  )
}
