import { test, expect } from '@playwright/test';
import { logger } from '../../src/utils/logger';
import { testData } from '../../src/utils/testData';
import { config } from '../../src/config/config';

test.describe('@web @sanity @critical Login Functionality', () => {
  test('@smoke @positive Successful login with valid credentials', async ({ page }) => {
    // Given I am on the login page
    logger.info(`🌐 Navigating to: ${config.baseUrl}`);
    await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded' });
    logger.info(`✅ Login page loaded. URL: ${page.url()}`);

    // When I enter username
    logger.info(`👤 Entering username: "${config.testUser}"`);
    await page.fill('#username', config.testUser);

    // And I enter password
    logger.info(`🔒 Entering password: "***"`);
    await page.fill('#password', config.testPassword);

    // And I click on the login button
    logger.info(`🔐 Clicking login button...`);
    await page.click('#submit');

    // Then I should see success page
    await page.waitForURL('**/logged-in-successfully', { timeout: 10000 }).catch(() => {
      logger.warn('URL redirect timeout - checking page content');
    });
    const finalUrl = page.url();
    logger.info(`✅ Final URL: ${finalUrl}`);

    const isOnSuccessPage = finalUrl.includes('/logged-in-successfully');
    const pageContent = await page.content();
    const hasSuccessMessage = pageContent.toLowerCase().includes('congratulations') || pageContent.toLowerCase().includes('successfully logged in');

    expect(isOnSuccessPage || hasSuccessMessage, 'Should be on success page or see success message').toBeTruthy();
    logger.info(`✅ Successfully logged in`);
  });

  test('@regression @negative Unsuccessful login with invalid credentials', async ({ page }) => {
    // Given I am on the login page
    logger.info(`🌐 Navigating to: ${config.baseUrl}`);
    await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded' });
    logger.info(`✅ Login page loaded. URL: ${page.url()}`);

    // When I enter invalid username
    logger.info(`👤 Entering username: "invalidUser"`);
    await page.fill('#username', 'invalidUser');

    // And I enter correct password
    logger.info(`🔒 Entering password: "***"`);
    await page.fill('#password', 'Password123');

    // And I click on the login button
    logger.info(`🔐 Clicking login button...`);
    await page.click('#submit');
    await page.waitForTimeout(2000);
    logger.info(`✅ Login submitted. New URL: ${page.url()}`);

    // Then I should see an error message
    const errorMsg = page.locator('#error');
    const isErrorVisible = await errorMsg.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isErrorVisible, 'Error message should be visible').toBeTruthy();

    const actualMessage = await errorMsg.textContent();
    const expectedError = 'Your username is invalid';
    logger.info(`❌ Error message found: "${actualMessage}"`);
    logger.info(`🔍 Expecting: "${expectedError}"`);
    expect(actualMessage?.toLowerCase()).toContain(expectedError.toLowerCase());
  });
});
