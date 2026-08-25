/**
 * Edge router for trznjak.com.
 *
 * Why this exists: `not_found_handling = "single-page-application"` answered EVERY
 * unknown path with 200 + index.html. Google Search Console reported the result as
 * "Duplicate without user-selected canonical" - the crawler saw unlimited URLs all
 * serving identical HTML, and deleted pages stayed 200 forever.
 *
 * So assets are now served with `not_found_handling = "none"` and this Worker decides
 * what a miss means:
 *   - a known SPA route      -> index.html, 200   (client-side routing still works)
 *   - anything else          -> 404.html, 404     (real status, so Google drops it)
 *   - www.*                  -> 301 to the apex   (one canonical hostname)
 *
 * The route list MUST stay in step with src/App.tsx. If a <Route path> is added there
 * and not here, that page 404s in production. See the self-check in scripts/routes.test.mjs.
 */

// Exact paths, mirroring <Route path="..."> in src/App.tsx.
export const SPA_ROUTES = new Set([
  '/',
  '/opgovi',
  '/prijava',
  '/registracija',
  '/profil',
  '/zaboravili-lozinku',
  '/reset-lozinka',
  '/privatnost',
  '/uvjeti',
])

// Dynamic segments: /opgovi/<slug>. We cannot know valid slugs at the edge, so these
// are served as 200 and the app renders its own not-found state.
// ponytail: swap to an API lookup only if crawl reports show junk vendor slugs indexed.
export const SPA_PREFIXES = ['/opgovi/']

export function isSpaRoute(pathname) {
  // Tolerate a trailing slash on everything except the root itself.
  const p = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  if (SPA_ROUTES.has(p)) return true
  return SPA_PREFIXES.some((prefix) => p.startsWith(prefix) && p.length > prefix.length)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // One canonical hostname. Keeps path, query and method-safe semantics.
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }

    if (isSpaRoute(url.pathname)) {
      const index = await env.ASSETS.fetch(new URL('/index.html', url.origin))
      return new Response(index.body, {
        status: 200,
        headers: index.headers,
      })
    }

    // Unknown path and no asset matched it: a real 404.
    const notFound = await env.ASSETS.fetch(new URL('/404.html', url.origin))
    return new Response(notFound.body, {
      status: 404,
      headers: notFound.headers,
    })
  },
}
