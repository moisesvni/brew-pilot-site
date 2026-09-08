import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import MarketingPage from './views/MarketingPage.vue'
import LegalPage from './views/LegalPage.vue'
import NotFoundPage from './views/NotFoundPage.vue'
import { localizedPath, pageKindFromSlug, type Locale } from './types'

const localeRoute = (locale: Locale, slug: string, indexable = true, component = MarketingPage): RouteRecordRaw => ({
  path: localizedPath(locale, slug),
  name: `${locale}-${slug || 'home'}`,
  component,
  meta: {
    locale,
    slug,
    kind: pageKindFromSlug(slug),
    indexable,
  },
})

const publicSlugs = ['', 'produto', 'features', 'platform', 'pricing', 'about', 'contact']
const legacySlugs = ['compare', 'tools']
const legalSlugs = ['privacy', 'cookies', 'terms']
const comparisonSlugs = ['compare/brewfather', 'compare/beersmith', 'compare/brewers-friend']

export const routes: RouteRecordRaw[] = [
  ...(['pt-BR', 'en-US', 'es'] as Locale[]).flatMap((locale) => [
    ...publicSlugs.map((slug) => localeRoute(locale, slug)),
    ...legacySlugs.map((slug) => localeRoute(locale, slug, false)),
    ...legalSlugs.map((slug) => localeRoute(locale, slug, true, LegalPage)),
    ...comparisonSlugs.map((slug) => localeRoute(locale, slug, false)),
  ]),
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { locale: 'pt-BR' as Locale, kind: 'not-found', indexable: false },
  },
]

export const scrollBehavior = (to: RouteLocationNormalized, _from: RouteLocationNormalized, savedPosition: { left: number; top: number } | null) => {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: 'smooth' as const }
  return { top: 0 }
}
