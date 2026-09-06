<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getPageCopy } from '../content'
import { localeFromPath, localizedPath, type Locale } from '../types'

const route = useRoute()
const locale = localeFromPath(route.path)
const copy = getPageCopy(locale, 'not-found')
</script>

<template>
  <main class="not-found page-wrap">
    <p class="eyebrow">{{ copy.meta.eyebrow }}</p>
    <h1>{{ copy.meta.heading }}</h1>
    <p class="lead">{{ copy.intro }}</p>
    <a class="button" :href="localizedPath(locale as Locale)">{{ copy.cta }}</a>
  </main>
</template>
