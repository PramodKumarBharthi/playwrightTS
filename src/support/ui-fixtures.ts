import { Page, TestInfo, BrowserContext, APIRequestContext } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { logger as Logger } from '../utils/logger';

/**
 * UIWorld: Shared context for UI BDD scenarios
 */
export class UIWorld {
  // Playwright provided objects
  public page: Page;
  public context?: BrowserContext;
  public request: APIRequestContext;
  public testInfo: TestInfo;

  // Page Objects
  public loginPage: LoginPage;
  public dashboardPage: DashboardPage;

  // Scenario-specific data
  private scenarioData: Map<string, any> = new Map();

  // Test start time
  private testStartTime: number = 0;

  [key: string]: any;

  constructor(page: Page, testInfo: TestInfo, request: APIRequestContext, context?: BrowserContext) {
    this.page = page;
    this.testInfo = testInfo;
    this.request = request;
    this.context = context;
    this.testStartTime = Date.now();

    // Initialize page objects
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);

    Logger.info(`UIWorld initialized for: ${this.testInfo.title}`);
  }

  // Scenario data helpers
  setData<T>(key: string, value: T): void {
    this.scenarioData.set(key, value);
    Logger.info(`📊 Data stored: ${key}`);
  }

  getData<T>(key: string): T | undefined {
    return this.scenarioData.get(key) as T | undefined;
  }

  getDataOrDefault<T>(key: string, defaultValue: T): T {
    return (this.scenarioData.get(key) as T) ?? defaultValue;
  }

  hasData(key: string): boolean {
    return this.scenarioData.has(key);
  }

  removeData(key: string): boolean {
    return this.scenarioData.delete(key);
  }

  clearData(): void {
    this.scenarioData.clear();
  }

  getAllData(): Record<string, any> {
    const data: Record<string, any> = {};
    this.scenarioData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  // Utilities
  async navigateTo(url: string): Promise<void> {
    Logger.info(`🔗 Navigating to: ${url}`);
    await this.page.goto(url);
  }

  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`📸 Taking screenshot: ${name}`);
    return await this.page.screenshot();
  }

  async attachScreenshot(name: string): Promise<void> {
    try {
      const buffer = await this.page.screenshot();
      await this.testInfo.attach(name, {
        body: buffer,
        contentType: 'image/png',
      });
      Logger.info(`📸 Screenshot attached: ${name}`);
    } catch (error) {
      Logger.error(`Failed to attach screenshot: ${error}`);
    }
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  getPageUrl(): string {
    return this.page.url();
  }

  getExecutionTime(): number {
    return Date.now() - this.testStartTime;
  }

  getExecutionTimeInSeconds(): number {
    return this.getExecutionTime() / 1000;
  }

  generateSummary(): string {
    return `
    ╔════════════════════════════════════╗
    ║         TEST EXECUTION SUMMARY      ║
    ╠════════════════════════════════════╣
    ║ Test Title: ${this.testInfo.title}
    ║ Test File: ${this.testInfo.file}
    ║ Duration: ${this.getExecutionTimeInSeconds().toFixed(2)}s
    ║ Current URL: ${this.getPageUrl()}
    ╠════════════════════════════════════╣
    ║         SCENARIO DATA               ║
    ║ ${JSON.stringify(this.getAllData(), null, 2)}
    ╚════════════════════════════════════╝
    `;
  }

  async cleanup(): Promise<void> {
    Logger.info('🧹 Cleaning up UIWorld resources');
    this.clearData();
    Logger.info(`✅ Cleanup completed. Test duration: ${this.getExecutionTimeInSeconds().toFixed(2)}s`);
  }
}

// Playwright test extension to provide uiWorld fixture
type UIWorldFixtures = {
  uiWorld: UIWorld;
};

export const test = base.extend<UIWorldFixtures>({
  uiWorld: async ({ page, context, request }, use, testInfo) => {
    Logger.info(`\n${'='.repeat(50)}`);
    Logger.info(`🚀 Starting: ${testInfo.title}`);
    Logger.info(`${'='.repeat(50)}\n`);

    const uiWorld = new UIWorld(page, testInfo, request, context);

    await use(uiWorld);

    // After scenario cleanup
    await uiWorld.cleanup();

    Logger.info(`${'='.repeat(50)}`);
    Logger.info(`✅ Completed: ${testInfo.title}`);
    Logger.info(`${'='.repeat(50)}\n`);
  },
});

// Create BDD and re-export Given/When/Then that bind to uiWorld
const { Given, When, Then, Before, After, BeforeAll, AfterAll } = createBdd(test, {
  worldFixture: 'uiWorld',
});

// Re-export decorators and expect
export { Given, When, Then, Before, After, BeforeAll, AfterAll };

export { expect } from '@playwright/test';
