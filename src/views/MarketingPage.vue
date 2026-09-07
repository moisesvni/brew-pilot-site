<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getPageCopy, getUi, type MarketingPageKind } from '../content'
import { BrewPilotAppConnector, supportEmail } from '../utils/connector'
import { trackMarketingEvent } from '../utils/analytics'
import { localeCode, localeFromPath, localizedPath } from '../types'
import ProductScreenshotPlaceholder from '../components/ProductScreenshotPlaceholder.vue'
import PricingPlanCards from '../components/PricingPlanCards.vue'
import logo from '../assets/logo-brew-right-full.png'

const revealObservers = new WeakMap<HTMLElement, IntersectionObserver>()
const vReveal = {
  mounted: (element: HTMLElement) => {
    element.classList.add('scroll-reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      element.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      element.classList.add('is-visible')
      observer.unobserve(element)
      revealObservers.delete(element)
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    revealObservers.set(element, observer)
    observer.observe(element)
  },
  beforeUnmount: (element: HTMLElement) => {
    revealObservers.get(element)?.disconnect()
    revealObservers.delete(element)
  },
}

const route = useRoute()
const locale = computed(() => localeFromPath(route.path))
const kind = computed(() => (route.meta.kind as MarketingPageKind) || 'home')
const copy = computed(() => getPageCopy(locale.value, kind.value))
const ui = computed(() => getUi(locale.value))
const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://brewpilot.com').replace(/\/$/, '')
const connector = new BrewPilotAppConnector()
const email = supportEmail()

const productToolset = computed(() => ({
  'pt-BR': {
    eyebrow: 'O que você consegue fazer no app',
    title: 'Ferramentas para planejar, executar e aprender com cada lote.',
    body: 'O Brew Pilot organiza o trabalho da cervejaria em partes conectadas. Cada registro serve para preparar, acompanhar ou melhorar a próxima brassagem.',
    items: [
      ['Receitas e formulação', 'Crie receitas com maltes, lúpulos, leveduras, etapas de mostura e estimativas de OG, FG, ABV, IBU e cor.', 'Editor de receita, ingredientes, cálculos e faixas de estilo'],
      ['Brew Day', 'Leve a receita para um checklist de brassagem com mostura, fervura, adições, timers e ajustes registrados no próprio lote.', 'Checklist, timers, adições e alterações do dia'],
      ['Lotes e fermentação', 'Registre leituras, notas e etapas da fermentação. Compare versões para entender o que mudou entre uma brassagem e outra.', 'Histórico, medições, fermentação e versões'],
      ['Estoque e custos', 'Acompanhe insumos disponíveis, consumo e custo por lote antes de colocar uma receita em produção.', 'Ingredientes, disponibilidade, consumo e custo'],
      ['Perfis cervejeiros', 'Mantenha equipamento, água, mostura, fermentação e carbonatação ligados à receita que você está construindo.', 'Equipamento, água, mostura, fermentação e carbonatação'],
      ['Exportações e calculadoras', 'Use calculadoras avançadas e exporte dados quando precisar levar a receita ou o histórico para outro fluxo.', 'PDF, BeerXML, JSON e calculadoras de mostura'],
    ],
  },
  'en-US': {
    eyebrow: 'What you can do in the app', title: 'Tools to plan, execute, and learn from every batch.', body: 'Brew Pilot organizes brewery work into connected parts. Every record helps prepare, track, or improve the next brew.',
    items: [['Recipes and formulation', 'Create recipes with malts, hops, yeast, mash steps, and OG, FG, ABV, IBU, and color estimates.', 'Recipe editor, ingredients, calculations, and style ranges'], ['Brew Day', 'Take the recipe into a brew-day checklist with mash, boil, additions, timers, and adjustments recorded on the batch.', 'Checklist, timers, additions, and day-of changes'], ['Batches and fermentation', 'Record readings, notes, and fermentation stages. Compare versions to understand what changed between brews.', 'History, readings, fermentation, and versions'], ['Inventory and costs', 'Track available ingredients, consumption, and batch cost before putting a recipe into production.', 'Ingredients, availability, consumption, and cost'], ['Brewing profiles', 'Keep equipment, water, mash, fermentation, and carbonation connected to the recipe you are building.', 'Equipment, water, mash, fermentation, and carbonation'], ['Exports and calculators', 'Use advanced calculators and export data when you need to take a recipe or history into another workflow.', 'PDF, BeerXML, JSON, and mash calculators']],
  },
  es: {
    eyebrow: 'Lo que puedes hacer en la app', title: 'Herramientas para planificar, ejecutar y aprender de cada lote.', body: 'Brew Pilot organiza el trabajo cervecero en partes conectadas. Cada registro ayuda a preparar, acompañar o mejorar la próxima elaboración.',
    items: [['Recetas y formulación', 'Crea recetas con maltas, lúpulos, levaduras, etapas de maceración y estimaciones de OG, FG, ABV, IBU y color.', 'Editor de recetas, ingredientes, cálculos y rangos de estilo'], ['Brew Day', 'Lleva la receta a un checklist con maceración, hervor, adiciones, temporizadores y ajustes registrados en el lote.', 'Checklist, temporizadores, adiciones y cambios del día'], ['Lotes y fermentación', 'Registra lecturas, notas y etapas de fermentación. Compara versiones para entender qué cambió entre elaboraciones.', 'Historial, mediciones, fermentación y versiones'], ['Inventario y costes', 'Acompaña ingredientes disponibles, consumo y coste por lote antes de producir una receta.', 'Ingredientes, disponibilidad, consumo y coste'], ['Perfiles cerveceros', 'Mantén equipo, agua, maceración, fermentación y carbonatación conectados a la receta que estás creando.', 'Equipo, agua, maceración, fermentación y carbonatación'], ['Exportaciones y calculadoras', 'Usa calculadoras avanzadas y exporta datos cuando necesites llevar una receta o historial a otro flujo.', 'PDF, BeerXML, JSON y calculadoras de maceración']],
  },
}[locale.value]))

const localized = (slug: string): string => localizedPath(locale.value, slug)
const heroSecondarySlug = computed(() => kind.value === 'platform' ? 'pricing' : 'features')
const heroSecondaryHref = computed(() => kind.value === 'home' ? '#processo' : localized(heroSecondarySlug.value))
const alternateLinks = computed(() => [
  { hreflang: 'pt-BR', href: `${siteUrl}${localizedPath('pt-BR', route.meta.slug as string || '')}` },
  { hreflang: 'en-US', href: `${siteUrl}${localizedPath('en-US', route.meta.slug as string || '')}` },
  { hreflang: 'es', href: `${siteUrl}${localizedPath('es', route.meta.slug as string || '')}` },
  { hreflang: 'x-default', href: `${siteUrl}${localizedPath('pt-BR', route.meta.slug as string || '')}` },
])
const canonical = computed(() => `${siteUrl}${localizedPath(locale.value, route.meta.slug as string || '')}`)
const isDraft = computed(() => route.meta.indexable === false)

useHead(() => ({
  htmlAttrs: { lang: localeCode(locale.value) },
  title: copy.value.meta.title,
  meta: [
    { name: 'description', content: copy.value.meta.description },
    { name: 'robots', content: isDraft.value ? 'noindex, nofollow' : 'index, follow' },
    { property: 'og:title', content: copy.value.meta.title },
    { property: 'og:description', content: copy.value.meta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical.value },
    { property: 'og:image', content: `${siteUrl}${logo}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: copy.value.meta.title },
    { name: 'twitter:description', content: copy.value.meta.description },
  ],
  link: [
    { rel: 'canonical' as const, href: canonical.value },
    ...alternateLinks.value.map((item) => ({ rel: 'alternate' as const, hreflang: item.hreflang, href: item.href })),
  ],
  script: isDraft.value ? [] : [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Brew Pilot', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: canonical.value }) }],
}))

onMounted(() => {
  if (kind.value === 'home') trackMarketingEvent('landing_view', { locale: locale.value, page_path: route.path })
  if (kind.value === 'pricing') trackMarketingEvent('pricing_view', { locale: locale.value, page_path: route.path })
  if (kind.value === 'platform') trackMarketingEvent('platform_view', { locale: locale.value, page_path: route.path })
})

const openApp = (destination: 'register' | 'plans' | 'login'): void => {
  if (!connector.isConfigured) return
  if (destination === 'plans') trackMarketingEvent('pricing_app_click', { locale: locale.value, page_path: route.path })
  window.location.assign(connector.url(destination))
}

const heroCta = (): void => {
  if (kind.value === 'pricing') openApp('plans')
  else openApp('register')
}
</script>

<template>
  <main class="marketing-page">
    <section id="produto" class="hero page-wrap" :class="{ 'hero-draft': isDraft, 'hero-home': kind === 'home', 'hero-pricing': kind === 'pricing' }">
      <div class="hero-copy">
        <p class="eyebrow">{{ copy.meta.eyebrow }}</p>
        <h1>{{ copy.meta.heading }}</h1>
        <p class="lead">{{ copy.intro }}</p>
        <div class="hero-actions">
          <button class="button" type="button" @click="heroCta">{{ copy.cta }}</button>
          <a class="button button-quiet" :href="heroSecondaryHref">{{ copy.secondary || ui.nav.explore }}</a>
        </div>
        <p v-if="!connector.isConfigured && (kind === 'home' || kind === 'pricing')" class="configuration-note">{{ ui.common.appOnly }}</p>
      </div>
      <div v-if="kind !== 'home'" class="hero-index" aria-hidden="true"><span>BP</span><b>{{ String(kind).toUpperCase() }}</b></div>
    </section>

    <template v-if="kind === 'home'">
      <section id="processo" v-reveal class="cycle-section page-wrap" aria-labelledby="cycle-title">
        <div class="section-intro"><p class="eyebrow">{{ copy.sections[0].title }}</p><h2 id="cycle-title">{{ copy.sections[0].body }}</h2></div>
        <ol class="cycle-list">
          <li v-for="(step, index) in ui.cycle" :key="step" :class="{ featured: index === 0 }"><span>0{{ index + 1 }}</span><strong>{{ step }}</strong><em>{{ ui.cycleDescriptions[index] }}</em></li>
        </ol>
      </section>

      <section id="ferramentas" v-reveal class="product-toolset page-wrap" aria-labelledby="toolset-title">
        <div class="toolset-intro"><p class="eyebrow">{{ productToolset.eyebrow }}</p><h2 id="toolset-title">{{ productToolset.title }}</h2><p>{{ productToolset.body }}</p></div>
        <div class="toolset-grid">
          <article v-for="(item, index) in productToolset.items" v-reveal :key="item[0]" :style="{ '--reveal-delay': `${index * 55}ms` }">
            <span>0{{ index + 1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p><small>{{ item[2] }}</small>
          </article>
        </div>
        <a class="text-link toolset-link" :href="localized('features')">{{ ui.nav.product }} <span aria-hidden="true">↗</span></a>
      </section>

      <section id="sobre" v-reveal class="about-strip page-wrap" aria-labelledby="home-about-title">
        <div><p class="eyebrow">{{ ui.footer.about }}</p><h2 id="home-about-title">{{ ui.homeAboutTitle }}</h2></div>
        <div><p>{{ ui.homeAboutBody }}</p><a class="text-link" :href="localized('about')">{{ ui.homeAboutLink }} <span aria-hidden="true">↗</span></a></div>
      </section>

      <section id="precos" v-reveal class="home-pricing page-wrap" aria-labelledby="home-pricing-title">
        <div class="section-intro"><p class="eyebrow">{{ ui.nav.pricing }}</p><h2 id="home-pricing-title">{{ ui.pricingPlansTitle }}</h2><p>{{ ui.homeValueBody }}</p></div>
        <PricingPlanCards :plans="ui.pricingPlans" @select="openApp('plans')" />
        <p class="pricing-disclaimer">{{ ui.pricingDisclaimer }}</p>
      </section>

      <section v-reveal class="value-section page-wrap" id="faq">
        <div class="section-intro"><p class="eyebrow">{{ ui.common.faq }}</p><h2>{{ ui.faqTitle }}</h2><p>{{ ui.pricingFaqIntro }}</p></div>
        <div class="value-actions"><div class="faq-list"><details v-for="item in copy.faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></div></div>
      </section>

      <section v-reveal class="final-cta page-wrap"><p class="eyebrow">Brew Pilot</p><h2>{{ ui.homeFinalTitle }}</h2><button class="button" type="button" @click="heroCta">{{ copy.cta }}</button></section>
    </template>

    <template v-else-if="kind === 'features'">
      <section v-reveal class="feature-anchors page-wrap"><a v-for="(section, index) in copy.sections" :key="section.title" :href="`#feature-${index + 1}`"><span>0{{ index + 1 }}</span>{{ section.title }}</a></section>
      <section v-for="(section, index) in copy.sections" v-reveal :id="`feature-${index + 1}`" :key="section.title" class="feature-row page-wrap" :class="{ reverse: index % 2 === 1 }"><div><p class="eyebrow">{{ ui.cycle[index] || ui.common.soon }}</p><h2>{{ section.title }}</h2><p>{{ section.body }}</p></div><ProductScreenshotPlaceholder v-if="copy.screenshots[index]" v-bind="copy.screenshots[index]" /></section>
    </template>

    <template v-else-if="kind === 'platform'">
      <section v-reveal class="platform-intro page-wrap">
        <div><h2>{{ ui.platformOverviewTitle }}</h2><p>{{ copy.intro }}</p></div>
        <div class="platform-index" aria-hidden="true"><span>BP</span><b>BREW OS</b></div>
      </section>
      <section v-reveal class="platform-grid page-wrap" :aria-label="ui.common.productStories">
        <article v-for="(section, index) in copy.sections" v-reveal :key="section.title" class="platform-card" :class="{ 'platform-card--accent': index === 2 }" :style="{ '--reveal-delay': `${index * 70}ms` }">
          <div class="platform-card-top"><span>0{{ index + 1 }}</span><span>{{ ui.cycle[index] || ui.common.soon }}</span></div>
          <h2>{{ section.title }}</h2>
          <p>{{ section.body }}</p>
          <ProductScreenshotPlaceholder v-if="copy.screenshots[index]" v-bind="copy.screenshots[index]" />
        </article>
      </section>
    </template>

    <template v-else-if="kind === 'pricing'">
      <section v-reveal class="pricing-intro page-wrap">
        <div>
          <h2>{{ copy.sections[0].body }}</h2>
        </div>
        <p>{{ copy.intro }}</p>
      </section>
      <section v-reveal class="pricing-plans page-wrap" aria-labelledby="pricing-plans-title">
        <div class="pricing-plans-heading">
          <div><h2 id="pricing-plans-title">{{ ui.pricingPlansTitle }}</h2></div>
          <span class="pricing-source">{{ ui.common.appOnly }}</span>
        </div>
        <PricingPlanCards :plans="ui.pricingPlans" @select="openApp('plans')" />
        <p class="pricing-disclaimer">{{ ui.pricingDisclaimer }}</p>
      </section>
      <section v-reveal class="pricing-faq page-wrap" id="faq"><div><p class="eyebrow">{{ ui.common.faq }}</p><h2>{{ ui.faqTitle }}</h2><p class="pricing-faq-intro">{{ ui.pricingFaqIntro }}</p></div><div class="faq-list"><details v-for="item in copy.faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></div></section>
    </template>

    <template v-else-if="kind === 'tools'">
      <section class="tools-grid page-wrap"><article v-for="section in copy.sections" :key="section.title"><span class="soon-label">{{ ui.common.soon }}</span><h2>{{ section.title }}</h2><p>{{ section.body }}</p></article></section>
    </template>

    <template v-else-if="kind === 'contact'">
      <section class="contact-panel page-wrap"><div><p class="eyebrow">{{ copy.sections[0].title }}</p><h2>{{ copy.sections[0].body }}</h2><a v-if="email" class="contact-email" :href="`mailto:${email}`">{{ email }}</a><span v-else class="pending-label">{{ ui.common.pending }}</span></div><div class="pending-card"><span class="pending-icon" aria-hidden="true">+</span><h3>{{ ui.common.pending }}</h3><p>{{ copy.sections[1].body }}</p></div></section>
    </template>

    <template v-else-if="kind === 'about'">
      <section class="about-grid page-wrap"><article v-for="section in copy.sections" :key="section.title"><span class="about-line"></span><h2>{{ section.title }}</h2><p>{{ section.body }}</p></article></section>
    </template>

    <template v-else-if="kind === 'compare'">
      <section class="compare-grid page-wrap"><article v-for="section in copy.sections" :key="section.title"><span class="compare-index">0{{ copy.sections.indexOf(section) + 1 }}</span><h2>{{ section.title }}</h2><p>{{ section.body }}</p></article></section>
    </template>

    <template v-else-if="kind === 'comparison'">
      <section class="draft-panel page-wrap"><span class="draft-lock">{{ ui.common.soon }}</span><h2>{{ copy.sections[0].title }}</h2><p>{{ copy.sections[0].body }}</p></section>
    </template>
  </main>
</template>
