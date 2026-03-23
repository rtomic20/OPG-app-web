const API_URL = 'http://46.224.189.114/api'

const CRAWLERS = [
  'facebookexternalhit', 'facebot', 'Twitterbot', 'WhatsApp',
  'viber', 'Slackbot', 'LinkedInBot', 'Pinterest', 'Discordbot',
  'TelegramBot', 'Instagram'
]

function isCrawler(userAgent) {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return CRAWLERS.some((bot) => ua.includes(bot.toLowerCase()))
}

export async function onRequest(context) {
  const { params, request, env } = context
  const slug = params.slug
  const userAgent = request.headers.get('user-agent') || ''

  if (!isCrawler(userAgent)) {
    // Regular visitor — serve the React SPA
    return env.ASSETS.fetch(new Request(new URL('/', request.url).toString(), request))
  }

  // Social media crawler — inject OG tags
  try {
    const apiBase = env.VITE_API_URL || API_URL
    const res = await fetch(`${apiBase}/vendors/${slug}/`, { cf: { cacheTtl: 300 } })

    if (!res.ok) throw new Error('Vendor not found')

    const vendor = await res.json()

    const title = vendor.name
    const description = vendor.description
      ? vendor.description.substring(0, 150)
      : `Lokalni OPG na Tržnjaku — ${vendor.location || 'Hrvatska'}`
    const image = vendor.logo || vendor.cover_image || 'https://trznjak.hr/og-default.png'
    const url = `https://trznjak.hr/opgovi/${slug}`
    const rating = vendor.avg_rating ? ` ⭐ ${vendor.avg_rating}/5` : ''

    const html = `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8" />
  <title>${title} — Tržnjak</title>

  <!-- Open Graph (Facebook, WhatsApp, Viber, Instagram) -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title} — Tržnjak${rating}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Tržnjak" />
  <meta property="og:locale" content="hr_HR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title} — Tržnjak" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <!-- Redirect to React app -->
  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <p>Preusmjeravanje na <a href="${url}">${title}</a>...</p>
</body>
</html>`

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch {
    // Fallback — serve SPA
    return env.ASSETS.fetch(new Request(new URL('/', request.url).toString(), request))
  }
}
