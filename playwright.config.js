import { defineConfig, devices } from '@playwright/test';

// Same suite runs against a phone, a tablet and a laptop viewport.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173' },
  projects: [
    { name: 'mobile-small', use: { ...devices['Galaxy S8'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'tablet-small', use: { ...devices['Galaxy Tab S9'] } },
    { name: 'tablet', use: { ...devices['Galaxy Tab S9'], viewport: { width: 820, height: 1180 } } },
    { name: 'tablet-landscape', use: { ...devices['Galaxy Tab S9 landscape'] } },
    { name: 'laptop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
