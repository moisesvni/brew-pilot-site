import { expect, test } from '@playwright/test'

const publicRoutes = ['/', '/produto', '/features', '/platform', '/pricing', '/about', '/contact', '/en', '/es']
const legalRoutes = ['/privacy', '/cookies', '/terms', '/en/privacy', '/es/privacy']
const legacyRoutes = ['/compare', '/tools']
const draftRoutes = ['/compare/brewfather', '/compare/beersmith', '/compare/brewers-friend']

test.describe('marketing routes', () => {
  for (const route of publicRoutes) {
    test(`${route} renders indexable HTML essentials`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page).toHaveTitle(/Brew Pilot|Produto|Preços|Comparar|Ferramentas|Sobre|Contato/)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/)
      await expect(page.locator('link[rel="alternate"][hreflang="en-US"]')).toHaveCount(1)
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1)
    })
  }

  for (const route of draftRoutes) {
    test(`${route} stays noindex`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
      await expect(page.locator('h1')).toHaveText('Comparativo em preparação.')
    })
  }

  for (const route of legacyRoutes) {
    test(`${route} stays out of public index`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
      await expect(page.locator('.desktop-nav')).not.toContainText(route === '/compare' ? 'Comparar' : 'Ferramentas')
    })
  }

  for (const route of legalRoutes) {
    test(`${route} renders the legal document`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      expect(await page.locator('.legal-section').count()).toBeGreaterThan(0)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/)
    })
  }
})

test.describe('marketing interactions', () => {
  test('product toolset exposes concrete Brew Pilot capabilities', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.toolset-grid article')).toHaveCount(6)
    await expect(page.locator('.toolset-grid')).toContainText('Receitas e formulação')
    await expect(page.locator('.toolset-grid')).toContainText('Estoque e custos')
  })

  test('mobile menu exposes the primary destinations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const mobileNav = page.locator('.mobile-panel nav')
    await expect(mobileNav).toContainText('Como funciona')
    await expect(mobileNav).toContainText('Módulos')
    await expect(mobileNav).toContainText('Produto')
    await expect(mobileNav).toContainText('Preços')
    await expect(mobileNav).toContainText('Sobre')
    await expect(page.getByRole('button', { name: 'Começar grátis' }).last()).toBeVisible()
  })

  test('language switch preserves the current page', async ({ page }) => {
    await page.goto('/pricing')
    await page.locator('.language-switcher').getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/pricing$/)
  })

  test('explore menu closes when the user clicks outside', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Explorar/ }).click()
    await expect(page.locator('.resource-menu')).toBeVisible()
    await page.locator('.hero').click({ position: { x: 20, y: 20 } })
    await expect(page.locator('.resource-menu')).toBeHidden()
  })

  test('pricing FAQ opens an answer', async ({ page }) => {
    await page.goto('/pricing')
    const question = page.getByText('Qual plano faz sentido para começar?')
    await question.click()
    await expect(question.locator('..')).toHaveAttribute('open', '')
  })

  test('pricing presents the configured plans and features', async ({ page }) => {
    await page.goto('/pricing')
    const plans = page.locator('.pricing-plan')
    await expect(plans).toHaveCount(3)
    await expect(plans.nth(0).locator('.pricing-feature-list li')).toHaveCount(6)
    await expect(plans.nth(1).locator('.pricing-feature-list li')).toHaveCount(6)
    await expect(plans.nth(2).locator('.pricing-feature-list li')).toHaveCount(7)
    await expect(plans.nth(0)).toContainText('R$ 0')
    await expect(plans.nth(1)).toContainText('R$ 19,90')
    await expect(plans.nth(2)).toContainText('R$ 39,90')
  })

  test('home keeps the primary story in one anchored page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.desktop-nav')).toHaveAttribute('aria-label', 'Navegação principal')
    await expect(page.getByRole('button', { name: /Explorar/ })).toBeVisible()
    await expect(page.locator('.desktop-nav > a').first()).toHaveAttribute('href', '/produto')
    await expect(page.locator('#faq .eyebrow')).toHaveText('FAQ')
    await expect(page.locator('.screenshot-placeholder')).toHaveCount(0)
    await expect(page.locator('.toolset-grid article')).toHaveCount(6)
    await expect(page.locator('.home-pricing .pricing-plan')).toHaveCount(3)
    expect(await page.locator('.home-pricing .pricing-plan').evaluateAll((plans) => plans.map((plan) => plan.querySelectorAll('.pricing-feature-list li').length))).toEqual([6, 6, 7])
    await expect(page.locator('#sobre')).toContainText('O sistema acompanha a cerveja')
  })

  test('home sections reveal when they enter the viewport', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('.cycle-section')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveClass(/is-visible/)
  })

  test('consent rejection removes the banner', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    const banner = page.getByRole('complementary', { name: 'Consentimento de privacidade' })
    await expect(banner).toBeVisible()
    await banner.getByRole('button', { name: 'Recusar' }).click()
    await expect(banner).toBeHidden()
  })

  test('footer exposes local legal pages', async ({ page }) => {
    await page.goto('/')
    const legal = page.locator('.footer-column').filter({ hasText: 'Suporte' })
    await expect(legal.getByRole('link', { name: 'Privacidade' })).toHaveAttribute('href', '/privacy')
    await expect(legal.getByRole('link', { name: 'Cookies' })).toHaveAttribute('href', '/cookies')
    await expect(legal.getByRole('link', { name: 'Termos de uso' })).toHaveAttribute('href', '/terms')
  })
})
