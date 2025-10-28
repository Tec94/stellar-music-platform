import { test, expect } from '@playwright/test';

test.describe('User onboarding flow', () => {
  test('complete registration and setup profile', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/register/);

    await page.getByLabel('Email').fill('newuser@example.com');
    await page.getByLabel('Password').fill('SecurePass123');
    await page.getByLabel('Confirm Password').fill('SecurePass123');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

    await page.getByLabel('Username').fill('adventurer');
    await page.getByLabel('Bio').fill('Ready to explore');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('adventurer')).toBeVisible();
  });

  test('validates registration inputs', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('weak');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
    await expect(page.getByText(/8 characters/i)).toBeVisible();
  });

  test('navigates through onboarding tutorial', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('button', { name: /start tutorial/i }).click();

    for (let step = 1; step <= 4; step += 1) {
      await expect(page.getByText(new RegExp(`step ${step}`, 'i'))).toBeVisible();
      await page.getByRole('button', { name: /next/i }).click();
    }

    await expect(page.getByRole('button', { name: /finish/i })).toBeVisible();
    await page.getByRole('button', { name: /finish/i }).click();

    await expect(page.getByText(/tutorial complete/i)).toBeVisible();
  });
});
