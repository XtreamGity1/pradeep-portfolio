import { test, expect } from '@playwright/test';

const TAP_TARGET = 44;

const hero = page => page.locator('#top');
const showreelButton = page => hero(page).getByRole('button', { name: /watch my reel/i });
const dialog = page => page.getByRole('dialog', { name: /showreel/i });

// Is the focused element inside the showreel dialog?
const focusInDialog = page =>
  page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')));

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('all three hero CTAs are visible, tappable and fit the viewport', async ({ page }) => {
  const width = page.viewportSize().width;
  const ctas = [
    showreelButton(page),
    hero(page).getByRole('link', { name: 'View my work' }),
    hero(page).getByRole('link', { name: 'Get in touch' }),
  ];
  for (const cta of ctas) {
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(TAP_TARGET);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
});

test('the existing CTAs still navigate', async ({ page }) => {
  await hero(page).getByRole('link', { name: 'View my work' }).click();
  await expect(page.locator('#work')).toBeInViewport();
});

test('showreel opens a modal player that fits the screen', async ({ page }) => {
  await showreelButton(page).click();
  const modal = dialog(page);
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAttribute('aria-modal', 'true');
  await expect(modal.getByRole('button', { name: /close/i })).toBeFocused();

  // Poll: the panel scales in, so the button is briefly smaller than its final size.
  const close = modal.getByRole('button', { name: /close/i });
  await expect.poll(async () => (await close.boundingBox()).height).toBeGreaterThanOrEqual(TAP_TARGET);
  await expect.poll(async () => (await close.boundingBox()).width).toBeGreaterThanOrEqual(TAP_TARGET);

  // Measured once the entrance has settled (opacity 1 = animation done).
  await expect.poll(() => modal.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  const video = modal.locator('video');
  await expect(video).toHaveAttribute('src', /\.mp4$/);
  const { width, height } = page.viewportSize();
  const box = await video.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  expect(box.y + box.height).toBeLessThanOrEqual(height);
});

test('showreel traps focus and locks page scroll', async ({ page }) => {
  await showreelButton(page).click();
  await expect(dialog(page)).toBeVisible();

  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await focusInDialog(page)).toBe(true);
  }
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab');
    expect(await focusInDialog(page)).toBe(true);
  }

  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('Escape closes the showreel, stops playback and restores focus', async ({ page }) => {
  await showreelButton(page).click();
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toBeHidden();
  await expect(page.locator('video')).toHaveCount(0);
  await expect(showreelButton(page)).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('the close button and the backdrop both close the showreel', async ({ page }) => {
  await showreelButton(page).click();
  await dialog(page).getByRole('button', { name: /close/i }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(showreelButton(page)).toBeFocused();

  await showreelButton(page).click();
  await expect(dialog(page)).toBeVisible();
  // Top-left corner is always backdrop, never the player.
  await page.mouse.click(4, 4);
  await expect(dialog(page)).toBeHidden();
});

test('opens instantly and keeps the marquee still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();

  const marquee = page.getByRole('region', { name: /formats and skills/i });
  await marquee.scrollIntoViewIfNeeded();
  const row = marquee.locator('[aria-hidden="true"] .scroller').first();
  const before = await row.evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(400);
  expect(await row.evaluate(el => getComputedStyle(el).transform)).toBe(before);

  await page.evaluate(() => window.scrollTo(0, 0));
  await showreelButton(page).click();
  await expect(dialog(page)).toBeVisible();
  expect(await dialog(page).evaluate(el => getComputedStyle(el).opacity)).toBe('1');
});

test('the marquee animates and never overflows the page', async ({ page }) => {
  const marquee = page.getByRole('region', { name: /formats and skills/i });
  await marquee.scrollIntoViewIfNeeded();
  const row = marquee.locator('[aria-hidden="true"] .scroller').first();
  const before = await row.evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(400);
  expect(await row.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);

  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
});
