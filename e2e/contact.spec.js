import { test, expect } from '@playwright/test';

const LG_BREAKPOINT = 1024;

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.errors = errors;
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();
});

const form = page => page.getByRole('form', { name: /tell me about your video/i });
const submit = page => page.getByRole('button', { name: /send project details/i });

async function fillValid(page) {
  await page.getByLabel('Your name').fill('Sam Carter');
  await page.getByLabel('Your email').fill('sam@example.com');
  await page.getByRole('radio', { name: 'Podcast clips' }).check();
  await page.getByLabel(/budget/i).selectOption('$100–300');
  await page.getByLabel(/footage link/i).fill('drive.google.com/folder/abc');
  await page.getByLabel(/about the project/i).fill('Three clips a week from my podcast.');
}

test('form controls are tappable and big enough not to trigger iOS zoom', async ({ page }) => {
  const controls = form(page).locator('input:not([type=checkbox]), select, textarea, button');
  expect(await controls.count()).toBeGreaterThan(8);
  for (const control of await controls.all()) {
    await control.scrollIntoViewIfNeeded();
    const box = await control.boundingBox();
    expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);
  }
  for (const control of await form(page).locator('input:not([type=radio]):not([type=checkbox]), select, textarea').all()) {
    const fontSize = await control.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize, 'inputs use at least 16px text').toBeGreaterThanOrEqual(16);
  }
  const checkboxRow = form(page).locator('label', { has: page.getByRole('checkbox') });
  expect((await checkboxRow.boundingBox()).height).toBeGreaterThanOrEqual(44);
});

test('form sits beside the email CTA on wide screens and stacks below it otherwise', async ({ page }) => {
  const cta = await page.locator('#contact a[href^="mailto:"]').boundingBox();
  const formBox = await form(page).boundingBox();
  const width = page.viewportSize().width;
  if (width >= LG_BREAKPOINT) {
    expect(formBox.x).toBeGreaterThan(cta.x + cta.width);
  } else {
    expect(formBox.y).toBeGreaterThan(cta.y + cta.height);
  }
  expect(formBox.x).toBeGreaterThanOrEqual(0);
  expect(formBox.x + formBox.width).toBeLessThanOrEqual(width);
});

test('an empty submit focuses the first invalid field and explains what to fix', async ({ page }) => {
  await submit(page).click();
  const name = page.getByLabel('Your name');
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('alert')).toContainText(/4 fields need/i);
  await expect(page.getByText('Tell me your name.')).toBeVisible();

  // Fixing a field clears its error as you type.
  await name.fill('Sam');
  await expect(name).not.toHaveAttribute('aria-invalid');
});

test('rejects a malformed email and footage link', async ({ page }) => {
  await fillValid(page);
  await page.getByLabel('Your email').fill('sam@example');
  await page.getByLabel(/footage link/i).fill('not a link');
  await submit(page).click();
  await expect(page.getByLabel('Your email')).toBeFocused();
  await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  await expect(page.getByText(/enter a valid link/i)).toBeVisible();
});

test('project type chips work from the keyboard', async ({ page }) => {
  const first = page.getByRole('radio', { name: 'YouTube long-form' });
  await first.focus();
  await page.keyboard.press('Space');
  await expect(first).toBeChecked();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Shorts / Reels / TikTok' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Shorts / Reels / TikTok' })).toBeFocused();
});

test('a valid submit composes the email draft and announces success', async ({ page }) => {
  const url = page.url();
  await fillValid(page);
  await page.getByRole('checkbox', { name: /free test edit/i }).check();
  await submit(page).click();

  const status = page.getByRole('status');
  await expect(status).toContainText(/your email is ready to send/i);
  await expect(status.getByRole('heading')).toBeFocused();

  const href = await status.getByRole('link', { name: /open the email draft/i }).getAttribute('href');
  const draft = new URL(href);
  expect(draft.protocol).toBe('mailto:');
  expect(draft.pathname).toBe('hello@alexrivera.studio');
  expect(draft.searchParams.get('subject')).toBe('Project inquiry: Podcast clips — Sam Carter');
  const body = draft.searchParams.get('body');
  expect(body).toContain('Three clips a week from my podcast.');
  expect(body).toContain('Budget: $100–300');
  expect(body).toContain('Footage: https://drive.google.com/folder/abc');
  expect(body).toContain('Free test edit: Yes, please');

  // Handing off to the email app never navigates the page away.
  expect(page.url()).toBe(url);
  expect(page.errors).toEqual([]);

  await status.getByRole('button', { name: /start a new inquiry/i }).click();
  await expect(page.getByLabel('Your name')).toBeFocused();
  await expect(page.getByLabel('Your name')).toHaveValue('');
});

test('footer links are tappable and reach their sections', async ({ page }) => {
  const footer = page.getByRole('contentinfo');
  await footer.scrollIntoViewIfNeeded();
  const links = footer.getByRole('link');
  for (const link of await links.all()) {
    const box = await link.boundingBox();
    expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);
  }
  await expect(footer).toContainText(`© ${new Date().getFullYear()}`);

  await footer.getByRole('navigation', { name: /footer/i }).getByRole('link', { name: 'Work' }).click();
  await expect(page.locator('#work')).toBeInViewport();

  await footer.scrollIntoViewIfNeeded();
  await footer.getByRole('link', { name: /back to top/i }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
});
