import { test, expect } from '@playwright/test';

const valueOf = async slider => Number(await slider.getAttribute('aria-valuenow'));

// Synthesizes a one-finger horizontal swipe across the frame via CDP (Chromium touch projects).
async function touchSwipe(page, from, to, steps = 8) {
  const cdp = await page.context().newCDPSession(page);
  const point = (x, y) => [{ x, y, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(from.x, from.y) });
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps;
    const y = from.y + ((to.y - from.y) * i) / steps;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x, y) });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // no hint nudge or easing mid-assertion
  await page.goto('/#craft');
  await page.locator('#craft [role="slider"]').scrollIntoViewIfNeeded();
});

test('slider is keyboard operable', async ({ page }) => {
  const slider = page.getByRole('slider', { name: /compare raw and graded/i });
  await expect(slider).toHaveAttribute('aria-valuenow', '50');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '55');
  await page.keyboard.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '100');
  await page.keyboard.press('Home');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
});

test('dragging with a mouse moves the divider', async ({ page }) => {
  const slider = page.getByRole('slider');
  const frame = page.locator('#craft [data-compare-frame]');
  const box = await frame.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, y, { steps: 6 });
  await page.mouse.up();
  expect(await valueOf(slider)).toBeGreaterThanOrEqual(78);
  expect(await valueOf(slider)).toBeLessThanOrEqual(82);
});

test('swiping horizontally with a finger moves the divider', async ({ page, hasTouch }) => {
  test.skip(!hasTouch, 'touch-only behaviour');
  const slider = page.getByRole('slider');
  const box = await page.locator('#craft [data-compare-frame]').boundingBox();
  const y = box.y + box.height / 2;
  await touchSwipe(page, { x: box.x + box.width * 0.5, y }, { x: box.x + box.width * 0.2, y });
  await expect.poll(() => valueOf(slider)).toBeLessThanOrEqual(25);
});

test('swiping vertically over the slider still scrolls the page', async ({ page, hasTouch }) => {
  test.skip(!hasTouch, 'touch-only behaviour');
  const slider = page.getByRole('slider');
  const frame = page.locator('#craft [data-compare-frame]');
  await expect(frame).toHaveCSS('touch-action', 'pan-y');
  const box = await frame.boundingBox();
  const x = box.x + box.width * 0.3;
  const startY = await page.evaluate(() => window.scrollY);
  await touchSwipe(page, { x, y: box.y + box.height * 0.9 }, { x, y: box.y + box.height * 0.1 }, 12);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(startY);
  expect(await valueOf(slider)).toBe(50);
});

test('tabs switch the comparison and are keyboard navigable', async ({ page }) => {
  const reframe = page.getByRole('tab', { name: 'Reframe' });
  await reframe.click();
  await expect(reframe).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Reframe' })).toBeVisible();
  await expect(page.getByRole('slider', { name: /compare wide and vertical/i })).toBeVisible();

  await page.keyboard.press('ArrowRight');
  const motion = page.getByRole('tab', { name: 'Motion graphics' });
  await expect(motion).toBeFocused();
  await expect(motion).toHaveAttribute('aria-selected', 'true');
});

test('tap targets are at least 44px and the frame fits the viewport', async ({ page }) => {
  const width = page.viewportSize().width;
  const targets = [...(await page.locator('#craft [role="tab"]').all()), page.getByRole('slider')];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box.height, 'tap target height').toBeGreaterThanOrEqual(44);
    expect(box.width, 'tap target width').toBeGreaterThanOrEqual(44);
  }
  // Handle stays inside the frame even at the edges.
  const slider = page.getByRole('slider');
  await slider.focus();
  for (const key of ['Home', 'End']) {
    await page.keyboard.press(key);
    const box = await slider.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
  const frame = await page.locator('#craft [data-compare-frame]').boundingBox();
  expect(frame.x).toBeGreaterThanOrEqual(0);
  expect(frame.x + frame.width).toBeLessThanOrEqual(width);
});

test('both frames load and the breakdown timeline is visible', async ({ page }) => {
  const images = page.locator('#craft [role="tabpanel"] img[alt]:not([alt=""])');
  await expect(images).toHaveCount(2);
  await page.locator('#craft ol').scrollIntoViewIfNeeded();
  await expect(page.getByRole('list', { name: /what goes into an edit/i }).getByRole('listitem')).toHaveCount(5);
});
