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
    // Practice Test Automation uses id="username"
    await this.loginPage.fill('#username', finalUsername);

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
    // Practice Test Automation uses id="password"
    await this.loginPage.fill('#password', finalPassword);

    await allure.parameter('Password', '***');
    logger.info(`✅ Password entered successfully`);
  });
});

/* When I click on the login button */
When('I click on the login button', async function (this: UIWorld) {
  await allure.step('Click login button and wait for navigation', async () => {
    logger.info(`🔐 Clicking login button...`);

    // Relax navigation wait - ignore failures and continue
    try {
      await Promise.race([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => undefined),
        new Promise(resolve => setTimeout(resolve, 10000)), // Fallback timeout
      ]);
    } catch (error) {
      logger.warn(`Navigation warning: ${error}`);
    }
    
    // Practice Test Automation uses id="submit"
    await this.loginPage.click('#submit');
    logger.info(`✅ Login submitted. New URL: ${this.page.url()}`);
    await allure.attachment('Post-Login URL', this.page.url(), 'text/plain');
  });
});

/* Then I should be redirected to the dashboard */
Then('I should be redirected to the dashboard', async function (this: UIWorld) {
  await allure.step('Verify successful login and redirect', async () => {
    // Wait for redirect to success page
    await this.page.waitForURL('**/logged-in-successfully', { timeout: 10000 }).catch(() => {
      logger.warn('URL redirect timeout - checking page content instead');
    });

    const currentUrl = this.page.url();
    logger.info(`📍 Current URL: ${currentUrl}`);
    await allure.attachment('Current URL', currentUrl, 'text/plain');

    // Practice Test Automation redirects to /logged-in-successfully/ on success
    const isOnSuccessPage = currentUrl.includes('/logged-in-successfully');
    logger.info(`✅ On success page: ${isOnSuccessPage}`);

    // Also check for success message on page
    const pageContent = await this.page.content();
    const hasSuccessMessage = pageContent.toLowerCase().includes('Congratulations') || pageContent.toLowerCase().includes('successfully logged in');
    logger.info(`✅ Has success message: ${hasSuccessMessage}`);

    expect(isOnSuccessPage || hasSuccessMessage, 'Should be on success page or see success message').toBeTruthy();

    const screenshot = await this.page.screenshot({ fullPage: true });
    await allure.attachment('Success Page', screenshot, 'image/png');
  });
});

/* Then I should see an error message {string} */
Then('I should see an error message {string}', async function (this: UIWorld, expectedMessage: string) {
  await allure.step(`Verify error message: "${expectedMessage}"`, async () => {
    try {
      // Practice Test Automation displays error messages in #error div
      const errorElement = this.page.locator('#error');
      const hasError = await errorElement.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasError) {
        const actualMessage = await errorElement.textContent();
        logger.info(`❌ Error message found: "${actualMessage}"`);
        logger.info(`🔍 Expecting message containing: "${expectedMessage}"`);

        await allure.parameter('Expected Pattern', expectedMessage);
        await allure.parameter('Actual Message', actualMessage || '(empty)');

        expect(actualMessage?.toLowerCase()).toContain(expectedMessage.toLowerCase());

        const screenshot = await this.page.screenshot({ fullPage: true });
        await allure.attachment('Error Message Display', screenshot, 'image/png');

        logger.info(`✅ Error message assertion passed`);
      } else {
        logger.error('❌ No error message displayed when one was expected');
        throw new Error(`Expected error message "${expectedMessage}" but none was shown`);
      }
    } catch (error) {
      logger.error(`❌ Error message assertion failed: ${error}`);
      logger.error(`📍 Current URL: ${this.page.url()}`);

      const screenshot = await this.page.screenshot({ fullPage: true });
      await allure.attachment('Error Assertion Failure', screenshot, 'image/png');

      throw error;
    }
  });
});
