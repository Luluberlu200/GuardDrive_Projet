import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL ?? 'test@guarddrive.fr';
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'password123';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard', { timeout: 10_000 });
}

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('can reach /alertes', async ({ page }) => {
    await page.goto('/alertes');
    await expect(page).toHaveURL('/alertes');
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('can reach /localisation', async ({ page }) => {
    await page.goto('/localisation');
    await expect(page).toHaveURL('/localisation');
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('can reach /etat-vehicule', async ({ page }) => {
    await page.goto('/etat-vehicule');
    await expect(page).toHaveURL('/etat-vehicule');
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('can reach /settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL('/settings');
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('unknown route redirects to /login', async ({ page }) => {
    await page.goto('/unknown-page-xyz');
    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });
});

test.describe('Alerts page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/alertes');
  });

  test('shows alert list or empty state', async ({ page }) => {
    await page.locator('.al-skeletons').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
    const hasList = await page.locator('.al-list').isVisible().catch(() => false);
    const hasEmpty = await page.locator('.al-empty').isVisible().catch(() => false);
    expect(hasList || hasEmpty).toBe(true);
  });

  test('alert filter buttons are visible', async ({ page }) => {
    await expect(page.locator('.al-filters')).toBeVisible();
  });
});

test.describe('Etat Vehicule page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/etat-vehicule');
  });

  test('shows vehicle identity section', async ({ page }) => {
    const cards = page.locator('.ev-card');
    await expect(cards.first()).toBeVisible();
  });

  test('shows tire map section', async ({ page }) => {
    await expect(page.locator('.ev-tire-map')).toBeVisible();
    const tireCards = page.locator('.ev-tire-card');
    await expect(tireCards).toHaveCount(4);
  });

  test('shows documents section', async ({ page }) => {
    await expect(page.locator('.ev-docs')).toBeVisible();
  });
});
