import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    // Find the theme toggle button
    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const htmlElement = page.locator('html');
    const initialHasD arkClass = await htmlElement.evaluate((el) =>
      el.classList.contains('dark')
    );

    // Click toggle
    await themeToggle.click();

    // Wait for theme change
    await page.waitForTimeout(100);

    // Check theme changed
    const afterClickHasDarkClass = await htmlElement.evaluate((el) =>
      el.classList.contains('dark')
    );

    expect(afterClickHasDarkClass).toBe(!initialHasDarkClass);
  });

  test('should persist theme preference', async ({ page, context }) => {
    // Toggle theme
    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await themeToggle.click();

    // Get current theme
    const htmlElement = page.locator('html');
    const hasDarkClass = await htmlElement.evaluate((el) =>
      el.classList.contains('dark')
    );

    // Reload page
    await page.reload();

    // Check theme persisted
    const afterReloadHasDarkClass = await htmlElement.evaluate((el) =>
      el.classList.contains('dark')
    );

    expect(afterReloadHasDarkClass).toBe(hasDarkClass);
  });
});
