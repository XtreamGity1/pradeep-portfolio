import { test, expect } from '@playwright/test';
import { profile } from '../src/data.js';

// Production readiness: share/SEO tags, crawler files, icons and security headers. Runs against the
// local build, or a deployment via BASE_URL. Device size doesn't matter, so one project is enough.
test.beforeEach(() => test.skip(test.info().project.name !== 'laptop', 'device-independent'));

const meta = (page, attr, name) => page.locator(`meta[${attr}="${name}"]`).getAttribute('content');

async function siteUrl(page) {
  await page.goto('/');
  return page.locator('link[rel="canonical"]').getAttribute('href');
}

test('canonical, share tags and structured data all point at the same absolute site URL', async ({ page }) => {
  const site = await siteUrl(page);
  expect(site).toMatch(/^https:\/\/[^/]+\/$/);
  expect(await page.content()).not.toContain('__SITE_URL__');

  expect(await meta(page, 'property', 'og:url')).toBe(site);
  expect(await meta(page, 'property', 'og:image')).toBe(`${site}og-image.jpg`);
  expect(await meta(page, 'property', 'og:image:width')).toBe('1200');
  expect(await meta(page, 'property', 'og:image:height')).toBe('630');
  expect(await meta(page, 'property', 'og:image:alt')).toBeTruthy();
  expect(await meta(page, 'name', 'twitter:card')).toBe('summary_large_image');
  expect(await meta(page, 'name', 'twitter:image')).toBe(`${site}og-image.jpg`);

  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(jsonLd.url).toBe(site);
  expect(jsonLd.name).toBe(profile.name);
  expect(jsonLd.email).toBe(`mailto:${profile.email}`);
});

test('share image and icons are served', async ({ page, request }) => {
  await page.goto('/');
  const og = await request.get('/og-image.jpg');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toContain('image/jpeg');

  for (const [rel, type] of [
    ['icon', 'image/svg+xml'],
    ['apple-touch-icon', 'image/png'],
  ]) {
    const href = await page.locator(`link[rel="${rel}"]`).getAttribute('href');
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
    expect(res.headers()['content-type']).toContain(type);
  }
});

test('robots.txt allows crawling and points at the sitemap', async ({ page, request }) => {
  const site = await siteUrl(page);
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toMatch(/^User-agent: \*$/m);
  expect(body).toMatch(/^Allow: \/$/m);
  expect(body).toContain(`Sitemap: ${site}sitemap.xml`);
});

test('sitemap.xml lists the home page', async ({ page, request }) => {
  const site = await siteUrl(page);
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/xml/);
  const body = await res.text();
  expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  expect(body).toContain(`<loc>${site}</loc>`);
  expect(body).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
});

test('llms.txt introduces the site to AI agents with a title, summary and links', async ({ page, request }) => {
  const site = await siteUrl(page);
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/plain');
  const body = await res.text();
  expect(body).toMatch(new RegExp(`^# ${profile.name}\n`));
  expect(body).toMatch(/^> .+/m);
  expect(body).toContain(`](${site}#work)`);
  expect(body).toContain(`](${site}#contact)`);
  expect(body).toContain(`mailto:${profile.email}`);
});

test('fonts are self-hosted and the hero fonts are preloaded', async ({ page, request }) => {
  const external = [];
  page.on('request', req => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) external.push(req.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);

  const loaded = await page.evaluate(() =>
    [...document.fonts].filter(font => font.status === 'loaded').map(font => `${font.family.replaceAll('"', '')} ${font.style}`),
  );
  expect(loaded).toEqual(expect.arrayContaining(['Inter Tight normal', 'Instrument Serif italic']));

  const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll(links =>
    links.map(link => ({ href: link.getAttribute('href'), crossorigin: link.hasAttribute('crossorigin') })),
  );
  expect(preloads.length).toBeGreaterThan(0);
  for (const { href, crossorigin } of preloads) {
    expect(crossorigin, href).toBe(true);
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
    expect(res.headers()['content-type'], href).toContain('font/woff2');
  }

  const csp = (await request.get('/')).headers()['content-security-policy'];
  expect(csp).not.toContain('fonts.googleapis.com');
  expect(csp).not.toContain('fonts.gstatic.com');
});

test('the 404 page links back home', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /back to the home page/i })).toHaveAttribute('href', '/');
});

test('responses carry security headers', async ({ request }) => {
  const headers = (await request.get('/')).headers();
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['content-security-policy']).toContain('https://api.web3forms.com');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toBeTruthy();
});

test('nothing on the page is blocked by the content security policy', async ({ page }) => {
  const violations = [];
  page.on('console', msg => {
    if (/Content Security Policy|Refused to/i.test(msg.text())) violations.push(msg.text());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  // Walk the page so lazy images, scroll animations and the video all load.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('button', { name: /watch my reel/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');

  expect(violations).toEqual([]);
});
