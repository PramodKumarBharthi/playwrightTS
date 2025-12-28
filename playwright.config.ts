// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as os from 'os';
require('dotenv').config();

const baseURL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: [
    'src/steps/**/*.steps.ts',
    'src/support/ui-fixtures.ts',
    'src/support/api-fixtures.ts',
  ],
  missingSteps: 'skip-scenario',
});

// Parse environment variables with defaults
const workers = process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 1;
const timeout = parseInt(process.env.TIMEOUT || '30000', 10);
const isHeadless = process.env.HEADLESS?.trim().toLowerCase() !== 'false';

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version?.(),
        node_version: process.version,
      },
    }],
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
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        launchOptions: {
          headless: isHeadless,
        },
      },
      grepInvert: /@api/,
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        launchOptions: {
          headless: isHeadless,
        },
      },
      grepInvert: /@api/,
    },
  ],
});
