import { Given, When, Then, ApiWorld } from '../support/api-fixtures';
import { APIResponse, expect } from '@playwright/test';
const apiData = require('../../testData/apiTestData.json');

Given('the API is up and running', async function (this: ApiWorld) {
  const url = process.env.API_BASE_URL!;
  console.log(`[API] Sending GET request to: ${url}`);
  const response = await this.request.get(url);
  console.log(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
  expect(response.ok()).toBeTruthy();
});

When('I send a POST request to the hooks endpoint', async function (this: ApiWorld) {
  const url = process.env.API_BASE_URL! + apiData.endpoints.postEndpoint;
  console.log(`[API] Sending POST request to: ${url}`);
  const response = await this.request.post(url, { data: {} });
  console.log(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
  if (response.ok()) {
    this.response.data = await response.json();
    console.log(`[API] Response body: ${JSON.stringify(this.response.data)}`);
  }
});

When('I send a GET request to the hooks endpoint', async function (this: ApiWorld) {
  const url = process.env.API_BASE_URL! + apiData.endpoints.getEndpoint;
  console.log(`[API] Sending GET request to: ${url}`);
  const response = await this.request.get(url);
  console.log(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };

  if (response.ok()) {
    const responseBody = await response.json();
    console.log(`[API] Response body: ${JSON.stringify(responseBody)}`);
    this.response.data = responseBody;
    if (responseBody.data && Array.isArray(responseBody.data) && responseBody.data.length > 0) {
      this.hookId = responseBody.data[0].id;
      console.log(`[API] Captured hookId: ${this.hookId}`);
    }
  }
});

When('I send a PUT request to the projects endpoint', async function (this: ApiWorld) {
  const url = process.env.API_BASE_URL! + apiData.endpoints.putEndpoint;
  console.log(`[API] Sending PUT request to: ${url}`);
  console.log(`[API] Request body: ${JSON.stringify(apiData.putRequest.body)}`);
  const response = await this.request.put(url, {
    headers: apiData.putRequest.headers,
    data: apiData.putRequest.body,
  });
  console.log(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
  if (response.ok()) {
    this.response.data = await response.json();
    console.log(`[API] Response body: ${JSON.stringify(this.response.data)}`);
  }
});

When('I send a DELETE request to the hook', async function (this: ApiWorld) {
  let hookId = this.hookId;
  if (!hookId) {
    hookId = apiData.deleteRequest.id;
  }
  const endpoint = apiData.endpoints.deleteEndpoint.replace('{hook_id}', hookId!);
  const url = process.env.API_BASE_URL! + endpoint;
  console.log(`[API] Sending DELETE request to: ${url}`);
  const response = await this.request.delete(url);
  console.log(`[API] Response status: ${response.status()}`);
  this.response = { status: response.status() };
});

Then('the response status code should be {int}', async function (this: ApiWorld, statusCode: number) {
  expect(this.response.status).toBe(statusCode);
});
