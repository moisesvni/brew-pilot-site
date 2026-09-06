<script setup lang="ts">
import { useRoute } from 'vue-router'
import MarketingHeader from './components/MarketingHeader.vue'
import MarketingFooter from './components/MarketingFooter.vue'
import ConsentBanner from './components/ConsentBanner.vue'

const route = useRoute()
</script>

<template>
  <div class="app-shell" :data-route="route.path">
    <MarketingHeader />
    <RouterView />
    <MarketingFooter />
    <ConsentBanner />
  </div>
</template>
