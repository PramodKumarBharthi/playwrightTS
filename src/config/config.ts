import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load .env file
dotenv.config();

/**
 * Safely parse environment variables with trimming and validation
 * Prevents issues from whitespace, newlines, or concatenated values in CI/CD
 */
export const config = {
  baseUrl: (process.env.BASE_URL || 'http://localhost:3000').trim(),
  apiBaseUrl: (process.env.API_BASE_URL || 'http://localhost:3000/api').trim(),
  testUser: (process.env.TEST_USER || 'user@example.com').trim(),
  
  // ✅ CRITICAL: Trim password to prevent authentication failures
  testPassword: (process.env.TEST_PASSWORD || 'password123').trim(),
  
  browser: ((process.env.BROWSER || 'chromium').trim()) as 'chromium' | 'firefox' | 'webkit',
  timeout: parseInt((process.env.TIMEOUT || '30000').trim(), 10),
  testEnv: (process.env.TEST_ENV || 'development').trim(),
  
  // ✅ Explicit boolean parsing for CI/CD safety
  headless: (process.env.HEADLESS?.trim()?.toLowerCase() === 'true') || (process.env.CI === 'true'),
  
  workers: parseInt((process.env.WORKERS || '1').trim(), 10),
};

// ✅ Validation layer: Warn if critical variables are missing or invalid
const validateConfig = (): void => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!process.env.TEST_PASSWORD?.trim()) {
    warnings.push('TEST_PASSWORD is not set or is empty');
  }

  if (!process.env.BASE_URL?.trim()) {
    warnings.push('BASE_URL is not set or is empty');
  }

  if (config.timeout < 5000) {
    warnings.push(`TIMEOUT is very low (${config.timeout}ms); consider increasing to 10000+`);
  }

  if (isNaN(config.workers) || config.workers < 1) {
    errors.push('WORKERS must be a positive integer');
  }

  if (errors.length > 0) {
    logger.error(`❌ Configuration errors:\n${errors.map(e => `  - ${e}`).join('\n')}`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    logger.warn(`⚠️ Configuration warnings:\n${warnings.map(w => `  - ${w}`).join('\n')}`);
  }
};

validateConfig();

// ✅ Safe logging: Do NOT expose passwords, usernames, or URLs in CI/CD
const logConfig = (): void => {
  // In CI/CD or production, log minimally
  if (process.env.CI === 'true' || config.testEnv === 'production') {
    logger.info('✅ Configuration loaded (CI/CD mode - minimal logging)');
    logger.debug(`Environment: ${config.testEnv}`);
    logger.debug(`Browser: ${config.browser}`);
    logger.debug(`Headless: ${config.headless}`);
    logger.debug(`Workers: ${config.workers}`);
    logger.debug(`Timeout: ${config.timeout}ms`);
  } else {
    // Local development: more verbose logging
    logger.info(
      `✅ Configuration loaded:\n${JSON.stringify(
        {
          baseUrl: config.baseUrl,
          apiBaseUrl: config.apiBaseUrl,
          browser: config.browser,
          timeout: config.timeout,
          headless: config.headless,
          workers: config.workers,
          testEnv: config.testEnv,
        },
        null,
        2
      )}`
    );
  }
};

logConfig();

export default config;
