import { Page } from 'playwright';
import { logger } from '../utils/logger';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    logger.info(`Navigating to ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    // Wait an additional second for dynamic content to render
    await this.page.waitForTimeout(1000);
  }

  async waitForSelector(selector: string, timeout: number = 5000): Promise<void> {
    logger.info(`Waiting for selector: ${selector}`);
    await this.page.waitForSelector(selector, { timeout });
  }

  async click(selector: string): Promise<void> {
    logger.info(`Clicking on selector: ${selector}`);
    await this.page.click(selector);
  }

  async fill(selector: string, text: string): Promise<void> {
    logger.info(`Filling ${selector} with text: ${text}`);
    try {
      // Try using locator first for better selector matching
      const locator = this.page.locator(selector).first();
      await locator.waitFor({ timeout: 10000 });
      await locator.fill(text);
    } catch (e) {
      // Fallback to simple page.fill
      logger.error(`Failed with locator, retrying with page.fill: ${e}`);
      await this.page.waitForSelector(selector, { timeout: 10000 });
      await this.page.fill(selector, text);
    }
  }

  async getText(selector: string): Promise<string> {
    logger.info(`Getting text from selector: ${selector}`);
    const text = await this.page.textContent(selector);
    return text ?? '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async getErrorMessage(selector: string): Promise<string> {
    return await this.getText(selector);
  }
}
