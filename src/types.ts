export type Locale = 'pt-BR' | 'en-US' | 'es'

export type PageKind =
  | 'home'
  | 'features'
  | 'platform'
  | 'pricing'
  | 'compare'
  | 'tools'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'cookies'
  | 'terms'
  | 'comparison'
  | 'not-found'

export interface PageMeta {
  title: string
  description: string
  heading: string
  eyebrow: string
  path: string
}

export interface ScreenshotProps {
  id: string
  label: string
  alt: string
  ratio?: string
  tone?: 'wide' | 'tall' | 'square'
}

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'PT',
  'en-US': 'EN',
  es: 'ES',
}

export const localeFromPath = (path: string): Locale => {
  if (path === '/en' || path.startsWith('/en/')) return 'en-US'
  if (path === '/es' || path.startsWith('/es/')) return 'es'
  return 'pt-BR'
}

export const localePrefix = (locale: Locale): string => {
  if (locale === 'en-US') return '/en'
  if (locale === 'es') return '/es'
  return ''
}

export const localizedPath = (locale: Locale, slug = ''): string => {
  const prefix = localePrefix(locale)
  return slug ? `${prefix}/${slug}` : prefix || '/'
}

export const localeCode = (locale: Locale): string => {
  if (locale === 'en-US') return 'en'
  if (locale === 'es') return 'es'
  return 'pt-BR'
}

export const pageKindFromSlug = (slug?: string): PageKind => {
  if (!slug) return 'home'
  if (slug === 'features') return 'features'
  if (slug === 'platform') return 'platform'
  if (slug === 'pricing') return 'pricing'
  if (slug === 'compare') return 'compare'
  if (slug === 'tools') return 'tools'
  if (slug === 'about') return 'about'
  if (slug === 'contact') return 'contact'
  if (slug === 'privacy') return 'privacy'
  if (slug === 'cookies') return 'cookies'
  if (slug === 'terms') return 'terms'
  if (slug.startsWith('compare/')) return 'comparison'
  return 'not-found'
}

export const appUrlFromEnv = (): string =>
  (import.meta.env.VITE_BREW_PILOT_APP_URL || 'https://dev-app.brewpilot.com.br').replace(/\/$/, '').replace(/#.*$/, '')
