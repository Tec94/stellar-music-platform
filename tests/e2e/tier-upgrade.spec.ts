import { test, expect } from '@playwright/test';

test.describe('Tier upgrade checkout', () => {
  test('upgrade to platinum tier via stripe', async ({ page }) => {
    await page.goto('/tiers');

    await expect(page.getByRole('heading', { name: /tiers/i })).toBeVisible();
    await page.getByRole('button', { name: /upgrade to platinum/i }).click();

    await expect(page).toHaveURL(/checkout/);
    await expect(page.frameLocator('iframe[name="stripe_checkout_app"]').getByText(/platinum membership/i)).toBeVisible();
    await page.frameLocator('iframe[name="stripe_checkout_app"]').getByLabel('Email').fill('member@example.com');
    await page.frameLocator('iframe[name="stripe_checkout_app"]').getByLabel('Card number').fill('4242424242424242');
    await page.frameLocator('iframe[name="stripe_checkout_app"]').getByLabel('Expiration').fill('1234');
    await page.frameLocator('iframe[name="stripe_checkout_app"]').getByLabel('CVC').fill('123');

    await page.frameLocator('iframe[name="stripe_checkout_app"]').getByRole('button', { name: /pay/i }).click();

    await expect(page).toHaveURL(/tiers\/success/);
    await expect(page.getByText(/you are now platinum/i)).toBeVisible();
  });

  test('shows eligibility requirement before upgrade', async ({ page }) => {
    await page.goto('/tiers');

    await expect(page.getByText(/complete 10 quests/i)).toBeVisible();
    await page.getByRole('button', { name: /view requirements/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByText(/quest milestones/i)).toBeVisible();
  });
});
