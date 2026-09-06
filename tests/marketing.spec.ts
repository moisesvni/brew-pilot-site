import { expect, test } from '@playwright/test'

const publicRoutes = ['/', '/features', '/pricing', '/compare', '/tools', '/about', '/contact', '/en', '/es']
const legalRoutes = ['/privacy', '/cookies', '/terms', '/en/privacy', '/es/privacy']
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
  test('bento accent card keeps readable text', async ({ page }) => {
    await page.goto('/')
    const paragraph = page.locator('.bento-accent p')
    await expect(paragraph).toHaveCSS('color', 'rgb(21, 23, 25)')
  })

  test('mobile menu exposes the primary destinations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.getByRole('navigation').last()).toContainText('Produto')
    await expect(page.getByRole('navigation').last()).toContainText('Preços')
    await expect(page.getByRole('button', { name: 'Começar grátis' }).last()).toBeVisible()
  })

  test('language switch preserves the current page', async ({ page }) => {
    await page.goto('/pricing')
    await page.getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/pricing$/)
  })

  test('pricing FAQ opens an answer', async ({ page }) => {
    await page.goto('/pricing')
    const question = page.getByText('Qual plano faz sentido para começar?')
    await question.click()
    await expect(question.locator('..')).toHaveAttribute('open', '')
  })

  test('pricing presents three plans with six features each', async ({ page }) => {
    await page.goto('/pricing')
    const plans = page.locator('.pricing-plan')
    await expect(plans).toHaveCount(3)
    await expect(plans.nth(0).locator('.pricing-feature-list li')).toHaveCount(6)
    await expect(plans.nth(1).locator('.pricing-feature-list li')).toHaveCount(6)
    await expect(plans.nth(2).locator('.pricing-feature-list li')).toHaveCount(6)
    await expect(plans.nth(0)).toContainText('R$ 0')
    await expect(plans.nth(1)).toContainText('R$ 9')
    await expect(plans.nth(2)).toContainText('R$ 19')
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
    const legal = page.locator('.footer-column').filter({ hasText: 'Legal' })
    await expect(legal.getByRole('link', { name: 'Privacidade' })).toHaveAttribute('href', '/privacy')
    await expect(legal.getByRole('link', { name: 'Cookies' })).toHaveAttribute('href', '/cookies')
    await expect(legal.getByRole('link', { name: 'Termos' })).toHaveAttribute('href', '/terms')
  })
})
