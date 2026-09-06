<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { analyticsConsentKey, setAnalyticsConsent } from '../utils/analytics'

const { t } = useI18n()
const visible = ref(false)

const update = (): void => {
  visible.value = localStorage.getItem(analyticsConsentKey) === null
}

const accept = (): void => {
  setAnalyticsConsent('accepted')
  visible.value = false
}

const reject = (): void => {
  setAnalyticsConsent('rejected')
  visible.value = false
}

onMounted(() => {
  update()
  window.addEventListener('brew-consent-change', update)
})

onUnmounted(() => window.removeEventListener('brew-consent-change', update))
</script>

<template>
  <aside v-if="visible" class="consent-banner" :aria-label="t('common.privacyConsent')">
    <div>
      <strong>{{ t('consent.title') }}</strong>
      <p>{{ t('consent.body') }}</p>
    </div>
    <div class="consent-actions">
      <button type="button" class="text-button" @click="reject">{{ t('consent.reject') }}</button>
      <button type="button" class="button button-small" @click="accept">{{ t('consent.accept') }}</button>
    </div>
  </aside>
</template>
