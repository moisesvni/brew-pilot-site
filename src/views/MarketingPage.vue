<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getPageCopy, getUi, type MarketingPageKind } from '../content'
import { BrewPilotAppConnector, supportEmail } from '../utils/connector'
import { trackMarketingEvent } from '../utils/analytics'
import { localeCode, localeFromPath, localizedPath } from '../types'
import ProductScreenshotPlaceholder from '../components/ProductScreenshotPlaceholder.vue'
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

const localized = (slug: string): string => localizedPath(locale.value, slug)
const heroSecondarySlug = computed(() => kind.value === 'platform' ? 'pricing' : 'features')
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
    <section class="hero page-wrap" :class="{ 'hero-draft': isDraft, 'hero-pricing': kind === 'pricing' }">
      <div class="hero-copy">
        <p class="eyebrow">{{ copy.meta.eyebrow }}</p>
        <h1>{{ copy.meta.heading }}</h1>
        <p class="lead">{{ copy.intro }}</p>
        <div class="hero-actions">
          <button class="button" type="button" @click="heroCta">{{ copy.cta }}</button>
          <a class="button button-quiet" :href="localized(heroSecondarySlug)">{{ copy.secondary || ui.nav.explore }}</a>
        </div>
        <p v-if="!connector.isConfigured && (kind === 'home' || kind === 'pricing')" class="configuration-note">{{ ui.common.appOnly }}</p>
      </div>
      <div v-if="kind === 'home'" class="hero-media">
        <ProductScreenshotPlaceholder v-for="media in copy.screenshots.slice(0, 1)" :key="media.id" v-bind="media" />
        <div class="hero-stamp" aria-hidden="true"><span>BREW</span><strong>PILOT</strong></div>
      </div>
      <div v-else class="hero-index" aria-hidden="true"><span>BP</span><b>{{ String(kind).toUpperCase() }}</b></div>
    </section>

    <template v-if="kind === 'home'">
      <section v-reveal class="cycle-section page-wrap" aria-labelledby="cycle-title">
        <div class="section-intro"><p class="eyebrow">{{ copy.sections[0].title }}</p><h2 id="cycle-title">{{ copy.sections[0].body }}</h2></div>
        <ol class="cycle-list">
          <li v-for="(step, index) in ui.cycle" :key="step" :class="{ featured: index === 0 }"><span>0{{ index + 1 }}</span><strong>{{ step }}</strong><em>{{ ui.cycleDescriptions[index] }}</em></li>
        </ol>
      </section>

      <section v-reveal class="story-grid page-wrap" :aria-label="ui.common.productStories">
        <article v-reveal class="story story-wide">
          <div><p class="eyebrow">{{ copy.sections[1].title }}</p><h2>{{ copy.sections[1].body }}</h2></div>
          <ProductScreenshotPlaceholder v-bind="copy.screenshots[2]" />
        </article>
        <article v-reveal class="story story-tall" style="--reveal-delay: 90ms">
          <ProductScreenshotPlaceholder v-bind="copy.screenshots[1]" />
          <div><h2>{{ copy.sections[2].title }}</h2><p>{{ copy.sections[2].body }}</p></div>
        </article>
        <article v-reveal class="story story-wide story-reverse" style="--reveal-delay: 150ms">
          <div><h2>{{ copy.sections[3].title }}</h2><p>{{ copy.sections[3].body }}</p></div>
          <ProductScreenshotPlaceholder v-bind="copy.screenshots[6]" />
        </article>
      </section>

      <section v-reveal class="bento-section page-wrap" aria-labelledby="ecosystem-title">
        <div class="section-intro"><p class="eyebrow">{{ copy.sections[4].title }}</p><h2 id="ecosystem-title">{{ copy.sections[4].body }}</h2></div>
        <div class="bento-grid">
          <article v-for="(item, index) in ui.bento" v-reveal :key="item.title" :style="{ '--reveal-delay': `${index * 90}ms` }" :class="{ 'bento-accent': index === 1 }"><span class="bento-number">0{{ index + 1 }}</span><h3>{{ item.title }}</h3><p>{{ item.body }}</p></article>
        </div>
      </section>

      <section v-reveal class="assistant-section page-wrap">
        <div class="assistant-copy"><p class="eyebrow">{{ copy.sections[5].title }}</p><h2>{{ copy.sections[5].body }}</h2><span class="soon-label">{{ ui.common.soon }}</span></div>
        <div class="assistant-mark" aria-label="Dr. Hoppin placeholder"><span>?</span><strong>DR. HOPPIN</strong><small>{{ ui.assistantPlaceholder }}</small></div>
      </section>

      <section v-reveal class="workflow-strip page-wrap">
        <div><p class="eyebrow">{{ ui.nav.platform }}</p><h2>{{ copy.sections[6].title }}</h2><p>{{ copy.sections[6].body }}</p></div>
        <div class="workflow-points"><div v-for="(step, index) in ui.cycle.slice(0, 4)" :key="step"><span>0{{ index + 1 }}</span><strong>{{ step }}</strong></div></div>
      </section>

      <section v-reveal class="value-section page-wrap" id="faq">
        <div class="section-intro"><p class="eyebrow">{{ ui.nav.pricing }}</p><h2>{{ ui.homeValueTitle }}</h2><p>{{ ui.homeValueBody }}</p></div>
        <div class="value-actions"><button class="button" type="button" @click="openApp('plans')">{{ ui.nav.pricing }}</button><div class="faq-list"><details v-for="item in copy.faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></div></div>
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
        <div class="pricing-plan-grid">
          <article v-for="plan in ui.pricingPlans" v-reveal :key="plan.key" class="pricing-plan" :class="[`pricing-plan--${plan.key}`, { 'pricing-plan--featured': plan.featured }]" :style="{ '--reveal-delay': `${['free', 'plus', 'pro'].indexOf(plan.key) * 90}ms` }">
            <div class="pricing-plan-top"><span class="pricing-plan-marker">{{ plan.marker }}</span><span class="pricing-plan-index">0{{ ['free', 'plus', 'pro'].indexOf(plan.key) + 1 }}</span></div>
            <h3>{{ plan.name }}</h3>
            <p class="pricing-plan-description">{{ plan.description }}</p>
            <div class="pricing-plan-price"><strong>{{ plan.price }}</strong><span>{{ plan.cadence }}</span></div>
            <ul class="pricing-feature-list"><li v-for="feature in plan.features" :key="feature"><span aria-hidden="true">+</span>{{ feature }}</li></ul>
            <button class="button" type="button" @click="openApp('plans')">{{ plan.cta }}</button>
          </article>
        </div>
        <p class="pricing-disclaimer">{{ copy.sections[2].body }}</p>
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
