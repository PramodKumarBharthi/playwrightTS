import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';
import { testData } from '../../src/utils/testData';
import { config } from '../../src/config/config';

test.describe('@web @sanity @critical Login Functionality', () => {
  test('@smoke @positive Successful login with valid credentials', async ({ page }) => {
    // Given I am on the login page
    logger.info(`🌐 Navigating to: ${config.baseUrl}`);
    await page.goto(config.baseUrl);
    logger.info(`✅ Login page loaded. URL: ${page.url()}`);

    // When I enter "<ENV_USER>" as username
    logger.info(`👤 Entering username: "${config.testUser}"`);
    await page.fill('input[name="username"]', config.testUser);

    // And I enter "<ENV_PASS>" as password
    logger.info(`🔒 Entering password: "***"`);
    await page.fill('input[name="password"]', config.testPassword);

    // And I click on the login button
    logger.info(`🔐 Clicking login button...`);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    logger.info(`✅ Login submitted. New URL: ${page.url()}`);

    // Then I should be redirected to the dashboard
    const currentUrl = page.url();
    logger.info(`📍 Current URL: ${currentUrl}`);

    const isStillOnLoginPage = currentUrl.includes('/auth/login');
    logger.info(`🔐 Still on login page: ${isStillOnLoginPage}`);

    const errorElement = page.locator('.oxd-alert-content-text').first();
    const hasErrorMessage = await errorElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasErrorMessage) {
      const errorText = await errorElement.textContent();
      logger.error(`❌ Login failed with error: "${errorText}"`);
    } else {
      logger.info(`✅ No error message present`);
    }

    expect(hasErrorMessage, 'Login should not show error message').toBeFalsy();
    expect(isStillOnLoginPage, `Should be redirected away from login page. Current URL: ${currentUrl}`).toBeFalsy();
    logger.info(`✅ Successfully redirected to dashboard`);
  });

  test('@regression @negative Unsuccessful login with invalid credentials', async ({ page }) => {
    // Given I am on the login page
    logger.info(`🌐 Navigating to: ${config.baseUrl}`);
    await page.goto(config.baseUrl);
    logger.info(`✅ Login page loaded. URL: ${page.url()}`);

    // When I enter "invalid@example.com" as username
    logger.info(`👤 Entering username: "invalid@example.com"`);
    await page.fill('input[name="username"]', 'invalid@example.com');

    // And I enter "wrongpassword" as password
    logger.info(`🔒 Entering password: "***"`);
    await page.fill('input[name="password"]', 'wrongpassword');

    // And I click on the login button
    logger.info(`🔐 Clicking login button...`);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    logger.info(`✅ Login submitted. New URL: ${page.url()}`);

    // Then I should see an error message "Invalid credentials"
    const errorElement = page.locator('.oxd-alert-content-text').first();
    const actualMessage = await errorElement.textContent();
    const expected = testData.login.messages.error;
    logger.info(`❌ Error message found: "${actualMessage}"`);
    logger.info(`🔍 Expecting: "${expected}"`);
    expect(actualMessage).toContain(expected);
  });
});
