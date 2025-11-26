// tests/my-first-test.spec.ts
import { test, expect } from '@playwright/test';

test('has a correct title', async ({ page }) => {
  // 1. Navigate to the page
  await page.goto('https://playwright.dev/');

  // 2. Create a locator for the title
  const title = page.locator('.navbar__inner .navbar__title');

  // 3. Assert that the title is what we expect
  await expect(title).toHaveText('Playwright');
});