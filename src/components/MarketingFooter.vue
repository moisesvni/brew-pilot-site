<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localizedPath, localeLabels, type Locale } from '../types'
import { brewPilotApp } from '../utils/connector'
import logo from '../assets/logo-brew-right-full.png'

const route = useRoute()
const { t } = useI18n()
const locale = computed(() => route.meta.locale as Locale)
const pageLink = (page: string): string => localizedPath(locale.value, page)
const ctaHref = computed(() => brewPilotApp.isConfigured ? brewPilotApp.url('register') : pageLink('features'))
const ctaLabel = computed(() => brewPilotApp.isConfigured ? t('nav.start') : t('footer.ctaAction'))
const languages: Locale[] = ['pt-BR', 'en-US', 'es']
</script>

<template>
  <footer class="site-footer">
    <section class="footer-cta" aria-labelledby="footer-cta-title">
      <div class="footer-cta-copy">
        <p class="footer-kicker">Brew Pilot</p>
        <h2 id="footer-cta-title">{{ t('footer.ctaTitle') }}</h2>
        <p>{{ t('footer.ctaBody') }}</p>
      </div>
      <a class="footer-cta-action" :href="ctaHref">
        <span>{{ ctaLabel }}</span>
        <span class="footer-arrow" aria-hidden="true">↗</span>
      </a>
    </section>
    <div class="footer-main">
      <div class="footer-brand">
        <a class="brand" :href="pageLink('')" aria-label="Brew Pilot">
          <img :src="logo" alt="Brew Pilot" width="196" height="48" />
        </a>
        <span class="footer-brand-note"><i aria-hidden="true"></i>{{ t('footer.status') }}</span>
        <p>{{ t('footer.tagline') }}</p>
      </div>
      <div class="footer-column">
        <h2><span>01</span>{{ t('footer.product') }}</h2>
        <a :href="pageLink('features')">{{ t('nav.product') }}</a>
        <a :href="pageLink('platform')">{{ t('nav.platform') }}</a>
      </div>
      <div class="footer-column">
        <h2><span>02</span>{{ t('footer.navigation') }}</h2>
        <a :href="pageLink('pricing')">{{ t('nav.pricing') }}</a>
        <a :href="`${pageLink('pricing')}#faq`">{{ t('common.faq') }}</a>
        <a :href="pageLink('about')">{{ t('footer.about') }}</a>
        <a :href="pageLink('contact')">{{ t('footer.support') }}</a>
      </div>
      <div class="footer-column">
        <h2><span>03</span>{{ t('footer.legal') }}</h2>
        <a :href="pageLink('privacy')">{{ t('footer.privacy') }}</a>
        <a :href="pageLink('cookies')">{{ t('footer.cookies') }}</a>
        <a :href="pageLink('terms')">{{ t('footer.terms') }}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} Brew Pilot</span>
      <div class="footer-languages" :aria-label="t('common.language')">
        <span v-for="language in languages" :key="language" :class="{ active: language === locale }">{{ localeLabels[language] }}</span>
      </div>
    </div>
  </footer>
</template>
