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

export default function AnketaOPGPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ type: 'opg', answers, email }),
      })
      setSubmitted(true)
    } catch {
      setError('Greška pri slanju. Molimo pokušajte ponovo.')
    } finally {
      setSending(false)
    }
  }

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
        }}>Istraživanje tržišta · OPG-ovi</div>
        <h1 style={{ fontSize: 32, color: 'white', lineHeight: 1.2, marginBottom: 10, position: 'relative', zIndex: 1, fontWeight: 700 }}>
          Pomozite nam razumjeti<br />vaše potrebe
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 300, position: 'relative', zIndex: 1 }}>
          Anketa za OPG-ove · ~5 minuta
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 80px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
            <h2 style={{ fontSize: 24, color: '#2D5016', marginBottom: 8, fontWeight: 700 }}>Hvala vam!</h2>
            <p style={{ color: '#6B6B6B', fontSize: 15 }}>
              Vaši odgovori su zaprimljeni.<br />
              Pomažete nam izgraditi bolju platformu za sve OPG-ove u Hrvatskoj.
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
              }}>🌾</div>
              <div>
                <div style={{ fontSize: 20, color: '#2D5016', fontWeight: 700, lineHeight: 1.2 }}>Upitnik za OPG-ove</div>
                <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2 }}>11 pitanja · ~5 minuta</div>
              </div>
            </div>

            {/* GROUP 1 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="O vašem OPG-u" />

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

              <QCard num={2} label="Koja je vaša primarna djelatnost?">
                <RadioGroup id="o1" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Voće i povrće' },
                  { label: 'Mliječni proizvodi' },
                  { label: 'Meso i mesni proizvodi' },
                  { label: 'Žitarice i mahunarke' },
                  { label: 'Med i pčelinji proizvodi' },
                  { label: 'Višestruke kulture' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={3} label="Koliko dugo poslujete kao OPG?">
                <RadioGroup id="o2" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Manje od 2 godine' },
                  { label: '2–5 godina' },
                  { label: '5–10 godina' },
                  { label: 'Više od 10 godina' },
                ]} />
              </QCard>
            </div>

            {/* GROUP 2 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="Prodaja i distribucija" />

              <QCard num={4} label="Kroz koje kanale trenutno prodajete svoje proizvode? (može više odgovora)">
                <CheckGroup id="o3" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Direktna prodaja na OPG-u' },
                  { label: 'Zelena tržnica' },
                  { label: 'Vlastita web/online prodaja' },
                  { label: 'Posrednici / otkupljivači' },
                  { label: 'Restorani i ugostiteljstvo' },
                  { label: 'Supermarketi / trgovine' },
                  { label: 'Platforme (Njuškalo, i sl.)' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={5} label="Koliki udio prihoda dolazi od direktne prodaje krajnjim kupcima?">
                <RadioGroup id="o4" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Manje od 20%' },
                  { label: '20–50%' },
                  { label: '50–80%' },
                  { label: 'Više od 80%' },
                ]} />
              </QCard>

              <QCard num={6} label="Koliko otprilike potrošite mjesečno na prodajne troškove (naknade tržnice, prijevoz, posrednici)?">
                <RadioGroup id="o6a" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Manje od 20 €/mj' },
                  { label: '20–50 €/mj' },
                  { label: '50–100 €/mj' },
                  { label: 'Više od 100 €/mj' },
                ]} />
              </QCard>
            </div>

            {/* GROUP 3 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="Najveći problemi" />

              <QCard num={7} label="Koji su vaši najveći problemi u prodaji i distribuciji? (može više odgovora)">
                <CheckGroup id="o8" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Teško pronalazim nove kupce' },
                  { label: 'Preveliki posrednici koji uzimaju veliku proviziju' },
                  { label: 'Logistika i dostava je skupa/komplicirana' },
                  { label: 'Administracija oduzima previše vremena' },
                  { label: 'Nepredvidiva potražnja — ne znam koliko će se prodati' },
                  { label: 'Ne mogu prodati sve što proizvedem' },
                  { label: 'Nedostatak digitalnih vještina/alata' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>
            </div>

            {/* GROUP 4 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="Digitalni alati i platforme" />

              <QCard num={8} label="Koristite li trenutno neku digitalnu platformu za prodaju?">
                <RadioGroup id="o11" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Da, aktivno koristim' },
                  { label: 'Da, ali rijetko' },
                  { label: 'Probao/la sam ali odustao/la' },
                  { label: 'Ne, nikad nisam probao/la' },
                ]} />
                {['Da, aktivno koristim', 'Da, ali rijetko', 'Probao/la sam ali odustao/la'].includes(answers['o11'] as string) && (
                  <input
                    style={{ ...inputStyle, marginTop: 8 }}
                    placeholder="Koju platformu koristite / ste koristili?"
                    value={(answers['o11_platform'] as string) || ''}
                    onChange={e => setAnswers(a => ({ ...a, o11_platform: e.target.value }))}
                  />
                )}
              </QCard>

              <QCard num={9} label="Što vas je odvratilo ili bi vas odvratilo od korištenja digitalne platforme?">
                <CheckGroup id="o12" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Previše komplicirana za korištenje' },
                  { label: 'Skupa naknada/provizija' },
                  { label: 'Ne vjerujem da bi funkcioniralo' },
                  { label: 'Nemam vremena za učenje novog alata' },
                  { label: 'Loša iskustva u prošlosti' },
                  { label: 'Ništa — otvoren/a sam za isprobavanje' },
                  { label: 'Ostalo', hasOther: true },
                ]} />
              </QCard>

              <QCard num={10} label="Koji model naplate biste radije prihvatili za digitalnu platformu?">
                <RadioGroup id="o14" answers={answers} setAnswers={setAnswers} options={[
                  { label: 'Ne bih platio/la ništa' },
                  { label: 'Fiksna pretplata (npr. 10–20 €/mj)' },
                  { label: 'Provizija po narudžbi — do 5% od prodane vrijednosti' },
                  { label: 'Provizija po narudžbi — 5–10% od prodane vrijednosti' },
                  { label: 'Prihvatio/la bih i više od 10% ako platforma donosi kupce' },
                ]} />
              </QCard>
            </div>

            {/* GROUP 5 */}
            <div style={{ marginBottom: 28 }}>
              <GroupHeader title="Vrijednost platforme" />

              <QCard num={11} label="Koliko bi vam bila vrijedna platforma koja automatski spaja vaš OPG s lokalnim kupcima? (1 = nimalo, 5 = jako vrijedna)">
                <ScaleGroup id="o16" answers={answers} setAnswers={setAnswers} lowLabel="1 = Nimalo" highLabel="5 = Jako vrijedna" />
              </QCard>
            </div>

            {/* Email */}
            <div style={{
              background: 'white', borderRadius: 12, padding: 18, marginBottom: 12, border: '1px solid #D4C9B8',
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', marginBottom: 4 }}>
                📬 Zainteresirani ste za projekt? Ostavite email! (opcionalno)
              </div>
              <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 10 }}>
                Obavijestit ćemo vas o lansiranju platforme i pozivamo vas na testiranje.
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
              Vaši odgovori su anonimni i koristit će se isključivo za poboljšanje platforme za OPG-ove.<br />
              Hvala na vremenu! 🌱
            </p>
          </>
        )}
      </div>
    </div>
  )
}
