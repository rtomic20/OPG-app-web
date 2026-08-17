#!/usr/bin/env node
/**
 * Trznjak blog generator - build-time static HTML, Node stdlib only, no runtime dependency.
 *
 *   content/blog/<slug>.md   ->  dist/blog/<slug>.html      served at /blog/<slug>
 *                            ->  dist/blog/index.html       served at /blog
 *                            ->  dist/sitemap.xml           public/sitemap.xml + post URLs
 *
 * Runs AFTER `vite build` (vite empties dist, so this has to be last in the chain).
 *
 * Add / replace a post:  drop or edit one .md file in content/blog/, run `npm run build`.
 * Delete a post:         delete the .md file, run `npm run build`.
 * Images:                put files in public/blog/slike/<slug>/ and reference them as
 *                        /blog/slike/<slug>/ime.jpg  (vite copies public/ into dist/,
 *                        so they end up same-origin, which the strict CSP requires).
 *
 * ponytail: markdown subset only (h2/h3, list, blockquote, image, paragraph, bold/em/link).
 * Add more syntax when a real post actually needs it.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = join(ROOT, 'content', 'blog')
const DIST = join(ROOT, 'dist')
export const SITE = 'https://trznjak.com'

const MJESECI = ['siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja',
  'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca']

/* ---------------------------------------------------------------- markdown */

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

// ![alt](/blog/slike/x/foo.jpg =1600x1067)   - the size is optional but stops layout shift
const IMG = /^!\[([^\]]*)\]\((\S+?)(?:\s+=(\d+)x(\d+))?\)$/

export function renderBody(md) {
  return md.trim().split(/\r?\n\s*\r?\n/).map((block) => {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (!lines.length) return ''
    const first = lines[0]

    if (first.startsWith('## ')) return `<h2>${inline(first.slice(3))}</h2>`
    if (first.startsWith('### ')) return `<h3>${inline(first.slice(4))}</h3>`
    if (first.startsWith('> ')) {
      const text = lines.map((l) => l.replace(/^>\s?/, '')).join(' ')
      return `<blockquote><p>${inline(text)}</p></blockquote>`
    }
    if (lines.every((l) => l.startsWith('- '))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`
    }
    const img = first.match(IMG)
    if (img) {
      const [, alt, src, w, h] = img
      const size = w ? ` width="${w}" height="${h}"` : ''
      const caption = lines[1] ? `<figcaption>${inline(lines[1])}</figcaption>` : ''
      return `<figure><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"${size}>${caption}</figure>`
    }
    return `<p>${inline(lines.join(' '))}</p>`
  }).filter(Boolean).join('\n      ')
}

/* ------------------------------------------------------------------- posts */

export function parsePost(raw, slug) {
  const m = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) throw new Error(`${slug}: nedostaje frontmatter (--- blok na vrhu datoteke)`)
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  for (const key of ['title', 'description', 'date']) {
    if (!meta[key]) throw new Error(`${slug}: nedostaje "${key}" u frontmatteru`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${slug}: datum mora biti YYYY-MM-DD`)
  const body = m[2]
  const words = body.split(/\s+/).filter(Boolean).length
  return {
    slug,
    ...meta,
    placeholder: meta.placeholder === 'true',
    body,
    minute: Math.max(1, Math.round(words / 200)),
    url: `${SITE}/blog/${slug}`,
  }
}

export const croDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}. ${MJESECI[m - 1]} ${y}.`
}

/* ------------------------------------------------------------------ chrome */

const LOGO = '<svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">' +
  '<circle cx="20" cy="20" r="20" fill="#2D5016"/>' +
  '<path d="M20 34 C20 34 10 26 10 17 C10 10.5 14.5 6 20 6 C25.5 6 30 10.5 30 17 C30 26 20 34 20 34Z" fill="#fff"/>' +
  '<path d="M20 34 L20 9" stroke="#2D5016" stroke-width="1.5" stroke-linecap="round"/>' +
  '<path d="M20 19 L14.5 14.5" stroke="#2D5016" stroke-width="1" stroke-linecap="round"/>' +
  '<path d="M20 24 L14.5 19.5" stroke="#2D5016" stroke-width="1" stroke-linecap="round"/>' +
  '<path d="M20 19 L25.5 14.5" stroke="#2D5016" stroke-width="1" stroke-linecap="round"/>' +
  '<path d="M20 24 L25.5 19.5" stroke="#2D5016" stroke-width="1" stroke-linecap="round"/></svg>'

const FAVICON = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22>' +
  '<circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2316a34a%22/>' +
  '<path d=%22M20 34 C20 34 10 26 10 17 C10 10.5 14.5 6 20 6 C25.5 6 30 10.5 30 17 C30 26 20 34 20 34Z%22 fill=%22white%22/></svg>'

const header = () => `<a class="skip-link" href="#sadrzaj">Preskoči na sadržaj</a>
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="/">${LOGO}<span>Tržnjak</span></a>
        <nav class="site-nav" aria-label="Glavna navigacija">
          <a href="/opgovi">OPG-ovi</a>
          <a href="/blog" aria-current="page">Blog</a>
          <a class="btn" href="/registracija">Registracija</a>
        </nav>
      </div>
    </header>`

const footer = () => `<footer class="site-footer">
      <div class="wrap footer-inner">
        <p class="footer-brand">Tržnjak</p>
        <nav aria-label="Podnožje">
          <a href="/opgovi">OPG-ovi</a>
          <a href="/blog">Blog</a>
          <a href="/privatnost">Privatnost</a>
          <a href="/uvjeti">Uvjeti korištenja</a>
        </nav>
        <p class="footer-copy">© ${new Date().getFullYear()} Tržnjak. Sva prava pridržana.</p>
      </div>
    </footer>`

// JSON-LD is a data block, not executable script, so `script-src 'self'` does not apply to it.
// The escaping below keeps the payload from breaking out of the <script> element.
const jsonLd = (obj) => JSON.stringify(obj)
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

function page({ title, description, canonical, og, extraHead = '', bodyClass = '', main }) {
  return `<!doctype html>
<html lang="hr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${esc(canonical)}">
    <link rel="icon" href="${FAVICON}">
    <link rel="stylesheet" href="/blog/blog.css">
    <meta property="og:site_name" content="Tržnjak">
    <meta property="og:locale" content="hr_HR">
    <meta property="og:url" content="${esc(canonical)}">
${og.map(([p, c]) => `    <meta property="${p}" content="${esc(c)}">`).join('\n')}
    <meta name="twitter:card" content="summary_large_image">
${extraHead}  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ''}>
    ${header()}
    <main id="sadrzaj">
${main}
    </main>
    ${footer()}
  </body>
</html>
`
}

export function renderPost(post) {
  const image = post.image ? `${SITE}${post.image}` : ''
  const og = [
    ['og:type', 'article'],
    ['og:title', post.title],
    ['og:description', post.description],
    ...(image ? [['og:image', image]] : []),
    ['article:published_time', post.date],
  ]
  const ld = jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'hr',
    ...(image ? { image: [image] } : {}),
    author: { '@type': 'Organization', name: 'Tržnjak' },
    publisher: { '@type': 'Organization', name: 'Tržnjak', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
  })
  const notice = post.placeholder
    ? '<p class="placeholder-note"><strong>Primjer objave.</strong> Ovaj tekst je postavljen samo da se vidi kako blog izgleda i nije konačan sadržaj.</p>\n      '
    : ''
  return page({
    title: `${post.title} · Tržnjak`,
    description: post.description,
    canonical: post.url,
    og,
    extraHead: `    <script type="application/ld+json">${ld}</script>\n`,
    main: `      <article class="post">
      <p class="eyebrow"><a href="/blog">Blog</a></p>
      <h1>${esc(post.title)}</h1>
      <p class="meta"><time datetime="${esc(post.date)}">${croDate(post.date)}</time> · ${post.minute} min čitanja</p>
      ${notice}${renderBody(post.body)}
      <p class="back"><a href="/blog">← Sve objave</a></p>
      </article>`,
  })
}

export function renderIndex(posts) {
  const items = posts.map((p) => `        <li class="card">
          <a href="/blog/${p.slug}">
            <p class="card-meta"><time datetime="${esc(p.date)}">${croDate(p.date)}</time>${p.placeholder ? ' <span class="tag">primjer</span>' : ''}</p>
            <h2>${esc(p.title)}</h2>
            <p class="card-desc">${esc(p.description)}</p>
            <span class="card-link">Pročitaj objavu</span>
          </a>
        </li>`).join('\n')
  return page({
    title: 'Blog · Tržnjak',
    description: 'Savjeti, sezonski vodiči, priče OPG-ova i sažeci susreta. Blog Tržnjaka o lokalnoj hrani i domaćoj proizvodnji.',
    canonical: `${SITE}/blog`,
    og: [
      ['og:type', 'website'],
      ['og:title', 'Blog · Tržnjak'],
      ['og:description', 'Savjeti, sezonski vodiči, priče OPG-ova i sažeci susreta.'],
    ],
    bodyClass: 'blog-index',
    main: `      <div class="wrap">
      <header class="index-head">
        <h1>Blog</h1>
        <p class="lede">Savjeti i vodiči, sezona na tanjuru, priče OPG-ova i sažeci susreta.</p>
      </header>
      <ul class="cards">
${items}
      </ul>
      </div>`,
  })
}

/* ----------------------------------------------------------------- sitemap */

export function buildSitemap(base, entries) {
  if (!base.includes('</urlset>')) throw new Error('public/sitemap.xml: nema </urlset>')
  const add = entries.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')
  return base.replace('</urlset>', `${add}\n</urlset>`)
}

/* -------------------------------------------------------------------- main */

export function loadPosts() {
  if (!existsSync(CONTENT_DIR)) return []
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(readFileSync(join(CONTENT_DIR, f), 'utf8'), f.replace(/\.md$/, '')))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)))
}

function main() {
  const posts = loadPosts()
  const outDir = join(DIST, 'blog')
  mkdirSync(outDir, { recursive: true })

  for (const post of posts) writeFileSync(join(outDir, `${post.slug}.html`), renderPost(post), 'utf8')

  const index = renderIndex(posts)
  writeFileSync(join(outDir, 'index.html'), index, 'utf8')
  // /blog is written twice on purpose. Measured with `wrangler dev` on this build:
  // with dist/blog.html present  -> GET /blog = 200 (and /blog.html 307s to /blog)
  // with only blog/index.html    -> GET /blog = 307 redirect to /blog/
  // Same bytes, same canonical, so keeping both makes the canonical URL a direct 200.
  writeFileSync(join(DIST, 'blog.html'), index, 'utf8')

  const newest = posts[0]?.date || new Date().toISOString().slice(0, 10)
  const sitemap = buildSitemap(readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8'), [
    { loc: `${SITE}/blog`, lastmod: newest, changefreq: 'weekly', priority: '0.7' },
    ...posts.map((p) => ({ loc: p.url, lastmod: p.date, changefreq: 'yearly', priority: '0.6' })),
  ])
  writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8')

  console.log(`blog: ${posts.length} objava -> dist/blog/, sitemap +${posts.length + 1} URL-a`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
