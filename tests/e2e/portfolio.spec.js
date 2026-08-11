import { expect, test } from '@playwright/test';

test('starts in Russian and remembers English without scrolling', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await page.locator('#work').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);

  await page.getByRole('button', { name: 'EN', exact: true }).click();

  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I turn ideas');
});

test('opens live work safely and internal work in a dialog', async ({ page }) => {
  await page.goto('/');
  const live = page.getByRole('link', { name: /Follower Forecast/i });
  await expect(live).toHaveAttribute('target', '_blank');
  await expect(live).toHaveAttribute('rel', /noopener/);

  const internal = page.getByRole('button', { name: /AI Content OS/i });
  await internal.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute(
    'src',
    '/media/content-factory-output.png',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(internal).toBeFocused();
});

test('copies the Discord handle through the contact control', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__copiedContact = value;
        },
      },
    });
  });
  await page.goto('/');

  await page.locator('[data-contact="discord"]').click();

  await expect.poll(() => page.evaluate(() => window.__copiedContact)).toBe('0xDinami');
  await expect(page.getByRole('status')).toHaveText('Скопировано');
});
