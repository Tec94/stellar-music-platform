import { test, expect } from '@playwright/test';

test.describe('Cross-browser UI validation', () => {
  test('renders dashboard consistently', async ({ page, browserName }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(`dashboard-${browserName}.png`);
  });

  test('handles responsive breakpoints', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('navigation')).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('button', { name: /menu/i })).not.toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('supports touch interactions', async ({ page, browserName }) => {
    test.skip(browserName === 'chromium', 'Testing mobile browsers only');

    await page.goto('/quests');

    const card = page.locator('[data-testid^="quest-card"]').first();
    await card.tap();

    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('handles orientation changes', async ({ page }) => {
    await page.goto('/dashboard');

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});
