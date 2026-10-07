import { test, expect } from '@playwright/test';

const LG_BREAKPOINT = 1024;
const MD_BREAKPOINT = 768;

const about = page => page.locator('#about');
const portrait = page => about(page).getByRole('figure').getByRole('img');
const statCards = page => about(page).locator('dl > div');
const width = page => page.viewportSize().width;

// Distinct rounded values, e.g. how many columns/rows a set of boxes occupies.
const distinct = values => new Set(values.map(v => Math.round(v))).size;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('about has one h2 and a sensible heading outline', async ({ page }) => {
  await expect(about(page).getByRole('heading', { level: 1 })).toHaveCount(0);
  await expect(about(page).getByRole('heading', { level: 2 })).toHaveCount(1);
  await expect(about(page).getByRole('heading', { level: 3, name: 'How I cut' })).toBeVisible();
  await expect(about(page).getByRole('heading', { level: 4 })).toHaveCount(4);
});

test('portrait is lazy and reserves its space before loading', async ({ page }) => {
  const img = portrait(page);
  await expect(img).toHaveAttribute('loading', 'lazy');
  // Off-screen and not yet loaded, the box already has its final aspect ratio.
  const before = await img.boundingBox();
  expect(before.height).toBeGreaterThan(100);

  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  const after = await img.boundingBox();
  expect(Math.abs(after.height - before.height)).toBeLessThan(1);
});

test('portrait sits beside the copy on large screens and stacks above it otherwise', async ({ page }) => {
  const img = await portrait(page).boundingBox();
  const platformsRow = await about(page).getByRole('list', { name: 'Platforms I edit for' }).boundingBox();
  if (width(page) >= LG_BREAKPOINT) {
    expect(platformsRow.x).toBeGreaterThan(img.x + img.width);
  } else {
    expect(platformsRow.y).toBeGreaterThan(img.y + img.height);
  }
});

test('stats form a balanced grid: 2 columns on phones, 4 on wider screens', async ({ page }) => {
  const cards = statCards(page);
  await expect(cards).toHaveCount(4);
  const boxes = await Promise.all((await cards.all()).map(card => card.boundingBox()));
  const columns = width(page) >= MD_BREAKPOINT ? 4 : 2;
  expect(distinct(boxes.map(b => b.x))).toBe(columns);
  expect(distinct(boxes.map(b => b.y))).toBe(4 / columns);
  // Equal-height cards in each row.
  expect(distinct(boxes.map(b => b.height))).toBe(1);
});

test('stats count up to their final values once scrolled into view', async ({ page }) => {
  const dl = about(page).locator('dl');
  await dl.scrollIntoViewIfNeeded();
  const first = statCards(page).first().locator('dd [aria-hidden="true"]');
  const accessible = (await statCards(page).first().locator('dd .sr-only').textContent()).trim();
  await expect(first).toHaveText(accessible, { timeout: 6000 });
});

test('stats show final values immediately with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const cards = await statCards(page).all();
  for (const card of cards) {
    const accessible = (await card.locator('dd .sr-only').textContent()).trim();
    await expect(card.locator('dd [aria-hidden="true"]')).toHaveText(accessible, { timeout: 500 });
  }
});

test('about content stays inside the viewport', async ({ page }) => {
  await about(page).scrollIntoViewIfNeeded();
  const overflow = await about(page).evaluate(section =>
    [...section.querySelectorAll('img, li, dl > div, p')]
      .map(el => el.getBoundingClientRect())
      .filter(r => r.width > 0 && (r.left < -0.5 || r.right > window.innerWidth + 0.5)).length,
  );
  expect(overflow).toBe(0);
});
