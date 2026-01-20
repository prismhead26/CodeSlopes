import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Welcome to CodeSlopes/i })).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Read Blog/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /About Me/i })).toBeVisible();
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Read Blog/i }).click();
    await expect(page).toHaveURL('/blog');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /About Me/i }).click();
    await expect(page).toHaveURL('/about');
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Tech Tutorials/i)).toBeVisible();
    await expect(page.getByText(/AI Integration/i)).toBeVisible();
    await expect(page.getByText(/Lifestyle/i)).toBeVisible();
  });
});
