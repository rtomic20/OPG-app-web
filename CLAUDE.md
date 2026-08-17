# OPG App Web: CLAUDE.md
*Promo/buyer-facing web frontend za Tržnjak. Read this first.*

## Što je ovo
Cloudflare Worker koji servira React SPA. Kombinacija je promo landing page (waitlist, OPG direktorij) i buyer frontend (login, register, profil, narudžbe, OPG profili). Zaseban je od `OPG-app`: samo frontend, nema vlastitog backenda.

## Stack
- React 19 + TypeScript + Tailwind v4 + Vite
- Deploy: **Cloudflare Worker** (ne Pages): `npm run build && npx wrangler deploy`
- `wrangler.toml`: `[assets] directory = "./dist"`, SPA fallback
- CF Account ID: `9a3891f3cbdfe81d27d28f519445acd7` (wrangler auth: tomic.rino@gmail.com)

## Lokacija
- Local: `C:\Users\Korisnik\Desktop\OPG-app-web\`
- GitHub: `https://github.com/rtomic20/OPG-app-web.git` (branch: master)

## API
- `VITE_API_URL=https://panel.trznjak.com/api` (u `.env`)
- `VITE_PANEL_URL=https://panel.trznjak.com`
- **Uvijek rebuild** pred deploy: Vite bake-a env vars u bundle: `npm run build && npx wrangler deploy`

## CSP
- Headeri su u `public/_headers` (ne meta tag u `index.html`: CF Worker čita `_headers` file)
- Ne dodavaj `<meta http-equiv="Content-Security-Policy">` u `index.html`: duplikat koji ne radi

## Ključne stranice / komponente
| Path | Komponenta | Opis |
|---|---|---|
| `/` | `LandingPage.tsx` | Promo: Hero (waitlist), Problem, Features, Categories, HowItWorks, CTA |
| `/prijava` | `LoginPage.tsx` | Email+password + MFA korak, popup za OPG panel redirect |
| `/registracija` | `RegisterPage.tsx` | Confirm password, min 8 znakova |
| `/profil` | `ProfilePage.tsx` | Kupac profil |
| `/opgovi` | `DirectoryPage.tsx` + `VendorMap.tsx` | OPG direktorij s Leaflet kartom |
| `/opgovi/:slug` | `VendorProfilePage.tsx` | OPG profil stranica |
| `/uvjeti` | `UvjetiPage.tsx` | Uvjeti korištenja |
| `/privatnost` | `PrivatnostPage.tsx` | Politika privatnosti |
| `/blog`, `/blog/<slug>` | statički HTML, **nije React ruta** | vidi Blog niže |

## Blog: statički HTML, generiran u buildu

Nema DB tablice, nema Django appa, nema runtime ovisnosti. Node stdlib generator.

| Što | Gdje |
|---|---|
| Tekstovi objava | `content/blog/<slug>.md` (slug = ime datoteke) |
| Generator | `scripts/build-blog.mjs` (pokreće se zadnji u `npm run build`) |
| Self-check | `npm run test:blog` (assert, bez frameworka) |
| Stil | `public/blog/blog.css` (same-origin, bez inline `<style>`) |
| Slike | `public/blog/slike/<slug>/ime.jpg` → referenca `/blog/slike/<slug>/ime.jpg` |
| Izlaz | `dist/blog/index.html`, `dist/blog.html`, `dist/blog/<slug>.html`, `dist/sitemap.xml` |

- **Nova objava:** nova `.md` datoteka + `npm run build`. **Brisanje:** obriši `.md` + rebuild.
- Frontmatter (obavezno): `title`, `description`, `date` (YYYY-MM-DD). Opcionalno: `image`
  (putanja za `og:image`), `placeholder: true` (ispisuje oznaku "primjer").
- Markdown podskup: `## `, `### `, `- ` lista, `> ` citat, `**bold**`, `*em*`, `[tekst](url)`,
  slika `![alt](/putanja.jpg =1200x630)`. Dimenzije su opcionalne, ali sprječavaju layout shift.
- **Linkovi na `/blog` moraju biti obični `<a href>`, nikad router `<Link>`.** Router bi pao na
  `*` catch-all i renderirao LandingPage umjesto statičke datoteke.
- CSP se ne dira: bez inline skripti (JSON-LD je data blok), CSS i slike sa istog origina,
  bez web fontova (`font-src 'self'`).
- **Video nije podržan** (Workers static assets: 25 MiB po datoteci). Odluka je Rinova.

## LoginPage: bitne napomene
- MFA flow: `step: 'credentials' | 'mfa'`
- Popup-null fix: ako je popup blokiran → redirect u istom prozoru (ne baci TypeError)
- Anti-autofill: `type="text"` + `WebkitTextSecurity: disc` na password polju

## Deploy naredba
```powershell
npm run build
npx wrangler deploy
```

## Živi URL
`https://trznjak.com` (Cloudflare Worker ruta)
