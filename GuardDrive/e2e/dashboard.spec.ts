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

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows the vehicle selector', async ({ page }) => {
    await expect(page.locator('.db-dropdown__trigger')).toBeVisible();
  });

  test('shows the lock/unlock button', async ({ page }) => {
    await expect(page.locator('.db-lock__badge')).toBeVisible();
  });

  test('lock button toggles between Verrouille and Deverrouille', async ({ page }) => {
    const badge = page.locator('.db-lock__badge');
    const initialText = await badge.innerText();

    await badge.click();
    await page.waitForTimeout(1500);
    const newText = await badge.innerText();
    expect(newText).not.toBe(initialText);
  });

  test('shows gauge cards for fuel and battery', async ({ page }) => {
    const gauges = page.locator('.db-gauge-card');
    await expect(gauges).toHaveCount(2);
  });

  test('shows climate control section', async ({ page }) => {
    await expect(page.locator('.db-climate')).toBeVisible();
  });

  test('climate temperature step buttons work', async ({ page }) => {
    const tempDisplay = page.locator('.db-climate__temp-val');
    const initial = await tempDisplay.innerText();
    const plusBtn = page.locator('.db-climate__step').last();
    await plusBtn.click();
    const updated = await tempDisplay.innerText();
    expect(updated).not.toBe(initial);
  });

  test('shows alerts section with a See All button', async ({ page }) => {
    await expect(page.locator('.db-alerts')).toBeVisible();
    await expect(page.locator('.db-alerts__more')).toBeVisible();
  });

  test('See All button navigates to /alertes', async ({ page }) => {
    await page.locator('.db-alerts__more').click();
    await expect(page).toHaveURL('/alertes');
  });

  test('vehicle dropdown opens and lists vehicles', async ({ page }) => {
    await page.locator('.db-dropdown__trigger').click();
    await expect(page.locator('.db-dropdown__menu')).toBeVisible();
    const items = page.locator('.db-dropdown__item');
    await expect(items).toHaveCount(await items.count());
    expect(await items.count()).toBeGreaterThanOrEqual(1);
  });

  test('vehicle dropdown closes when clicking outside', async ({ page }) => {
    await page.locator('.db-dropdown__trigger').click();
    await expect(page.locator('.db-dropdown__menu')).toBeVisible();
    await page.locator('.db-page').click({ position: { x: 10, y: 10 }, force: true });
    await expect(page.locator('.db-dropdown__menu')).toBeHidden();
  });
});
