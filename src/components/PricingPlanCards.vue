<script setup lang="ts">
import type { UiCopy } from '../content'

defineProps<{ plans: UiCopy['pricingPlans'] }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <div class="pricing-plan-grid">
    <article v-for="(plan, index) in plans" :key="plan.key" class="pricing-plan" :class="[`pricing-plan--${plan.key}`, { 'pricing-plan--featured': plan.featured }]" :style="{ '--reveal-delay': `${index * 90}ms` }">
      <div class="pricing-plan-top"><span class="pricing-plan-marker">{{ plan.marker }}</span><span class="pricing-plan-index">0{{ index + 1 }}</span></div>
      <h3>{{ plan.name }}</h3>
      <p class="pricing-plan-description">{{ plan.description }}</p>
      <div class="pricing-plan-price"><strong>{{ plan.price }}</strong><span>{{ plan.cadence }}</span></div>
      <ul class="pricing-feature-list"><li v-for="feature in plan.features" :key="feature"><span aria-hidden="true">+</span>{{ feature }}</li></ul>
      <button class="button" type="button" @click="emit('select')">{{ plan.cta }}</button>
    </article>
  </div>
</template>
