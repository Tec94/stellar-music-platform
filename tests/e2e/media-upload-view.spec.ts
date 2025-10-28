import { test, expect } from '@playwright/test';

test.describe('Media upload and viewing', () => {
  test('upload and view photo', async ({ page }) => {
    await page.goto('/media');

    await page.getByRole('button', { name: /upload media/i }).click();
    await page.setInputFiles('input[type="file"]', {
      name: 'adventure.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content')
    });

    await expect(page.getByText(/uploading/i)).toBeVisible();
    await expect(page.getByText(/upload complete/i)).toBeVisible({ timeout: 10000 });

    await page.reload();
    await expect(page.getByRole('img', { name: /adventure/i })).toBeVisible();
  });

  test('view uploaded media in gallery', async ({ page }) => {
    await page.goto('/gallery');

    await expect(page.getByRole('img').first()).toBeVisible();
    await page.getByRole('img').first().click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('[data-testid="lightbox-image"]')).toBeVisible();

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-testid="lightbox-image"]')).toHaveAttribute('src', /.*\.(jpg|png)/);
  });

  test('apply filters to media gallery', async ({ page }) => {
    await page.goto('/gallery');

    await page.getByRole('combobox', { name: /filter/i }).click();
    await page.getByRole('option', { name: /videos only/i }).click();

    await expect(page.getByRole('article', { name: /video/i })).toBeVisible();
    const images = page.getByRole('img');
    await expect(images).toHaveCount(0);
  });
});
