import { Page } from 'playwright';
import { BasePage } from './basePage';
import { logger } from '../utils/logger';

export class DashboardPage extends BasePage {
  private dashboardHeading = 'div.oxd-topbar-header-title h6';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  }

  async isVisible(): Promise<boolean> {
    logger.info(`🔍 Checking dashboard visibility using selector: "${this.dashboardHeading}"`);
    try {
      const visible = await super.isVisible(this.dashboardHeading);
      logger.info(`📊 Dashboard heading visible: ${visible}`);
      return visible;
    } catch (error) {
      logger.error(`❌ Error checking dashboard visibility: ${error}`);
      throw error;
    }
  }

  async getDashboardTitle(): Promise<string> {
    return await this.page.title();
  }

  async isElementVisible(selector: string): Promise<boolean> {
    return await super.isVisible(selector);
  }
}
