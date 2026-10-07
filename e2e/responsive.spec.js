import { test, expect } from '@playwright/test';

const SECTION_IDS = ['top', 'about', 'work', 'services', 'process', 'testimonials', 'contact'];
const MD_BREAKPOINT = 768;

const isNarrow = page => page.viewportSize().width < MD_BREAKPOINT;

// Scroll through the page so scroll-triggered animations and lazy content render.
async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
  });
}

async function expectNoHorizontalOverflow(page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, 'page should not scroll horizontally').toBeLessThanOrEqual(innerWidth);
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.errors = errors;
  await page.goto('/');
});

test('renders without runtime errors', async ({ page }) => {
  await scrollThrough(page);
  expect(page.errors).toEqual([]);
});

test('has every section anchor', async ({ page }) => {
  for (const id of SECTION_IDS) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('hero heading is visible above the fold', async ({ page }) => {
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  const box = await heading.boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
});

test('does not overflow horizontally at load or after scrolling', async ({ page }) => {
  await expectNoHorizontalOverflow(page);
  await scrollThrough(page);
  await expectNoHorizontalOverflow(page);
});

test('navigation adapts to the viewport', async ({ page }) => {
  const gooeyNav = page.locator('.gooey-nav-container');
  if (isNarrow(page)) {
    await expect(gooeyNav).toBeHidden();
    await expect(page.locator('a[href="#contact"]').first()).toBeVisible();
  } else {
    await expect(gooeyNav).toBeVisible();
    await expect(gooeyNav.getByRole('link', { name: 'Work' })).toBeVisible();
  }
});

test('navbar stays pinned while scrolling', async ({ page }) => {
  const logo = page.locator('a[href="#top"]').first();
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(logo).toBeInViewport();
});

test('work cards fit within the viewport', async ({ page }) => {
  await page.locator('#work').scrollIntoViewIfNeeded();
  const images = page.locator('#work img');
  await expect(images).toHaveCount(6);
  const width = page.viewportSize().width;
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    const box = await img.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
});

test('contact email link is reachable and tappable', async ({ page }) => {
  const mail = page.locator('#contact a[href^="mailto:"]');
  await mail.scrollIntoViewIfNeeded();
  await expect(mail).toBeVisible();
  const box = await mail.boundingBox();
  expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);
});

test('in-page navigation scrolls to the section', async ({ page }) => {
  await page.locator('a[href="#contact"]').first().click();
  await expect(page.locator('#contact')).toBeInViewport();
});
