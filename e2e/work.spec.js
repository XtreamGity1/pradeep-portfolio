import { test, expect } from '@playwright/test';
import { edits, reelChapters, showreel } from '../src/data.js';

const groups = [...new Set(edits.map(e => e.group))];

const work = page => page.locator('#work');
const filterGroup = page => page.getByRole('group', { name: 'Filter edits by technique' });
const cardButton = (page, edit) => work(page).getByRole('button', { name: edit.title, exact: true });
// `filter({ has })` resolves relative to each matched item, so it must not re-scope to #work.
const hasCard = (page, edit) => page.getByRole('button', { name: edit.title, exact: true });

async function expectNoHorizontalOverflow(page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, 'page should not scroll horizontally').toBeLessThanOrEqual(innerWidth);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await work(page).scrollIntoViewIfNeeded();
});

test('cards show title, technique and summary without hover', async ({ page }) => {
  for (const edit of edits) {
    const item = work(page).getByRole('listitem').filter({ has: hasCard(page, edit) });
    await expect(item.getByRole('heading', { level: 3, name: edit.title })).toBeVisible();
    await expect(item.getByText(edit.group, { exact: true })).toBeVisible();
    await expect(item.getByText(edit.summary, { exact: true })).toBeVisible();
  }
});

test('all cards are landscape and the grid has no gaps under any filter', async ({ page }) => {
  const list = work(page).getByRole('list', { name: 'Edits' });
  for (const label of ['All', ...groups]) {
    await filterGroup(page).getByRole('button', { name: label }).click();
    for (const item of await list.getByRole('listitem').all()) {
      const box = await item.boundingBox();
      expect(box.width, label).toBeGreaterThan(box.height);
    }

    // Every row of the grid is filled edge to edge: the cells' total area equals the grid's area.
    const { filled, total } = await list.evaluate(el => {
      const gap = parseFloat(getComputedStyle(el).rowGap);
      const rect = el.getBoundingClientRect();
      const filled = [...el.children].reduce((sum, li) => {
        const r = li.getBoundingClientRect();
        return sum + (r.width + gap) * (r.height + gap);
      }, 0);
      return { filled, total: (rect.width + gap) * (rect.height + gap) };
    });
    expect(Math.abs(filled - total) / total, label).toBeLessThan(0.01);
  }
});

test('filter toggles are tappable and filter the grid', async ({ page }) => {
  const group = filterGroup(page);
  for (const button of await group.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);
  }

  const category = groups[groups.length - 1];
  const matching = edits.filter(e => e.group === category);
  await group.getByRole('button', { name: category }).click();
  await expect(group.getByRole('button', { name: category })).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  await expect(work(page).getByRole('heading', { level: 3 })).toHaveCount(matching.length);
  await expect(work(page).getByRole('status')).toContainText(`Showing ${matching.length} ${category}`);
  await expectNoHorizontalOverflow(page);
});

test('filters are keyboard operable', async ({ page }) => {
  const group = filterGroup(page);
  await group.getByRole('button', { name: 'All' }).focus();
  await page.keyboard.press('Tab');
  await expect(group.getByRole('button', { name: groups[0] })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(group.getByRole('button', { name: groups[0] })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');
  await expect(group.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  await expect(work(page).getByRole('heading', { level: 3 })).toHaveCount(edits.length);
});

test('keyboard: open an edit, stay trapped inside, Escape returns to the card', async ({ page }) => {
  const edit = edits[0];
  const card = cardButton(page, edit);
  await card.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: edit.title });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');

  // Tab through more stops than the dialog has: focus never leaves it.
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(card).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
});

test('tap a card, browse to the next edit and its clip, close from the backdrop', async ({ page }) => {
  await cardButton(page, edits[0]).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAccessibleName(edits[0].title);
  await expectNoHorizontalOverflow(page);

  // The panel slides up as it opens; measure once it has settled.
  const viewport = page.viewportSize();
  await expect.poll(async () => {
    const box = await dialog.boundingBox();
    return box.y + box.height;
  }).toBeLessThanOrEqual(viewport.height + 1);
  const panel = await dialog.boundingBox();
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(viewport.width);

  const closeBox = await dialog.getByRole('button', { name: 'Close', exact: true }).boundingBox();
  // Sub-pixel tolerance: a fractional transform can report 43.99999px for a 44px box.
  expect(closeBox.width).toBeGreaterThanOrEqual(43.5);
  expect(closeBox.height).toBeGreaterThanOrEqual(43.5);

  await dialog.getByRole('button', { name: /^next/i }).click();
  await expect(dialog).toHaveAccessibleName(edits[1].title);
  await expect(dialog.getByRole('heading', { level: 3, name: 'How it’s done' })).toBeAttached();
  const { start, end } = reelChapters.find(c => c.id === edits[1].id);
  await expect(dialog.locator('video')).toHaveAttribute('src', `${showreel.src}#t=${start},${end}`);

  // The backdrop shows above the sheet on phones and around the panel on larger screens.
  await page.mouse.click(viewport.width / 2, 8);
  await expect(dialog).toBeHidden();
});

test('reduced motion: cards do not tilt on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const card = cardButton(page, edits[0]);
  const box = await card.locator('xpath=ancestor::figure').boundingBox();
  await page.mouse.move(box.x + 10, box.y + 10);
  await page.mouse.move(box.x + 20, box.y + 20, { steps: 5 });
  await page.waitForTimeout(400);
  const transform = await card.locator('xpath=ancestor::figure/div').evaluate(el => getComputedStyle(el).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
});
