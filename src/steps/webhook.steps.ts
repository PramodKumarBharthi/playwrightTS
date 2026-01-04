import { Given, When, Then, ApiWorld } from '../support/api-fixtures';
import { APIResponse, expect } from '@playwright/test';
import { config } from '../config/config';
import { logger } from '../utils/logger';
const apiData = require('../../testData/apiTestData.json');

Given('the API is up and running', async function (this: ApiWorld) {
  const url = config.apiBaseUrl;
  logger.info(`[API] Sending GET request to: ${url}`);
  const response = await this.request.get(url);
  logger.info(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
  expect(response.ok()).toBeTruthy();
});

When('I send a POST request to the hooks endpoint', async function (this: ApiWorld) {
  const url = config.apiBaseUrl + apiData.endpoints.postEndpoint;
  logger.info(`[API] Sending POST request to: ${url}`);
  const response = await this.request.post(url, { data: {} });
  logger.info(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
  if (response.ok()) {
    this.response.data = await response.json();
    logger.info(`[API] Response body: ${JSON.stringify(this.response.data)}`);
  }
});

When('I send a GET request to the hooks endpoint', async function (this: ApiWorld) {
  const url = config.apiBaseUrl + apiData.endpoints.getEndpoint;
  logger.info(`[API] Sending GET request to: ${url}`);
  const response = await this.request.get(url);
  logger.info(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };

  if (response.ok()) {
    const responseBody = await response.json();
    logger.info(`[API] Response body: ${JSON.stringify(responseBody)}`);
    this.response.data = responseBody;
    if (responseBody.data && Array.isArray(responseBody.data) && responseBody.data.length > 0) {
      this.hookId = responseBody.data[0].id;
      logger.info(`[API] Captured hookId: ${this.hookId}`);
    }
  }
});

When('I send a PUT request to the projects endpoint', async function (this: ApiWorld) {
  const url = config.apiBaseUrl + apiData.endpoints.putEndpoint;
  logger.info(`[API] Sending PUT request to: ${url}`);
  logger.info(`[API] Request body: ${JSON.stringify(apiData.putRequest.body)}`);
  const response = await this.request.put(url, {
    headers: apiData.putRequest.headers,
    data: apiData.putRequest.body,
  });
  logger.info(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
  if (response.ok()) {
    this.response.data = await response.json();
    logger.info(`[API] Response body: ${JSON.stringify(this.response.data)}`);
  }
});

When('I send a DELETE request to the hook', async function (this: ApiWorld) {
  let hookId = this.hookId;
  if (!hookId) {
    hookId = apiData.deleteRequest.id;
  }
  const endpoint = apiData.endpoints.deleteEndpoint.replace('{hook_id}', hookId!);
  const url = config.apiBaseUrl + endpoint;
  logger.info(`[API] Sending DELETE request to: ${url}`);
  const response = await this.request.delete(url);
  logger.info(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
});

Then('the response status code should be {int}', async function (this: ApiWorld, statusCode: number) {
  expect(this.response.status).toBe(statusCode);
});
