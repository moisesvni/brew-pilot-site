import { ViteSSG } from 'vite-ssg'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import { localeFromPath, type Locale } from './types'
import { getUi } from './content'

const i18n = createI18n<any>({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': getUi('pt-BR'),
    'en-US': getUi('en-US'),
    es: getUi('es'),
  } as any,
})

export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ app, router: appRouter }) => {
  app.use(i18n)
  if (typeof window !== 'undefined') {
    window.history.scrollRestoration = 'manual'
    appRouter.isReady().then(() => {
      if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'auto' })
    })
  }
  appRouter.afterEach((to) => {
    ;(i18n.global as any).locale.value = localeFromPath(to.path) as Locale
  })
})
