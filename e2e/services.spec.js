import { test, expect } from '@playwright/test';

const MD_BREAKPOINT = 768;
const LG_BREAKPOINT = 1024;

const viewportWidth = page => page.viewportSize().width;

async function boxes(locator) {
  return Promise.all((await locator.all()).map(el => el.boundingBox()));
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('services', () => {
  test('cards fit the viewport and show deliverables + turnaround without hover', async ({ page }) => {
    const cards = page.locator('#services').getByRole('article');
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card.getByText('Deliverables')).toBeVisible();
      await expect(card.getByText(/turnaround/i)).toBeVisible();
      const box = await card.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth(page));
    }
  });

  test('cards sit two-up from tablet and stack on phones', async ({ page }) => {
    const [first, second] = await boxes(page.locator('#services').getByRole('article'));
    if (viewportWidth(page) < MD_BREAKPOINT) {
      expect(second.y).toBeGreaterThan(first.y + first.height - 1);
    } else {
      expect(Math.abs(second.y - first.y)).toBeLessThan(2);
    }
  });

  test('spotlight follows a mouse pointer but never lights up from touch', async ({ page }, testInfo) => {
    const card = page.locator('#services').getByRole('article').first();
    const spotlight = card.getByTestId('spotlight');
    await card.scrollIntoViewIfNeeded();

    if (testInfo.project.use.hasTouch) {
      await card.tap();
      await expect(spotlight).toHaveCSS('opacity', '0');
    } else {
      const box = await card.boundingBox();
      await page.mouse.move(box.x + 40, box.y + 40);
      await page.mouse.move(box.x + 60, box.y + 60);
      await expect(spotlight).not.toHaveCSS('opacity', '0');
    }
  });

  test('spotlight stays off with reduced motion', async ({ page }, testInfo) => {
    test.skip(Boolean(testInfo.project.use.hasTouch), 'mouse-only behaviour');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const card = page.locator('#services').getByRole('article').first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    await page.mouse.move(box.x + 40, box.y + 40);
    await page.mouse.move(box.x + 60, box.y + 60);
    await expect(card.getByTestId('spotlight')).toHaveCSS('opacity', '0');
  });

  test('toolkit stays inside the viewport', async ({ page }) => {
    const tools = page.getByRole('list', { name: 'Toolkit' }).getByRole('listitem');
    await tools.first().scrollIntoViewIfNeeded();
    for (const box of await boxes(tools)) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth(page));
    }
  });
});

test.describe('pricing', () => {
  test('three packages with readable prices and one labelled recommendation', async ({ page }) => {
    const pricing = page.locator('#pricing');
    const cards = pricing.getByRole('list', { name: 'Packages' }).getByRole('article');
    await expect(cards).toHaveCount(3);
    await expect(pricing.getByText('Best value')).toHaveCount(1);
    await pricing.getByText('Best value').scrollIntoViewIfNeeded();
    await expect(pricing.getByText('Best value')).toBeVisible();
    for (const card of await cards.all()) {
      await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
      await expect(card.getByText(/^From \$\d[\d,]* per \w+$/)).toHaveCount(1);
    }
  });

  test('layout adapts: stacked below lg, three columns from lg', async ({ page }) => {
    const cards = page.locator('#pricing').getByRole('list', { name: 'Packages' }).getByRole('article');
    const [a, b, c] = await boxes(cards);
    if (viewportWidth(page) < LG_BREAKPOINT) {
      // One card per row — no squashed three-up on tablet portrait.
      expect(b.y).toBeGreaterThan(a.y + a.height - 1);
      expect(c.y).toBeGreaterThan(b.y + b.height - 1);
      expect(a.width).toBeGreaterThan(viewportWidth(page) * 0.8);
    } else {
      expect(Math.abs(b.y - a.y)).toBeLessThan(2);
      expect(Math.abs(c.y - a.y)).toBeLessThan(2);
      expect(Math.abs(a.height - c.height)).toBeLessThan(2);
    }
  });

  test('tablet cards split summary and details side by side', async ({ page }) => {
    const width = viewportWidth(page);
    test.skip(width < MD_BREAKPOINT || width >= LG_BREAKPOINT, 'tablet-portrait layout');
    const card = page.locator('#pricing').getByRole('article').first();
    const price = await card.getByText(/^From \$/).locator('xpath=..').boundingBox();
    const included = await card.getByRole('list').boundingBox();
    expect(included.x).toBeGreaterThan(price.x + 100);
  });

  test('every CTA is a 44px+ tap target that jumps to contact', async ({ page }) => {
    const ctas = page.locator('#pricing a[href="#contact"]');
    await expect(ctas).toHaveCount(4);
    for (const cta of await ctas.all()) {
      await cta.scrollIntoViewIfNeeded();
      const box = await cta.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth(page));
    }
    await page.getByRole('link', { name: /claim your test edit/i }).click();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('CTAs are reachable by keyboard with a visible focus ring', async ({ page }, testInfo) => {
    test.skip(Boolean(testInfo.project.use.hasTouch), 'keyboard behaviour');
    const firstCta = page.locator('#pricing a[href="#contact"]').first();
    await firstCta.focus();
    await expect(firstCta).toBeFocused();
    await expect(firstCta).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab');
    await expect(page.locator('#pricing a[href="#contact"]').nth(1)).toBeFocused();
  });
});
