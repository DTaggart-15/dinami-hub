import { expect, test } from '@playwright/test';

for (const width of [360, 390, 768, 1280, 1440]) {
  test(`fits ${width}px without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('uses editorial photo notes on desktop and compact notes on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await expect(page.locator('.portrait-notes')).toBeVisible();
  await expect(page.locator('.portrait-notes')).toHaveCSS('position', 'absolute');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.portrait-notes')).toHaveCSS('position', 'static');
});
