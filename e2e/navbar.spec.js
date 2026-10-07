import { test, expect } from '@playwright/test';
import { navCta, navItems, profile } from '../src/data.js';

const MD_BREAKPOINT = 768;
const isNarrow = page => page.viewportSize().width < MD_BREAKPOINT;
const desktopItems = navItems.filter(item => item.href !== navCta.href);

// Wait until the page stops scrolling (smooth scroll after an anchor click).
async function waitForScrollEnd(page) {
  await page.waitForFunction(
    () =>
      new Promise(resolve => {
        let last = window.scrollY;
        setTimeout(() => resolve(window.scrollY === last), 150);
      }),
  );
}

async function openMenu(page) {
  await page.evaluate(() => window.scrollTo(0, 600));
  const button = page.getByRole('button', { name: 'Open menu' });
  await button.click();
  const menu = page.getByRole('dialog', { name: 'Site menu' });
  await expect(menu).toBeVisible();
  return { button, menu };
}

// The link for `item` in whatever nav the current viewport shows.
async function navLink(page, item) {
  if (isNarrow(page)) {
    const { menu } = await openMenu(page);
    return menu.getByRole('link', { name: item.label, exact: true });
  }
  return page.getByRole('banner').getByRole('link', { name: item.label, exact: true });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('skip link', () => {
  test('is the first tab stop, appears on focus and jumps into main', async ({ page }) => {
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.closest('main') !== null)).toBe(true);
  });

  test('stays off-screen until focused', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Skip to content' })).not.toBeInViewport();
  });
});

test.describe('header layout', () => {
  test('shows every link on one row without overflowing, with 44px tap targets', async ({ page }) => {
    const header = page.getByRole('banner');
    const visible = isNarrow(page) ? navItems.filter(item => item.compact) : [...desktopItems, navCta];
    const width = page.viewportSize().width;
    const centers = [];
    for (const item of visible) {
      const link = header.getByRole('link', { name: item.label, exact: true });
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      expect(box.x, `${item.label} starts on screen`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${item.label} ends on screen`).toBeLessThanOrEqual(width);
      expect(box.height, `${item.label} tap target`).toBeGreaterThanOrEqual(44);
      centers.push(box.y + box.height / 2);
    }
    expect(Math.max(...centers) - Math.min(...centers), 'links share one row').toBeLessThan(4);
    const headerBox = await header.boundingBox();
    expect(headerBox.height).toBeLessThanOrEqual(80);
  });
});

test.describe('anchors', () => {
  test('nav links land each section below the fixed header', async ({ page }) => {
    for (const item of navItems.filter(item => item.href !== '#contact')) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await (await navLink(page, item)).click();
      await waitForScrollEnd(page);
      await expect(page.locator(item.href)).toBeInViewport();
      // On phones the bar collapses to a floating button; on larger screens the header stays solid.
      const headerBottom = isNarrow(page)
        ? 0
        : await page.getByRole('banner').evaluate(el => el.getBoundingClientRect().bottom);
      const sectionTop = await page.locator(item.href).evaluate(el => el.getBoundingClientRect().top);
      expect(sectionTop, `${item.label} section starts below the header`).toBeGreaterThanOrEqual(headerBottom - 1);
    }
  });
});

test.describe('scrollspy', () => {
  test('marks the nav link for the section in view as the current location', async ({ page }) => {
    await page.locator('#pricing').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    const pricing = navItems.find(item => item.href === '#pricing');
    await expect(await navLink(page, pricing)).toHaveAttribute('aria-current', 'location');
    if (isNarrow(page)) await page.keyboard.press('Escape');

    await page.locator('#faq').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    const faq = navItems.find(item => item.href === '#faq');
    const link = await navLink(page, faq);
    await expect(link).toHaveAttribute('aria-current', 'location');
    const scope = isNarrow(page) ? page.getByRole('dialog') : page.getByRole('banner');
    await expect(scope.locator('[aria-current="location"]')).toHaveCount(1);
  });

  test('clears at the top of the page', async ({ page }) => {
    await page.locator('#work').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.getByRole('banner').getByRole('link', { name: 'Work', exact: true })).not.toHaveAttribute(
      'aria-current',
      'location',
    );
  });
});

test.describe('mobile menu', () => {
  test.beforeEach(({ page }) => {
    test.skip(!isNarrow(page), 'mobile-only behaviour');
  });

  test('every menu link reaches its section and closes the menu', async ({ page }) => {
    for (const item of navItems) {
      const { menu } = await openMenu(page);
      await menu.getByRole('link', { name: item.label, exact: true }).click();
      await expect(menu).toBeHidden();
      await waitForScrollEnd(page);
      await expect(page.locator(item.href)).toBeInViewport();
    }
  });

  test('menu links are large tap targets', async ({ page }) => {
    const { menu } = await openMenu(page);
    for (const link of await menu.getByRole('link').all()) {
      const box = await link.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('traps focus, closes on Escape and returns focus to the toggle', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 600));
    const button = page.getByRole('button', { name: 'Open menu' });
    await button.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu.getByRole('link', { name: navItems[0].label, exact: true })).toBeFocused();

    for (let i = 0; i < navItems.length + 2; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(
        () => !!document.activeElement.closest('[role="dialog"]') || document.activeElement.matches('[aria-controls]'),
      );
      expect(inside, 'focus stays in the menu').toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  });
});

test.describe('motion', () => {
  test('scrolls smoothly only when motion is allowed', async ({ page }) => {
    const scrollBehavior = () => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(await scrollBehavior()).toBe('smooth');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await scrollBehavior()).toBe('auto');
  });

  test('reduced motion stops CSS animations and skips nav particles', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const duration = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.animation = 'spin 2s linear infinite';
      probe.style.transition = 'opacity 2s';
      document.body.append(probe);
      const style = getComputedStyle(probe);
      const result = { animation: parseFloat(style.animationDuration), transition: parseFloat(style.transitionDuration) };
      probe.remove();
      return result;
    });
    expect(duration.animation).toBeLessThan(0.01);
    expect(duration.transition).toBeLessThan(0.01);

    test.skip(isNarrow(page), 'GooeyNav is desktop-only');
    await page.getByRole('banner').getByRole('link', { name: 'Pricing', exact: true }).click();
    await page.waitForTimeout(100);
    await expect(page.locator('header .particle')).toHaveCount(0);
  });
});

test.describe('document head', () => {
  const meta = (page, selector) => page.locator(`head ${selector}`).getAttribute('content');

  test('has SEO, social and theme metadata', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(profile.name));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await meta(page, 'meta[name="viewport"]')).toContain('width=device-width');
    expect((await meta(page, 'meta[name="description"]')).length).toBeGreaterThan(50);
    expect(await meta(page, 'meta[name="theme-color"]')).toMatch(/^#[0-9a-f]{6}$/i);
    expect(await page.locator('head link[rel="canonical"]').getAttribute('href')).toMatch(/^https:\/\//);
    for (const property of ['og:type', 'og:title', 'og:description', 'og:url', 'og:site_name']) {
      expect(await meta(page, `meta[property="${property}"]`), property).toBeTruthy();
    }
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description']) {
      expect(await meta(page, `meta[name="${name}"]`), name).toBeTruthy();
    }
  });

  test('describes the editor as a JSON-LD Person', async ({ page }) => {
    const json = await page.locator('head script[type="application/ld+json"]').textContent();
    const person = JSON.parse(json);
    expect(person['@context']).toBe('https://schema.org');
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe(profile.name);
    expect(person.jobTitle).toBe('Content editor');
    expect(person.email).toBe(`mailto:${profile.email}`);
    expect(person).not.toHaveProperty('worksFor');
  });
});
