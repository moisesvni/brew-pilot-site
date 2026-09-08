import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = (process.env.VITE_SITE_URL || 'https://brewpilot.com').replace(/\/$/, '')
const locales = ['', 'en', 'es']
const slugs = ['', 'produto', 'features', 'platform', 'pricing', 'about', 'contact', 'privacy', 'cookies', 'terms']

const routePath = (locale, slug) => {
  const prefix = locale ? `/${locale}` : ''
  return slug ? `${prefix}/${slug}` : prefix || '/'
}

const paths = locales.flatMap((locale) => slugs.map((slug) => routePath(locale, slug)))
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${siteUrl}${path === '/' ? '' : path}</loc></url>`).join('\n')}\n</urlset>\n`
const robots = `User-agent: *\nAllow: /\nDisallow: /compare/brewfather\nDisallow: /compare/beersmith\nDisallow: /compare/brewers-friend\nDisallow: /en/compare/brewfather\nDisallow: /en/compare/beersmith\nDisallow: /en/compare/brewers-friend\nDisallow: /es/compare/brewfather\nDisallow: /es/compare/beersmith\nDisallow: /es/compare/brewers-friend\nSitemap: ${siteUrl}/sitemap.xml\n`
const notFound = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Página não encontrada | Brew Pilot</title><style>body{margin:0;background:#151719;color:#f4f2ed;font:16px system-ui,sans-serif;display:grid;min-height:100vh;place-items:center}main{max-width:560px;padding:32px}a{color:#d9a65c}</style></head><body><main><p>404</p><h1>Esta página ainda não existe.</h1><p>Volte para a home e continue explorando o Brew Pilot.</p><a href="/">Voltar para a home</a></main></body></html>`

const publicDir = resolve('public')
await mkdir(publicDir, { recursive: true })
await writeFile(resolve(publicDir, 'sitemap.xml'), sitemap)
await writeFile(resolve(publicDir, 'robots.txt'), robots)
await writeFile(resolve(publicDir, '404.html'), notFound)
