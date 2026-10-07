import { test, expect } from '@playwright/test';
import { inquiry, profile } from '../src/data.js';

const LG_BREAKPOINT = 1024;

const WEB3FORMS = 'https://api.web3forms.com/submit';
const sendsDirectly = Boolean(inquiry.web3formsKey);

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.errors = errors;
  // Never email the real inbox from tests: answer Web3Forms locally and record what was sent.
  page.sent = [];
  await page.route(WEB3FORMS, route => {
    page.sent.push(route.request().postDataJSON());
    return route.fulfill({ json: { success: true, message: 'Email sent successfully!' } });
  });
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();
});

const form = page => page.getByRole('form', { name: /tell me about your video/i });
const submit = page => page.getByRole('button', { name: /send project details/i });
const detailsToggle = page => form(page).getByText(/add budget, timeline or a footage link/i);
const openDetails = page => detailsToggle(page).click();

async function fillValid(page) {
  await page.getByLabel('Your name').fill('Sam Carter');
  await page.getByLabel('Your email').fill('sam@example.com');
  await page.getByRole('radio', { name: 'Podcast clips' }).check();
  await openDetails(page);
  await page.getByLabel(/budget/i).selectOption('$100–300');
  await page.getByLabel(/footage link/i).fill('drive.google.com/folder/abc');
  await page.getByLabel(/about the project/i).fill('Three clips a week from my podcast.');
}

test('optional details start collapsed behind a tappable toggle', async ({ page }) => {
  await detailsToggle(page).scrollIntoViewIfNeeded();
  await expect(page.getByLabel(/footage link/i)).toBeHidden();
  const box = await detailsToggle(page).boundingBox();
  expect(box.height, 'toggle tap target').toBeGreaterThanOrEqual(44);
  await openDetails(page);
  await expect(page.getByLabel(/budget/i)).toBeVisible();
  await expect(page.getByLabel(/footage link/i)).toBeVisible();
});

test('form controls are tappable and big enough not to trigger iOS zoom', async ({ page }) => {
  await openDetails(page);
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
  test.skip(sendsDirectly, 'the form emails directly once a Web3Forms key is set');
  const url = page.url();
  await fillValid(page);
  await page.getByRole('checkbox', { name: /free test edit/i }).check();
  await submit(page).click();

  const status = page.locator('#contact').getByRole('status');
  await expect(status).toContainText(/your email is ready to send/i);
  await expect(status.getByRole('heading')).toBeFocused();

  const href = await status.getByRole('link', { name: /open the email draft/i }).getAttribute('href');
  const draft = new URL(href);
  expect(draft.protocol).toBe('mailto:');
  expect(draft.pathname).toBe(profile.email);
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

test('a valid submit emails the inquiry and confirms it was sent', async ({ page }) => {
  test.skip(!sendsDirectly, 'needs inquiry.web3formsKey in src/data.js');
  await fillValid(page);
  await page.getByRole('checkbox', { name: /free test edit/i }).check();
  await submit(page).click();

  const status = page.locator('#contact').getByRole('status');
  await expect(status).toContainText(inquiry.sent.title);
  await expect(status.getByRole('heading')).toBeFocused();

  expect(page.sent).toHaveLength(1);
  expect(page.sent[0]).toMatchObject({
    access_key: inquiry.web3formsKey,
    subject: 'Project inquiry: Podcast clips — Sam Carter',
    name: 'Sam Carter',
    email: 'sam@example.com',
    Budget: '$100–300',
    Footage: 'https://drive.google.com/folder/abc',
    'Free test edit': 'Yes, please',
    message: 'Three clips a week from my podcast.',
  });
  expect(page.errors).toEqual([]);
});

test('if sending fails, the visitor keeps their message and gets the email draft', async ({ page }) => {
  test.skip(!sendsDirectly, 'needs inquiry.web3formsKey in src/data.js');
  await page.route(WEB3FORMS, route => route.abort('internetdisconnected'));
  await fillValid(page);
  await submit(page).click();

  const alert = form(page).getByRole('alert');
  await expect(alert).toContainText(/didn’t go through/i);
  const draft = new URL(await alert.getByRole('link', { name: inquiry.failed.fallback }).getAttribute('href'));
  expect(draft.protocol).toBe('mailto:');
  expect(draft.pathname).toBe(profile.email);
  await expect(page.getByLabel('Your name')).toHaveValue('Sam Carter');
});

test('footer links are tappable and reach their sections', async ({ page }) => {
  // Landing is under test, not the glide: jump instead of smooth-scrolling the whole page per link.
  await page.emulateMedia({ reducedMotion: 'reduce' });
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
});

test('footer lays section links and socials out as two side-by-side columns', async ({ page }) => {
  const footer = page.getByRole('contentinfo');
  await footer.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const sections = await footer.getByRole('navigation', { name: /footer/i }).boundingBox();
  const socials = await footer.getByRole('list', { name: /social/i }).boundingBox();
  expect(Math.abs(sections.y - socials.y), 'columns share a top edge').toBeLessThan(2);
  expect(socials.x, 'socials sit to the right').toBeGreaterThanOrEqual(sections.x + sections.width - 1);

  // Each column stacks its links vertically.
  const boxes = await footer.getByRole('navigation', { name: /footer/i }).getByRole('link').evaluateAll(links =>
    links.map(link => link.getBoundingClientRect()),
  );
  for (let i = 1; i < boxes.length; i++) {
    expect(boxes[i].x).toBeCloseTo(boxes[0].x, 0);
    expect(boxes[i].y).toBeGreaterThan(boxes[i - 1].y);
  }
});

test('back-to-top pill appears after scrolling, returns to the top and hides there', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const pill = page.getByRole('link', { name: /back to top/i });

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(pill).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(pill).toBeVisible();
  const box = await pill.boundingBox();
  expect(box.height, 'tap target at least 44px tall').toBeGreaterThanOrEqual(44);

  // Fixed to the viewport: still there at the very bottom, without covering footer links.
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(pill).toBeVisible();
  const pillBox = await pill.boundingBox();
  for (const link of await page.getByRole('contentinfo').getByRole('link').all()) {
    const l = await link.boundingBox();
    const overlaps =
      l.x < pillBox.x + pillBox.width && pillBox.x < l.x + l.width && l.y < pillBox.y + pillBox.height && pillBox.y < l.y + l.height;
    expect(overlaps, `pill clears ${await link.textContent()}`).toBe(false);
  }

  await pill.click();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(pill).toHaveCount(0);
});
