import { Given, When, Then, UIWorld } from '../support/ui-fixtures';
import { expect } from '@playwright/test';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { testData } from '../utils/testData';
import { allure } from 'allure-playwright';

/**
 * NOTE:
 * - Steps use `this` as UIWorld instance provided by ui-fixtures createBdd.
 * - Use this.loginPage / this.dashboardPage / this.page etc.
 */

/* Given I am on the login page */
Given('I am on the login page', async function (this: UIWorld) {
  await allure.step('Navigate to login page', async () => {
    logger.info(`🌐 Navigating to: ${config.baseUrl}`);
    await this.loginPage.navigate();

    // Attach URL and screenshot to report
    await this.page.screenshot({
      path: `./test-results/login-page-${Date.now()}.png`,
    });
    await allure.attachment('Login Page URL', this.page.url(), 'text/plain');

    logger.info(`✅ Login page loaded. URL: ${this.page.url()}`);
  });
});

/* When I enter {string} as username */
When('I enter {string} as username', async function (this: UIWorld, username: string) {
  await allure.step(`Enter username: ${username}`, async () => {
    let finalUsername = username;
    if (username === '<ENV_USER>' || username === 'ENV_USER') {
      finalUsername = config.testUser;
    }
    logger.info(`👤 Entering username: "${finalUsername}" (from: "${username}")`);
    await this.loginPage.enterUsername(finalUsername);

    await allure.parameter('Username', finalUsername);
    logger.info(`✅ Username entered successfully`);
  });
});

/* When I enter {string} as password */
When('I enter {string} as password', async function (this: UIWorld, password: string) {
  await allure.step(`Enter password`, async () => {
    let finalPassword = password;
    if (password === '<ENV_PASS>' || password === 'ENV_PASS') {
      finalPassword = config.testPassword;
    }
    logger.info(`🔒 Entering password: "${finalPassword ? '***' : '(empty)'}" (from: "${password}")`);
    await this.loginPage.enterPassword(finalPassword);

    await allure.parameter('Password', '***');
    logger.info(`✅ Password entered successfully`);
  });
});

/* When I click on the login button */
When('I click on the login button', async function (this: UIWorld) {
  await allure.step('Click login button and wait for navigation', async () => {
    logger.info(`🔐 Clicking login button...`);

    // Use Promise.all to wait for navigation triggered by submit
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => undefined),
      this.loginPage.submit(),
    ]);

    logger.info(`✅ Login submitted. New URL: ${this.page.url()}`);
    await allure.attachment('Post-Login URL', this.page.url(), 'text/plain');
  });
});

/* Then I should be redirected to the dashboard */
Then('I should be redirected to the dashboard', async function (this: UIWorld) {
  await allure.step('Verify successful login and dashboard redirect', async () => {
    const currentUrl = this.page.url();
    logger.info(`📍 Current URL: ${currentUrl}`);
    await allure.attachment('Current URL', currentUrl, 'text/plain');

    // Detect if still on login page by known login path fragment
    const isStillOnLoginPage = currentUrl.includes('/auth/login') || currentUrl.includes('/login');
    logger.info(`🔐 Still on login page: ${isStillOnLoginPage}`);

    // Check for error message that indicates login failed
    // Consistent selector used: '.oxd-alert-content-text' (update if your app uses different one)
    const errorElement = this.page.locator('.oxd-alert-content-text').first();
    const hasErrorMessage = await errorElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasErrorMessage) {
      const errorText = await errorElement.textContent();
      logger.error(`❌ Login failed with error: "${errorText}"`);
      await allure.attachment('Login Error', errorText || 'Unknown error', 'text/plain');

      const screenshot = await this.page.screenshot({ fullPage: true });
      await allure.attachment('Login Error Screenshot', screenshot, 'image/png');
    } else {
      logger.info(`✅ No error message present`);
    }

    // Additional check: dashboard visible using dashboard page object
    let dashboardVisible = false;
    try {
      dashboardVisible = await this.dashboardPage.isVisible();
      logger.info(`📊 Dashboard visible by page object: ${dashboardVisible}`);
    } catch (e) {
      logger.warn(`Could not verify dashboard visibility via page object: ${e}`);
    }

    // Main assertions
    expect(hasErrorMessage, 'Login should not show error message').toBe(false);
    expect(isStillOnLoginPage, `Should be redirected away from login page. Current URL: ${currentUrl}`).toBe(false);
    expect(dashboardVisible, 'Dashboard should be visible after successful login').toBe(true);

    logger.info(`✅ Successfully redirected to dashboard`);

    // Capture success screenshot
    const screenshot = await this.page.screenshot({ fullPage: true });
    await allure.attachment('Dashboard View', screenshot, 'image/png');
  });
});

/* Then I should see an error message {string} */
Then('I should see an error message {string}', async function (this: UIWorld, expectedMessage: string) {
  await allure.step(`Verify error message: "${expectedMessage}"`, async () => {
    try {
      // Use loginPage helper to fetch error text (keeps selectors centralized)
      const actualMessage = await this.loginPage.getErrorMessage();
      const expected = expectedMessage || testData.login.messages.error;

      logger.info(`❌ Error message found: "${actualMessage}"`);
      logger.info(`🔍 Expecting: "${expected}"`);

      await allure.parameter('Expected Message', expected);
      await allure.parameter('Actual Message', actualMessage);

      expect(actualMessage).toContain(expected);

      const screenshot = await this.page.screenshot({ fullPage: true });
      await allure.attachment('Error Message Display', screenshot, 'image/png');

      logger.info(`✅ Error message assertion passed`);
    } catch (error) {
      logger.error(`❌ Error message assertion failed: ${error}`);
      logger.error(`📍 Current URL: ${this.page.url()}`);

      const screenshot = await this.page.screenshot({ fullPage: true });
      await allure.attachment('Error Assertion Failure', screenshot, 'image/png');

      throw error;
    }
  });
});
