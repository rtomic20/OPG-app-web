#!/usr/bin/env node
/* Self-check for the blog generator. No framework: `node scripts/build-blog.test.mjs`.
   Fails loudly if the markdown subset, the frontmatter rules, the SEO head or the sitemap
   injection break. Run it before shipping a content change. */
import assert from 'node:assert/strict'
import { renderBody, inline, parsePost, renderPost, renderIndex, buildSitemap, croDate, loadPosts, SITE } from './build-blog.mjs'

/* markdown subset */
assert.equal(renderBody('## Naslov'), '<h2>Naslov</h2>')
assert.equal(renderBody('### Pod'), '<h3>Pod</h3>')
assert.equal(renderBody('- a\n- b'), '<ul><li>a</li><li>b</li></ul>')
assert.equal(renderBody('> citat'), '<blockquote><p>citat</p></blockquote>')
assert.equal(renderBody('obicni tekst'), '<p>obicni tekst</p>')

/* images: lazy + explicit dimensions (no layout shift) + caption */
const fig = renderBody('![Vrt](/blog/slike/a/b.jpg =1200x630)\nOpis slike')
assert.match(fig, /<figure><img src="\/blog\/slike\/a\/b\.jpg" alt="Vrt" loading="lazy" decoding="async" width="1200" height="630">/)
assert.match(fig, /<figcaption>Opis slike<\/figcaption>/)
assert.match(renderBody('![A](/x.jpg)'), /<img src="\/x\.jpg" alt="A" loading="lazy" decoding="async">/)

/* inline formatting + escaping (no raw HTML from content) */
assert.equal(inline('**a** *b* [c](/d)'), '<strong>a</strong> <em>b</em> <a href="/d">c</a>')
assert.equal(inline('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;')
assert.match(renderBody('<b>x</b>'), /&lt;b&gt;x&lt;\/b&gt;/)

/* frontmatter */
const raw = '---\ntitle: T\ndescription: D\ndate: 2026-08-19\nimage: /blog/slike/x.svg\n---\n\ntekst tekst\n'
const post = parsePost(raw, 'proba')
assert.equal(post.title, 'T')
assert.equal(post.url, `${SITE}/blog/proba`)
assert.equal(post.minute, 1)
assert.throws(() => parsePost('nema frontmattera', 'x'), /frontmatter/)
assert.throws(() => parsePost('---\ntitle: T\ndescription: D\n---\nx', 'x'), /date/)
assert.throws(() => parsePost('---\ntitle: T\ndescription: D\ndate: 19.8.2026\n---\nx', 'x'), /YYYY-MM-DD/)
assert.equal(croDate('2026-08-19'), '19. kolovoza 2026.')

/* post head: title, description, canonical, og, JSON-LD, lang */
const html = renderPost(post)
for (const needle of [
  '<html lang="hr">',
  '<title>T · Tržnjak</title>',
  '<meta name="description" content="D">',
  `<link rel="canonical" href="${SITE}/blog/proba">`,
  '<meta property="og:type" content="article">',
  '<meta property="og:title" content="T">',
  '<meta property="og:description" content="D">',
  `<meta property="og:image" content="${SITE}/blog/slike/x.svg">`,
  '<script type="application/ld+json">',
  '"@type":"Article"',
]) assert.ok(html.includes(needle), `nedostaje u HTML-u posta: ${needle}`)
assert.ok(!/<script(?! type="application\/ld\+json")/.test(html), 'post ne smije imati izvrsni <script> (CSP)')

/* index lists every post, newest first */
const older = parsePost(raw.replace('2026-08-19', '2026-01-01').replace('title: T', 'title: Stariji'), 'stariji')
const index = renderIndex([post, older])
assert.ok(index.indexOf('/blog/proba') < index.indexOf('/blog/stariji'), 'index mora biti od najnovijeg')
assert.match(index, /<link rel="canonical" href="https:\/\/trznjak\.com\/blog">/)

/* sitemap injection */
const base = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset>\n  <url><loc>https://trznjak.com/</loc></url>\n</urlset>\n'
const sm = buildSitemap(base, [{ loc: `${SITE}/blog/proba`, lastmod: '2026-08-19', changefreq: 'yearly', priority: '0.6' }])
assert.match(sm, /<loc>https:\/\/trznjak\.com\/blog\/proba<\/loc>/)
assert.match(sm, /<lastmod>2026-08-19<\/lastmod>/)
assert.ok(sm.trim().endsWith('</urlset>'))
assert.throws(() => buildSitemap('<xml/>', []), /urlset/)

/* real content parses and every referenced local image exists */
const posts = loadPosts()
assert.ok(posts.length >= 1, 'nema objava u content/blog/')
const { existsSync } = await import('node:fs')
for (const p of posts) {
  for (const [, src] of p.body.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)/g)) {
    assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), `${p.slug}: nema slike ${src}`)
  }
  if (p.image) assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)), `${p.slug}: nema og:image ${p.image}`)
}

console.log(`build-blog self-check OK (${posts.length} objava)`)
