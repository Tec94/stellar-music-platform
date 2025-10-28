import { test, expect } from '@playwright/test';

test.describe('Real-time chat messaging', () => {
  test('send and receive messages', async ({ page, browser }) => {
    await page.goto('/chat');
    await expect(page.getByText(/global chat/i)).toBeVisible();

    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    await secondPage.goto('/chat');

    await page.getByLabel('Message').fill('Hello from player one');
    await page.getByRole('button', { name: /send/i }).click();

    await expect(page.getByText('Hello from player one')).toBeVisible();
    await expect(secondPage.getByText('Hello from player one')).toBeVisible();

    await secondPage.getByLabel('Message').fill('Hello back from player two');
    await secondPage.getByRole('button', { name: /send/i }).click();

    await expect(page.getByText('Hello back from player two')).toBeVisible();
    await expect(secondPage.getByText('Hello back from player two')).toBeVisible();

    await secondContext.close();
  });

  test('handles connection drop gracefully', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.getByText(/connected/i)).toBeVisible();

    await page.getByRole('button', { name: /simulate disconnect/i }).click();
    await expect(page.getByText(/reconnecting/i)).toBeVisible();

    await page.getByRole('button', { name: /restore connection/i }).click();
    await expect(page.getByText(/connected/i)).toBeVisible();
  });
});
