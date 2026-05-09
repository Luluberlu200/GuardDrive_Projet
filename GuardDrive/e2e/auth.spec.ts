import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects root to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('shows login form with email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('submit button is disabled when fields are empty', async ({ page }) => {
    await page.goto('/login');
    const submit = page.locator('button[type="submit"]');
    await expect(submit).toBeDisabled();
  });

  test('shows error on invalid email format', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'not-an-email');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('.auth-form__error')).toContainText('email');
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('.auth-form__error')).toContainText('Identifiants invalides');
  });

  test('password toggle shows and hides password', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.locator('#password');
    const toggleBtn = page.locator('.auth-form__toggle');

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('link to register page is visible', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL('/register');
  });

});
