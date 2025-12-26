import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load .env file
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  testUser: process.env.TEST_USER || 'user@example.com',
  testPassword: process.env.TEST_PASSWORD || 'password123',
  browser: (process.env.BROWSER || 'chromium') as 'chromium' | 'firefox' | 'webkit',
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  testEnv: process.env.TEST_ENV || 'development',
  headless: process.env.HEADLESS !== 'false',
  workers: parseInt(process.env.WORKERS || '1', 10),
};

// Log configuration on startup
console.log(`TEST_ENV: ${config.testEnv}`);
logger.info(
  `✅ Configuration loaded: ${JSON.stringify(
    {
      baseUrl: config.baseUrl,
      apiBaseUrl: config.apiBaseUrl,
      testUser: config.testUser,
      browser: config.browser,
      timeout: config.timeout,
      headless: config.headless,
      workers: config.workers,
    },
    null,
    2
  )}`
);
