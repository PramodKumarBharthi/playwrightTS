import { Before, After, BeforeAll, AfterAll } from './ui-fixtures';
import { UIWorld } from './ui-fixtures';
import { config } from '../config/config';
import { logger } from '../utils/logger';

BeforeAll(async () => {
  logger.info(`🔧 Global setup — timeout set to ${config.timeout}ms`);
});

AfterAll(async () => {
  logger.info('🔧 Global teardown completed');
});

Before(async function (this: UIWorld) {
  logger.info(`🔵 Scenario start: ${this.testInfo.title}`);

  // Optionally navigate to baseUrl if configured
  if (config.baseUrl) {
    try {
      await this.page.goto(config.baseUrl);
      logger.info(`🔗 Navigated to baseUrl: ${config.baseUrl}`);
    } catch (err) {
      logger.warn(`Could not navigate to baseUrl: ${err}`);
    }
  }
});

After(async function (this: UIWorld) {
  const testInfo = this.testInfo;

  const safeTitle = testInfo.title.replace(/[^a-z0-9_-]/gi, '_').slice(0, 120);

  // If Playwright Test marked test as failed, attach screenshot + page url
  try {
    if (testInfo.status === 'failed') {
      const buffer = await this.page.screenshot();
      await testInfo.attach(`${safeTitle}_screenshot`, { body: buffer, contentType: 'image/png' });
      await testInfo.attach('page-url.txt', {
        body: Buffer.from(this.getPageUrl(), 'utf8'),
        contentType: 'text/plain',
      });
      logger.error(`❌ Scenario failed: ${testInfo.title}. Screenshot attached.`);
    }
  } catch (error) {
    logger.error(`❌ Failed to capture/attach screenshot: ${error}`);
  }

  // Always attempt UIWorld cleanup (clears scenario data, etc.)
  try {
    await this.cleanup();
  } catch (err) {
    logger.warn(`Cleanup had issues: ${err}`);
  }

  logger.info(`✅ Scenario finished: ${testInfo.title}`);
});
