import { test, expect } from '@playwright/test';

const SECTION_IDS = ['top', 'about', 'work', 'craft', 'services', 'pricing', 'process', 'testimonials', 'faq', 'contact'];
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

test('navbar is translucent', async ({ page }) => {
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();
  const { background, backdrop } = await header.evaluate(el => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, backdrop: style.backdropFilter || style.webkitBackdropFilter };
  });
  const alpha = background.startsWith('rgba') || background.includes('/') ? parseFloat(background.split(/[,/]/).pop()) : 1;
  expect(alpha, 'background should be semi-transparent').toBeLessThan(1);
  expect(backdrop).toContain('blur');
});

test('navigation adapts to the viewport', async ({ page }) => {
  const header = page.getByRole('banner');
  const menuButton = page.getByRole('button', { name: /menu/i });
  await expect(header.getByRole('link', { name: 'Work', exact: true })).toBeVisible();
  if (isNarrow(page)) {
    await expect(menuButton).toBeHidden();
  } else {
    // Desktop renders the GooeyNav <nav> landmark.
    await expect(header.getByRole('navigation')).toBeVisible();
  }
});

test('mobile navbar collapses into a hamburger after swiping up', async ({ page }) => {
  test.skip(!isNarrow(page), 'mobile-only behaviour');
  const header = page.getByRole('banner');
  const menuButton = page.getByRole('button', { name: /menu/i });

  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(menuButton).toBeVisible();
  await expect(header.getByRole('link', { name: 'Work', exact: true })).toBeHidden();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  const menu = page.getByRole('dialog');
  await expect(menu).toBeVisible();

  await menu.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#contact')).toBeInViewport();

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(menuButton).toBeHidden();
  await expect(header.getByRole('link', { name: 'Work', exact: true })).toBeVisible();
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
