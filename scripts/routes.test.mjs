/**
 * Self-check: the Worker's route list must match <Route path> in src/App.tsx.
 *
 * The failure this prevents is silent and expensive: someone adds a page to App.tsx,
 * forgets src/worker.js, and that page returns 404 in production while working fine
 * in `npm run dev`. Assert-based, no framework - same shape as build-blog.test.mjs.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import assert from 'node:assert/strict'

import { SPA_ROUTES, SPA_PREFIXES, isSpaRoute } from '../src/worker.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const app = readFileSync(join(ROOT, 'src', 'App.tsx'), 'utf8')
const declared = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
assert.ok(declared.length > 0, 'App.tsx: nije pronađena nijedna <Route path="...">')

const dynamic = declared.filter((p) => p.includes(':'))
const wildcard = declared.filter((p) => p === '*')
const exact = declared.filter((p) => !p.includes(':') && p !== '*')

// 1. Every exact route in App.tsx is known to the Worker.
for (const path of exact) {
  assert.ok(SPA_ROUTES.has(path), `src/worker.js: nedostaje ruta "${path}" (postoji u App.tsx)`)
}

// 2. No stale routes in the Worker that App.tsx no longer has.
for (const path of SPA_ROUTES) {
  assert.ok(exact.includes(path), `src/worker.js: ruta "${path}" više ne postoji u App.tsx`)
}

// 3. Every dynamic route has a matching prefix.
for (const path of dynamic) {
  const prefix = path.slice(0, path.indexOf(':'))
  assert.ok(
    SPA_PREFIXES.includes(prefix),
    `src/worker.js: nedostaje SPA_PREFIXES "${prefix}" (za "${path}")`
  )
}

// 4. Behaviour: real routes serve the app, junk does not.
for (const path of exact) assert.equal(isSpaRoute(path), true, `isSpaRoute("${path}") mora biti true`)
assert.equal(isSpaRoute('/opgovi/opg-primjer'), true, '/opgovi/<slug> mora biti true')
assert.equal(isSpaRoute('/opgovi/'), true, 'trailing slash mora raditi')
assert.equal(isSpaRoute('/ovo-ne-postoji-12345'), false, 'nepoznata putanja mora biti false')
assert.equal(isSpaRoute('/blog/kako-postati-clan-trznjaka'), false, 'obrisana objava mora biti false')
assert.equal(isSpaRoute('/opgovi'), true, '/opgovi bez slasha mora biti true')

// 5. The App.tsx "*" catch-all renders LandingPage. That is fine client-side, but it is
//    exactly why the edge must answer 404 first - otherwise junk URLs render the homepage.
assert.equal(wildcard.length, 1, 'App.tsx: očekivan točno jedan "*" catch-all')

console.log(
  `routes self-check OK (${exact.length} točnih ruta, ${dynamic.length} dinamičkih, ${SPA_PREFIXES.length} prefiksa)`
)
