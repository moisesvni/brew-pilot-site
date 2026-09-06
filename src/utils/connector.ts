import { appUrlFromEnv } from '../types'

export type AppDestination = 'login' | 'register' | 'plans' | 'privacy' | 'cookies' | 'terms'

const paths: Record<AppDestination, string> = {
  login: 'login',
  register: 'register',
  plans: 'account/plan',
  privacy: 'privacy',
  cookies: 'cookies',
  terms: 'terms',
}

export class BrewPilotAppConnector {
  readonly origin: string

  constructor(origin = appUrlFromEnv()) {
    this.origin = origin
  }

  get isConfigured(): boolean {
    return Boolean(this.origin)
  }

  url(destination: AppDestination): string {
    if (!this.origin) return ''
    return `${this.origin}/#/${paths[destination]}`
  }
}

export const brewPilotApp = new BrewPilotAppConnector()

export const supportEmail = (): string => import.meta.env.VITE_SUPPORT_EMAIL || ''
