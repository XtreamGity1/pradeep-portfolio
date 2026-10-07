import { test, expect } from '@playwright/test';

const LG_BREAKPOINT = 1024;

const isWide = page => page.viewportSize().width >= LG_BREAKPOINT;

async function expectWithinViewport(page, locator) {
  const width = page.viewportSize().width;
  for (const el of await locator.all()) {
    const box = await el.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
}

async function expectNoHorizontalOverflow(page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, 'page should not scroll horizontally').toBeLessThanOrEqual(innerWidth);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('process timeline', () => {
  test('lays steps out vertically on small screens and horizontally on laptops', async ({ page }) => {
    const list = page.getByRole('list', { name: /process/i });
    await list.scrollIntoViewIfNeeded();
    const steps = list.getByRole('listitem');
    await expect(steps).toHaveCount(4);
    const boxes = await Promise.all((await steps.all()).map(s => s.boundingBox()));
    for (let i = 1; i < boxes.length; i++) {
      if (isWide(page)) {
        expect(Math.abs(boxes[i].y - boxes[0].y), 'steps share a row').toBeLessThan(2);
        expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x);
      } else {
        expect(boxes[i].y, 'steps stack top to bottom').toBeGreaterThanOrEqual(boxes[i - 1].y + boxes[i - 1].height - 1);
      }
    }
    await expectWithinViewport(page, steps);
  });

  test('every step shows timing and what the client provides', async ({ page }) => {
    const steps = page.getByRole('list', { name: /process/i }).getByRole('listitem');
    await expect(steps).toHaveCount(4);
    for (const step of await steps.all()) {
      await step.scrollIntoViewIfNeeded();
      await expect(step.getByRole('heading', { level: 3 })).toBeVisible();
      await expect(step.getByText(/you provide/i)).toBeVisible();
    }
  });

  test('on laptops the "You provide" boxes line up in one row at equal height', async ({ page }) => {
    test.skip(!isWide(page), 'side-by-side layout only');
    const list = page.getByRole('list', { name: /process/i });
    await list.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    const boxes = await list.locator('dl').evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
    expect(boxes).toHaveLength(4);
    for (const box of boxes.slice(1)) {
      expect(Math.abs(box.top - boxes[0].top), 'boxes share a top edge').toBeLessThan(1);
      expect(Math.abs(box.height - boxes[0].height), 'boxes share a height').toBeLessThan(1);
    }
  });
});

test.describe('testimonials', () => {
  test('every quote is visible inside the viewport without page overflow', async ({ page }) => {
    const section = page.locator('#testimonials');
    await section.scrollIntoViewIfNeeded();
    const figures = section.locator('figure');
    expect(await figures.count()).toBeGreaterThanOrEqual(2);
    for (const figure of await figures.all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator('blockquote')).toBeVisible();
      await expect(figure.locator('figcaption')).toBeVisible();
    }
    await expectWithinViewport(page, figures);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('faq accordion', () => {
  test('questions are tappable buttons, collapsed by default', async ({ page }) => {
    const section = page.locator('#faq');
    await section.scrollIntoViewIfNeeded();
    const buttons = section.getByRole('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(6);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      const box = await button.boundingBox();
      expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);
    }
    await expectWithinViewport(page, buttons);
  });

  test('opens several answers by tap and closes them again', async ({ page }) => {
    const buttons = page.locator('#faq').getByRole('button');
    const first = buttons.nth(0);
    const second = buttons.nth(1);
    await first.scrollIntoViewIfNeeded();
    await first.click();
    await second.click();
    const firstPanel = page.locator(`#${await first.getAttribute('aria-controls')}`);
    const secondPanel = page.locator(`#${await second.getAttribute('aria-controls')}`);
    await expect(firstPanel).toBeVisible();
    await expect(secondPanel).toBeVisible();
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expectNoHorizontalOverflow(page);
    await first.click();
    await expect(firstPanel).toBeHidden();
    await expect(secondPanel).toBeVisible();
  });

  test('is fully keyboard operable with a visible focus ring', async ({ page }) => {
    const button = page.locator('#faq').getByRole('button').first();
    await button.scrollIntoViewIfNeeded();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    // Tab moves on to the next question.
    await page.keyboard.press('Tab');
    const next = page.locator('#faq').getByRole('button').nth(1);
    await expect(next).toBeFocused();
    const outline = await next.evaluate(el => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });

  test('links to the contact section for anything else', async ({ page }) => {
    const link = page.locator('#faq').getByRole('link', { name: /ask me directly/i });
    await link.scrollIntoViewIfNeeded();
    const box = await link.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    await link.click();
    await expect(page.locator('#contact')).toBeInViewport();
  });
});
