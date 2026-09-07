<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localizedPath, localeLabels, type Locale } from '../types'
import { brewPilotApp } from '../utils/connector'
import { trackMarketingEvent } from '../utils/analytics'
import logo from '../assets/logo-brew-right-full.png'

const route = useRoute()
const { t } = useI18n()
const open = ref(false)
const appNotice = ref('')
const locale = computed(() => route.meta.locale as Locale)
const slug = computed(() => (route.meta.slug as string | undefined) || '')
const languages: Locale[] = ['pt-BR', 'en-US', 'es']

const pageLink = (page: string): string => localizedPath(locale.value, page)
const topicLink = (anchor: string): string => route.meta.kind === 'home' ? `#${anchor}` : `${pageLink('')}#${anchor}`
const languageLink = (nextLocale: Locale): string => localizedPath(nextLocale, slug.value)

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
}
</script>

<template>
  <header class="site-header" :class="{ 'is-open': open }">
    <div class="header-inner">
      <a class="brand" :href="pageLink('')" aria-label="Brew Pilot">
        <img :src="logo" alt="Brew Pilot" width="164" height="40" />
      </a>

      <nav class="desktop-nav" :aria-label="t('nav.product')">
        <a :href="topicLink('produto')">{{ t('nav.product') }}</a>
        <a :href="topicLink('precos')">{{ t('nav.pricing') }}</a>
        <a :href="topicLink('sobre')">{{ t('footer.about') }}</a>
        <a :href="topicLink('faq')">{{ t('common.faq') }}</a>
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
        <a :href="topicLink('produto')" @click="close">{{ t('nav.product') }}</a>
        <a :href="topicLink('precos')" @click="close">{{ t('nav.pricing') }}</a>
        <a :href="topicLink('sobre')" @click="close">{{ t('footer.about') }}</a>
        <a :href="topicLink('faq')" @click="close">{{ t('common.faq') }}</a>
      </nav>
      <div class="mobile-actions">
        <button class="text-button" type="button" @click="openApp('login'); close()">{{ t('nav.login') }}</button>
        <button class="button" type="button" @click="openApp('register'); close()">{{ t('nav.start') }}</button>
      </div>
    </div>
  </header>
</template>
