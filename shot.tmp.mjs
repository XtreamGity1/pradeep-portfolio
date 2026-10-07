import { chromium } from '@playwright/test';
const [,, sel, name, ...widths] = process.argv;
const out = '/tmp/claude-0/-home-user-pradeep-portfolio/d72619d2-4741-5d3a-b98a-03995bf62f18/scratchpad/shots';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const w of widths.map(Number)) {
  const p = await b.newPage({ viewport: { width: w, height: w < 600 ? 800 : 900 }, reducedMotion: 'reduce' });
  await p.goto('http://localhost:4173');
  await p.evaluate(() => document.fonts.ready);
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  await el.screenshot({ path: `${out}/${name}-${w}.png` });
  await p.close();
}
await b.close();
