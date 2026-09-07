<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getPageCopy, getUi, type MarketingPageKind } from '../content'
import { BrewPilotAppConnector, supportEmail } from '../utils/connector'
import { trackMarketingEvent } from '../utils/analytics'
import { localeCode, localeFromPath, localizedPath } from '../types'
import ProductScreenshotPlaceholder from '../components/ProductScreenshotPlaceholder.vue'
import PricingPlanCards from '../components/PricingPlanCards.vue'
import logo from '../assets/logo-brew-right-full.png'
import brewStamp from '../assets/logo-brew-withe.png'
import productPrintLight from '../assets/print-recipe-ligth.png'
import productPrintDark from '../assets/print-recipe-back.png'

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
const showLightPrint = ref(false)
let printTimer: ReturnType<typeof setInterval> | undefined

const productToolset = computed(() => ({
  'pt-BR': {
    eyebrow: 'O QUE VOCÊ CONSEGUE FAZER NO BREW PILOT',
    title: 'Módulos que conectam sua operação cervejeira.',
    body: 'Receitas, estoque, perfis e lotes trabalham juntos para transformar planejamento em execução e execução em aprendizado.',
    items: [
      ['Receitas e formulação', 'Crie receitas com cálculos e parâmetros cervejeiros.', 'Editor de receita, ingredientes e parâmetros'],
      ['Estoque e custos', 'Veja cobertura, consumo e custo por lote.', 'Ingredientes, disponibilidade, consumo e custo'],
      ['Perfis de produção', 'Reaproveite equipamento, água, mostura e fermentação.', 'Equipamento, água, mostura e fermentação'],
      ['Lotes e Brew Day', 'Leve a receita para a execução do lote.', 'Checklist, timers, adições e alterações do dia'],
      ['Fermentação e acompanhamento', 'Registre leituras, eventos e histórico do lote.', 'Medições, eventos, fermentação e histórico'],
      ['Comparação e evolução', 'Compare resultados e evolua a próxima versão.', 'Histórico, versões, resultados e ajustes'],
    ],
  },
  'en-US': {
    eyebrow: 'WHAT YOU CAN DO IN BREW PILOT', title: 'Modules that connect your brewing operation.', body: 'Recipes, inventory, profiles, and batches work together to turn planning into execution and execution into learning.',
    items: [['Recipes and formulation', 'Create recipes with brewing calculations and parameters.', 'Recipe editor, ingredients, and parameters'], ['Inventory and costs', 'See coverage, consumption, and cost per batch.', 'Ingredients, availability, consumption, and cost'], ['Production profiles', 'Reuse equipment, water, mash, and fermentation settings.', 'Equipment, water, mash, and fermentation'], ['Batches and Brew Day', 'Take the recipe into batch execution.', 'Checklist, timers, additions, and day-of changes'], ['Fermentation and tracking', 'Record readings, events, and batch history.', 'Readings, events, fermentation, and history'], ['Comparison and evolution', 'Compare results and improve the next version.', 'History, versions, results, and adjustments']],
  },
  es: {
    eyebrow: 'LO QUE PUEDES HACER EN BREW PILOT', title: 'Módulos que conectan tu operación cervecera.', body: 'Recetas, inventario, perfiles y lotes trabajan juntos para convertir la planificación en ejecución y la ejecución en aprendizaje.',
    items: [['Recetas y formulación', 'Crea recetas con cálculos y parámetros cerveceros.', 'Editor de recetas, ingredientes y parámetros'], ['Inventario y costes', 'Consulta cobertura, consumo y coste por lote.', 'Ingredientes, disponibilidad, consumo y coste'], ['Perfiles de producción', 'Reutiliza equipo, agua, maceración y fermentación.', 'Equipo, agua, maceración y fermentación'], ['Lotes y Brew Day', 'Lleva la receta a la ejecución del lote.', 'Checklist, temporizadores, adiciones y cambios del día'], ['Fermentación y seguimiento', 'Registra mediciones, eventos e historial del lote.', 'Mediciones, eventos, fermentación e historial'], ['Comparación y evolución', 'Compara resultados y mejora la próxima versión.', 'Historial, versiones, resultados y ajustes']],
  },
}[locale.value]))
const heroHeadingLines = computed(() => {
  const words = copy.value.meta.heading.split(' ')
  return { first: words.slice(0, 3).join(' '), second: words.slice(3).join(' ') }
})

const localized = (slug: string): string => localizedPath(locale.value, slug)
const heroSecondarySlug = computed(() => kind.value === 'platform' ? 'pricing' : 'features')
const heroSecondaryHref = computed(() => kind.value === 'home' ? localized('platform') : localized(heroSecondarySlug.value))
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
  if (kind.value === 'home') printTimer = setInterval(() => { showLightPrint.value = !showLightPrint.value }, 6500)
})

onUnmounted(() => clearInterval(printTimer))

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
        <h1 v-if="kind === 'home'"><span class="hero-heading-first">{{ heroHeadingLines.first }}</span><br>{{ heroHeadingLines.second }}</h1>
        <h1 v-else>{{ copy.meta.heading }}</h1>
        <p class="lead">{{ copy.intro }}</p>
        <div class="hero-actions">
          <button class="button" type="button" @click="heroCta">{{ copy.cta }}</button>
          <a class="button button-quiet" :href="heroSecondaryHref">{{ copy.secondary || ui.nav.explore }}</a>
        </div>
        <p v-if="!connector.isConfigured && (kind === 'home' || kind === 'pricing')" class="configuration-note">{{ ui.common.appOnly }}</p>
      </div>
      <div v-if="kind === 'home'" class="hero-product-preview">
        <img :src="showLightPrint ? productPrintLight : productPrintDark" :alt="showLightPrint ? 'Editor de receita do Brew Pilot em modo claro' : 'Editor de receita do Brew Pilot em modo escuro'" :width="showLightPrint ? 3204 : 3230" :height="showLightPrint ? 1972 : 2252" />
        <div class="preview-slider-controls" role="group" aria-label="Alternar visualização do sistema">
          <button type="button" :class="{ active: !showLightPrint }" aria-label="Ver sistema em modo escuro" :aria-pressed="!showLightPrint" @click="showLightPrint = false"><span aria-hidden="true"></span>Escuro</button>
          <button type="button" :class="{ active: showLightPrint }" aria-label="Ver sistema em modo claro" :aria-pressed="showLightPrint" @click="showLightPrint = true"><span aria-hidden="true"></span>Claro</button>
        </div>
      </div>
      <div v-if="kind !== 'home'" class="hero-index" aria-hidden="true"><span>BP</span><b>{{ String(kind).toUpperCase() }}</b></div>
    </section>

    <template v-if="kind === 'home'">
      <section id="processo" v-reveal class="cycle-section page-wrap" aria-labelledby="cycle-title">
        <div class="cycle-stamp" aria-hidden="true">
          <img :src="brewStamp" alt="" width="861" height="845" />
        </div>
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
