<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { mdiCompassOutline, mdiInformationOutline, mdiTagOutline, mdiViewGridOutline } from '@mdi/js'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localizedPath, localeLabels, type Locale } from '../types'
import { brewPilotApp } from '../utils/connector'
import { trackMarketingEvent } from '../utils/analytics'
import logo from '../assets/logo-brew-right-full.webp'

const route = useRoute()
const { t } = useI18n()
const open = ref(false)
const exploreOpen = ref(false)
const exploreRef = ref<HTMLElement | null>(null)
const appNotice = ref('')
const locale = computed(() => route.meta.locale as Locale)
const slug = computed(() => (route.meta.slug as string | undefined) || '')
const languages: Locale[] = ['pt-BR', 'en-US', 'es']

const pageLink = (page: string): string => localizedPath(locale.value, page)
const topicLink = (anchor: string): string => route.meta.kind === 'home' ? `#${anchor}` : `${pageLink('')}#${anchor}`
const productLink = (): string => pageLink('produto')
const languageLink = (nextLocale: Locale): string => localizedPath(nextLocale, slug.value)
const docsUrl = import.meta.env.VITE_DOCS_URL
const exploreLinks = computed(() => [
  { href: topicLink('processo'), title: t('footer.howItWorks'), description: t('footer.exploreProcess'), icon: mdiCompassOutline },
  { href: topicLink('ferramentas'), title: t('footer.modules'), description: t('footer.exploreModules'), icon: mdiViewGridOutline },
  { href: topicLink('precos'), title: t('nav.pricing'), description: t('footer.explorePricing'), icon: mdiTagOutline },
  { href: topicLink('sobre'), title: t('footer.about'), description: t('footer.exploreAbout'), icon: mdiInformationOutline },
])

const openApp = (destination: 'login' | 'register'): void => {
  if (!brewPilotApp.isConfigured) {
    appNotice.value = t('common.appOnly')
    return
  }
  trackMarketingEvent('login_click', { locale: locale.value, page_path: route.path })
  window.location.assign(brewPilotApp.url(destination))
}

const close = (): void => {
  open.value = false
  exploreOpen.value = false
}

const closeExploreOnOutside = (event: PointerEvent): void => {
  if (exploreRef.value && event.target instanceof Node && !exploreRef.value.contains(event.target)) exploreOpen.value = false
}

const closeExploreOnEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') exploreOpen.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', closeExploreOnOutside)
  document.addEventListener('keydown', closeExploreOnEscape)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', closeExploreOnOutside)
  document.removeEventListener('keydown', closeExploreOnEscape)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-open': open }">
    <div class="header-inner">
      <a class="brand" :href="pageLink('')" aria-label="Brew Pilot">
        <img :src="logo" alt="Brew Pilot" width="164" height="40" />
      </a>

      <nav class="desktop-nav" aria-label="Navegação principal">
        <div ref="exploreRef" class="nav-resource">
          <button class="nav-link" type="button" :aria-expanded="exploreOpen" @click="exploreOpen = !exploreOpen">{{ t('footer.explore') }} <span aria-hidden="true">↓</span></button>
          <div v-if="exploreOpen" class="resource-menu">
            <a v-for="link in exploreLinks" :key="link.title" :href="link.href" @click="close"><svg aria-hidden="true" viewBox="0 0 24 24"><path :d="link.icon" /></svg><span><strong>{{ link.title }}</strong><small>{{ link.description }}</small></span></a>
          </div>
        </div>
        <a :href="productLink()">{{ t('nav.product') }}</a>
        <a v-if="docsUrl" :href="docsUrl" target="_blank" rel="noopener noreferrer">{{ t('footer.documentation') }} <span aria-hidden="true">↗</span></a>
      </nav>

      <div class="header-actions">
        <div class="language-switcher" :aria-label="t('common.language')">
          <a v-for="language in languages" :key="language" :href="languageLink(language)" :class="{ active: language === locale }">
            {{ localeLabels[language] }}
          </a>
        </div>
        <button class="text-button login-button" type="button" @click="openApp('login')">{{ t('nav.login') }}</button>
        <button class="button button-small header-cta" type="button" @click="openApp('register')">{{ t('nav.start') }}</button>
        <button class="menu-toggle" type="button" :aria-expanded="open" :aria-label="open ? t('nav.close') : t('nav.menu')" @click="open = !open">
          <span></span><span></span>
        </button>
      </div>
    </div>

    <p v-if="appNotice" class="app-notice" role="status">{{ appNotice }}</p>

    <div v-if="open" class="mobile-panel">
      <nav :aria-label="t('nav.product')">
        <a :href="topicLink('processo')" @click="close">{{ t('footer.howItWorks') }}</a>
        <a :href="topicLink('ferramentas')" @click="close">{{ t('footer.modules') }}</a>
        <a :href="topicLink('precos')" @click="close">{{ t('nav.pricing') }}</a>
        <a :href="topicLink('sobre')" @click="close">{{ t('footer.about') }}</a>
        <a :href="productLink()" @click="close">{{ t('nav.product') }}</a>
        <a v-if="docsUrl" :href="docsUrl" target="_blank" rel="noopener noreferrer">{{ t('footer.documentation') }} ↗</a>
      </nav>
      <div class="mobile-actions">
        <button class="text-button" type="button" @click="openApp('login'); close()">{{ t('nav.login') }}</button>
        <button class="button" type="button" @click="openApp('register'); close()">{{ t('nav.start') }}</button>
      </div>
    </div>
  </header>
</template>
