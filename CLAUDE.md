# OPG App Web — CLAUDE.md
*Promo/buyer-facing web frontend za Tržnjak. Read this first.*

## Što je ovo
Cloudflare Worker koji servira React SPA. Kombinacija je promo landing page (waitlist, OPG direktorij) i buyer frontend (login, register, profil, narudžbe, OPG profili). Zaseban je od `OPG-app` — samo frontend, nema vlastitog backenda.

## Stack
- React 19 + TypeScript + Tailwind v4 + Vite
- Deploy: **Cloudflare Worker** (ne Pages) — `npm run build && npx wrangler deploy`
- `wrangler.toml`: `[assets] directory = "./dist"`, SPA fallback
- CF Account ID: `9a3891f3cbdfe81d27d28f519445acd7` (wrangler auth: tomic.rino@gmail.com)

## Lokacija
- Local: `C:\Users\Korisnik\Desktop\OPG-app-web\`
- GitHub: `https://github.com/rtomic20/OPG-app-web.git` (branch: master)

## API
- `VITE_API_URL=https://panel.trznjak.com/api` (u `.env`)
- `VITE_PANEL_URL=https://panel.trznjak.com`
- **Uvijek rebuild** pred deploy — Vite bake-a env vars u bundle: `npm run build && npx wrangler deploy`

## CSP
- Headeri su u `public/_headers` (ne meta tag u `index.html` — CF Worker čita `_headers` file)
- Ne dodavaj `<meta http-equiv="Content-Security-Policy">` u `index.html` — duplikat koji ne radi

## Ključne stranice / komponente
| Path | Komponenta | Opis |
|---|---|---|
| `/` | `LandingPage.tsx` | Promo — Hero (waitlist), Problem, Features, Categories, HowItWorks, CTA |
| `/login` | `LoginPage.tsx` | Email+password + MFA korak, popup za OPG panel redirect |
| `/register` | `RegisterPage.tsx` | Confirm password, min 8 znakova |
| `/profile` | `ProfilePage.tsx` | Kupac profil |
| `/directory` | `DirectoryPage.tsx` + `VendorMap.tsx` | OPG direktorij s Leaflet kartom |
| `/vendors/:slug` | `VendorProfilePage.tsx` | OPG profil stranica |
| `/anketa-kupci` | `AnketaKupciPage.tsx` | Anketa za kupce |
| `/anketa-opg` | `AnketaOPGPage.tsx` | Anketa za OPG-ove |
| `/uvjeti` | `UvjetiPage.tsx` | Uvjeti korištenja |
| `/privatnost` | `PrivatnostPage.tsx` | Politika privatnosti |

## Posebne datoteke
- `public/opg-prica.html` + `public/opg-prica.js` — standalone stranica (OPG priča/anketa), nije dio React routinga

## LoginPage — bitne napomene
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
