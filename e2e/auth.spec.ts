import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display sign in page', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test('should display sign up page', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page.getByRole('heading', { name: /Create Account/i })).toBeVisible();
    await expect(page.getByLabel(/Display Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test('should navigate between sign in and sign up', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.getByRole('link', { name: /Sign up/i }).click();
    await expect(page).toHaveURL('/auth/signup');

    await page.getByRole('link', { name: /Sign in/i }).click();
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should show validation for empty fields', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // HTML5 validation should prevent form submission
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toHaveAttribute('required');
  });
});
