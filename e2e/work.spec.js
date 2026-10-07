import { test, expect } from '@playwright/test';
import { projects } from '../src/data.js';

const categories = [...new Set(projects.map(p => p.category))];
const vertical = projects.find(p => p.orientation === 'vertical');

const work = page => page.locator('#work');
const filterGroup = page => page.getByRole('group', { name: /filter projects by format/i });
const cardButton = (page, project) => work(page).getByRole('button', { name: project.title, exact: true });
// `filter({ has })` resolves relative to each matched item, so it must not re-scope to #work.
const hasCard = (page, project) => page.getByRole('button', { name: project.title, exact: true });

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

test('cards show title, type and focus without hover', async ({ page }) => {
  for (const project of projects) {
    const item = work(page).getByRole('listitem').filter({ has: hasCard(page, project) });
    await expect(item.getByRole('heading', { level: 3, name: project.title })).toBeVisible();
    await expect(item.getByText(project.type, { exact: true })).toBeVisible();
    await expect(item.getByText(project.focus, { exact: true })).toBeVisible();
  }
});

test('vertical projects get tall cards and the grid has no gaps', async ({ page }) => {
  const box = await work(page).getByRole('listitem').filter({ has: hasCard(page, vertical) }).boundingBox();
  expect(box.height).toBeGreaterThan(box.width);

  // Every row of the grid is filled edge to edge: the cells' total area equals the grid's area.
  const { filled, total } = await work(page)
    .getByRole('list', { name: 'Projects' })
    .evaluate(list => {
      const gap = parseFloat(getComputedStyle(list).rowGap);
      const rect = list.getBoundingClientRect();
      const filled = [...list.children].reduce((sum, li) => {
        const r = li.getBoundingClientRect();
        return sum + (r.width + gap) * (r.height + gap);
      }, 0);
      return { filled, total: (rect.width + gap) * (rect.height + gap) };
    });
  expect(Math.abs(filled - total) / total).toBeLessThan(0.01);
});

test('filter toggles are tappable and filter the grid', async ({ page }) => {
  const group = filterGroup(page);
  for (const button of await group.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);
  }

  const category = categories[categories.length - 1];
  const matching = projects.filter(p => p.category === category);
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
  await expect(group.getByRole('button', { name: categories[0] })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(group.getByRole('button', { name: categories[0] })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');
  await expect(group.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  await expect(work(page).getByRole('heading', { level: 3 })).toHaveCount(projects.length);
});

test('keyboard: open a case study, stay trapped inside, Escape returns to the card', async ({ page }) => {
  const project = projects[0];
  const card = cardButton(page, project);
  await card.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: project.title });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close case study' })).toBeFocused();
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

test('tap a card, browse to the next case study, close from the backdrop', async ({ page }) => {
  await cardButton(page, projects[0]).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAccessibleName(projects[0].title);
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

  const closeBox = await dialog.getByRole('button', { name: 'Close case study' }).boundingBox();
  // Sub-pixel tolerance: a fractional transform can report 43.99999px for a 44px box.
  expect(closeBox.width).toBeGreaterThanOrEqual(43.5);
  expect(closeBox.height).toBeGreaterThanOrEqual(43.5);

  await dialog.getByRole('button', { name: /^next/i }).click();
  await expect(dialog).toHaveAccessibleName(projects[1].title);
  await expect(dialog.getByRole('heading', { level: 3, name: 'What I did' })).toBeAttached();

  // The backdrop shows above the sheet on phones and around the panel on larger screens.
  await page.mouse.click(viewport.width / 2, 8);
  await expect(dialog).toBeHidden();
});

test('reduced motion: cards do not tilt on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const card = cardButton(page, projects[0]);
  const box = await card.locator('xpath=ancestor::figure').boundingBox();
  await page.mouse.move(box.x + 10, box.y + 10);
  await page.mouse.move(box.x + 20, box.y + 20, { steps: 5 });
  await page.waitForTimeout(400);
  const transform = await card.locator('xpath=ancestor::figure/div').evaluate(el => getComputedStyle(el).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
});
