<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getLegalDocument, type LegalKind } from '../legalContent'
import { localeCode, localeFromPath, localizedPath } from '../types'
import { supportEmail } from '../utils/connector'
import logo from '../assets/logo-brew-right-full.png'

const route = useRoute()
const locale = computed(() => localeFromPath(route.path))
const kind = computed(() => (route.meta.kind as LegalKind) || 'privacy')
const document = computed(() => getLegalDocument(locale.value, kind.value))
const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://brewpilot.com').replace(/\/$/, '')
const contact = computed(() => import.meta.env.VITE_PRIVACY_EMAIL || supportEmail() || (locale.value === 'en-US' ? 'the privacy contact configured by Brew Pilot' : locale.value === 'es' ? 'el contacto de privacidad configurado por Brew Pilot' : 'o contato de privacidade configurado pelo Brew Pilot'))
const controller = computed(() => import.meta.env.VITE_LEGAL_CONTROLLER || (locale.value === 'en-US' ? 'the legal entity responsible for Brew Pilot' : locale.value === 'es' ? 'la entidad legal responsable de Brew Pilot' : 'a entidade responsável legalmente pelo Brew Pilot'))
const localizedHome = computed(() => localizedPath(locale.value))
const canonical = computed(() => `${siteUrl}${localizedPath(locale.value, kind.value)}`)
const alternateLinks = computed(() => [
  { hreflang: 'pt-BR', href: `${siteUrl}${localizedPath('pt-BR', kind.value)}` },
  { hreflang: 'en-US', href: `${siteUrl}${localizedPath('en-US', kind.value)}` },
  { hreflang: 'es', href: `${siteUrl}${localizedPath('es', kind.value)}` },
  { hreflang: 'x-default', href: `${siteUrl}${localizedPath('pt-BR', kind.value)}` },
])

const paragraphText = (paragraph: string): string => paragraph.replaceAll('{contact}', contact.value).replaceAll('{controller}', controller.value)

useHead(() => ({
  htmlAttrs: { lang: localeCode(locale.value) },
  title: `${document.value.title} | Brew Pilot`,
  meta: [
    { name: 'description', content: document.value.description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: `${document.value.title} | Brew Pilot` },
    { property: 'og:description', content: document.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonical.value },
    { property: 'og:image', content: `${siteUrl}${logo}` },
  ],
  link: [
    { rel: 'canonical' as const, href: canonical.value },
    ...alternateLinks.value.map((item) => ({ rel: 'alternate' as const, hreflang: item.hreflang, href: item.href })),
  ],
}))
</script>

<template>
  <main class="legal-page marketing-page">
    <section class="legal-hero page-wrap">
      <div class="legal-hero-copy">
        <a class="legal-back" :href="localizedHome">← {{ document.backLabel }}</a>
        <p class="eyebrow">{{ document.eyebrow }}</p>
        <h1>{{ document.title }}</h1>
        <p class="legal-updated">{{ document.updated }}</p>
      </div>
      <div class="legal-mark" aria-hidden="true"><span>BP</span><strong>{{ kind.toUpperCase() }}</strong></div>
    </section>

    <section class="legal-layout page-wrap">
      <aside class="legal-toc" :aria-label="document.contentsLabel">
        <p class="legal-toc-title">{{ document.contentsLabel }}</p>
        <a v-for="(section, index) in document.sections" :key="section.title" :href="`#legal-section-${index + 1}`"><span>0{{ index + 1 }}</span>{{ section.title }}</a>
      </aside>
      <article class="legal-document">
        <section v-for="(section, index) in document.sections" :id="`legal-section-${index + 1}`" :key="section.title" class="legal-section">
          <h2><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraphText(paragraph) }}</p>
        </section>
        <aside class="legal-note">
          <span class="legal-note-mark" aria-hidden="true">i</span>
          <div><h2>{{ document.noteTitle }}</h2><p>{{ document.noteBody }}</p></div>
        </aside>
      </article>
    </section>
  </main>
</template>
