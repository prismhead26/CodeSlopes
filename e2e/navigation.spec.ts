import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CodeSlopes/i);
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Blog');
    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/');

    // Check logo link
    const logo = page.getByText('CopeSlopes').first();
    await expect(logo).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('should have working footer', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check copyright text
    const currentYear = new Date().getFullYear();
    await expect(footer).toContainText(currentYear.toString());
  });
});
