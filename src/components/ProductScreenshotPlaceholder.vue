<script setup lang="ts">
import type { ScreenshotProps } from '../types'

withDefaults(defineProps<ScreenshotProps>(), { ratio: '16 / 10', tone: 'wide' })
</script>

<template>
  <figure class="screenshot-placeholder" :class="`placeholder-${tone}`" :data-screenshot-id="id">
    <div class="placeholder-grid" aria-hidden="true"></div>
    <figcaption class="placeholder-copy">
      <span class="placeholder-mark" aria-hidden="true">BP</span>
      <span class="placeholder-label">{{ label }}</span>
      <small>{{ id }}</small>
    </figcaption>
  </figure>
</template>
