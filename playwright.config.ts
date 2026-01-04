import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as os from 'os';
require('dotenv').config();

const baseURL = (process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login').trim().replace(/^['"]|['"]$/g, '');

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: [
    'src/steps/**/*.steps.ts',
    'src/support/ui-fixtures.ts',
    'src/support/api-fixtures.ts',
  ],
  missingSteps: 'skip-scenario',
});

// Environment-aware configuration
const workers = process.env.CI ? 1 : (process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 2);
const timeout = parseInt(process.env.TIMEOUT || '30000', 10);
const isHeadless = process.env.CI ? true : (process.env.HEADLESS?.trim().toLowerCase() !== 'false');
const retries = process.env.CI ? 2 : 0;

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries,
  workers,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: false,
        categories: [],
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version?.(),
          node_version: process.version,
          ci_environment: process.env.CI ? 'GitHub Actions' : 'Local',
          test_env: process.env.TEST_ENV || 'development',
        },
      },
    ],
    ['json', { outputFile: 'test-results.json' }],
  ],
  timeout,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'API',
      use: {},
      grep: /@api/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: isHeadless,
        },
      },
      grepInvert: /@api/,
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          headless: isHeadless,
        },
      },
      grepInvert: /@api/,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          headless: isHeadless,
        },
      },
      grepInvert: /@api/,
    },
  ],
});
