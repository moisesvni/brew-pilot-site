export type MarketingEvent =
  | 'landing_view'
  | 'hero_demo_click'
  | 'pricing_view'
  | 'pricing_app_click'
  | 'compare_view'
  | 'login_click'

export interface MarketingEventParams {
  locale?: string
  page_path?: string
  section?: string
  feature_id?: string
}

const consentKey = 'brew_privacy_consent_v1'
let analyticsLoaded = false

const loadAnalytics = (): void => {
  if (analyticsLoaded || typeof document === 'undefined') return
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!measurementId) return
  window.dataLayer = window.dataLayer || []
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
  window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer?.push(args as unknown as Record<string, unknown>) }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
  analyticsLoaded = true
}

export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(consentKey) === 'accepted'
}

export const setAnalyticsConsent = (value: 'accepted' | 'rejected'): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(consentKey, value)
  if (value === 'accepted') loadAnalytics()
  window.dispatchEvent(new CustomEvent('brew-consent-change', { detail: { value } }))
}

export const analyticsConsentKey = consentKey

export const trackMarketingEvent = (event: MarketingEvent, params: MarketingEventParams = {}): void => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!measurementId) return
  loadAnalytics()
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}
