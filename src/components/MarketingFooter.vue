<script setup lang="ts">
import { computed } from 'vue'
import { mdiFacebook, mdiInstagram } from '@mdi/js'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localizedPath, localeLabels, type Locale } from '../types'
import { brewPilotApp } from '../utils/connector'
import logo from '../assets/logo-brew-right-full.png'

const route = useRoute()
const { t } = useI18n()
const locale = computed(() => route.meta.locale as Locale)
const slug = computed(() => (route.meta.slug as string | undefined) || '')
const pageLink = (page: string): string => localizedPath(locale.value, page)
const topicLink = (anchor: string): string => route.meta.kind === 'home' ? `#${anchor}` : `${pageLink('')}#${anchor}`
const ctaHref = computed(() => brewPilotApp.isConfigured ? brewPilotApp.url('register') : pageLink('features'))
const ctaLabel = computed(() => brewPilotApp.isConfigured ? t('nav.start') : t('footer.ctaAction'))
const languages: Locale[] = ['pt-BR', 'en-US', 'es']
const languageLink = (language: Locale): string => localizedPath(language, slug.value)
const productLink = (anchor?: string): string => `${pageLink('produto')}${anchor ? `#${anchor}` : ''}`
const docsUrl = import.meta.env.VITE_DOCS_URL
const discordIcon = faDiscord.icon[4] as string
const socialLinks = computed(() => [
  { label: 'Instagram', href: import.meta.env.VITE_INSTAGRAM_URL, icon: mdiInstagram, viewBox: '0 0 24 24' },
  { label: 'Facebook', href: import.meta.env.VITE_FACEBOOK_URL, icon: mdiFacebook, viewBox: '0 0 24 24' },
  { label: 'Discord', href: import.meta.env.VITE_DISCORD_URL, icon: discordIcon, viewBox: `0 0 ${faDiscord.icon[0]} ${faDiscord.icon[1]}` },
].filter((link): link is { label: string; href: string; icon: string; viewBox: string } => Boolean(link.href)))
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
        <div class="footer-signature">
          <p>{{ t('footer.eyebrow') }}</p>
          <h2>{{ t('footer.signature') }}</h2>
        </div>
        <nav v-if="socialLinks.length" class="footer-socials" aria-label="Redes sociais">
          <a v-for="link in socialLinks" :key="link.label" :href="link.href" :aria-label="link.label" target="_blank" rel="noopener noreferrer">
            <svg aria-hidden="true" :viewBox="link.viewBox"><path :d="link.icon" /></svg>
          </a>
        </nav>
      </div>
      <div class="footer-column">
        <h2><span>01</span>{{ t('footer.explore') }}</h2>
        <a :href="topicLink('processo')">{{ t('footer.howItWorks') }}</a>
        <a :href="topicLink('ferramentas')">{{ t('footer.modules') }}</a>
        <a :href="topicLink('precos')">{{ t('nav.pricing') }}</a>
        <a :href="topicLink('sobre')">{{ t('footer.about') }}</a>
      </div>
      <div class="footer-column">
        <h2><span>02</span>{{ t('footer.product') }}</h2>
        <a :href="productLink('feature-1')">{{ t('footer.recipes') }}</a>
        <a :href="productLink('feature-2')">{{ t('footer.batches') }}</a>
        <a :href="productLink('feature-3')">{{ t('footer.inventory') }}</a>
        <a :href="productLink('feature-4')">{{ t('footer.profiles') }}</a>
      </div>
      <div class="footer-column">
        <h2><span>03</span>{{ t('footer.support') }}</h2>
        <a v-if="docsUrl" :href="docsUrl" target="_blank" rel="noopener noreferrer">{{ t('footer.documentation') }} ↗</a>
        <a :href="topicLink('faq')">{{ t('common.faq') }}</a>
        <a :href="pageLink('contact')">{{ t('footer.support') }}</a>
        <a :href="pageLink('privacy')">{{ t('footer.privacy') }}</a>
        <a :href="pageLink('terms')">{{ t('footer.termsOfUse') }}</a>
        <a :href="pageLink('cookies')">{{ t('footer.cookies') }}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Brew Pilot. Todos os direitos reservados.</span>
      <div class="footer-languages" :aria-label="t('common.language')">
        <a v-for="language in languages" :key="language" :href="languageLink(language)" :class="{ active: language === locale }" :aria-current="language === locale ? 'page' : undefined">{{ localeLabels[language] }}</a>
      </div>
    </div>
  </footer>
</template>
