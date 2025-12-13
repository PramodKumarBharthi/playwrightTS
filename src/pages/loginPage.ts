import { Page } from 'playwright';
import { BasePage } from './basePage';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  // OrangeHRM login page selectors (readonly for clarity)
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly submitButton = 'button[type="submit"]';
  // Use the selector that steps expect — confirm if your app uses different one
  private readonly errorMessage = '.oxd-alert-content-text';
  private readonly dashboardLink = 'a[href*="dashboard"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    // Use baseUrl as-is since it already includes the full path
    await this.navigateTo(config.baseUrl);
    // Ensure login form is present
    await this.waitForSelector(this.usernameInput);
    await this.waitForSelector(this.passwordInput);
  }

  async enterUsername(username: string): Promise<void> {
    logger.info(`Filling username field with value: ${username ? '***' : '(empty)'}`);
    await this.waitForSelector(this.usernameInput);
    await this.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    logger.info(`Filling password field`);
    await this.waitForSelector(this.passwordInput);
    await this.fill(this.passwordInput, password);
  }

  async submit(): Promise<void> {
    logger.info(`Clicking submit button`);
    await this.waitForSelector(this.submitButton);
    // Use locator click to be more reliable
    const locator = this.page.locator(this.submitButton).first();
    await locator.click();
    // Wait a bit for navigation or UI updates
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async getErrorMessage(): Promise<string> {
    // Wait for error message or timeout early if not present
    await this.page.waitForSelector(this.errorMessage, { timeout: 3000 }).catch(() => {});
    const text = await this.getText(this.errorMessage);
    return text.trim();
  }
}
