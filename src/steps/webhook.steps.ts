import { Given, When, Then, ApiWorld } from '../support/api-fixtures';
import { APIResponse, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

Given('the API is up and running', async function (this: ApiWorld) {
  const response = await this.request.get(process.env.BASE_URL!);
  this.response = { status: response.status() };
  expect(response.ok()).toBeTruthy();
});

When('I send a POST request to the hooks endpoint', async function (this: ApiWorld) {
  const url = process.env.BASE_URL! + process.env.POST_ENDPOINT!;
  const response = await this.request.post(url, { data: {} });
  this.response = { status: response.status() };
  if (response.ok()) {
    this.response.data = await response.json();
  }
});

When('I send a GET request to the hooks endpoint', async function (this: ApiWorld) {
  const url = process.env.BASE_URL! + process.env.GET_ENDPOINT!;
  const response = await this.request.get(url);
  this.response = { status: response.status() };

  if (response.ok()) {
    const responseBody = await response.json();
    this.response.data = responseBody;
    if (responseBody.data && Array.isArray(responseBody.data) && responseBody.data.length > 0) {
      this.hookId = responseBody.data[0].id;
    }
  }
});

When('I send a PUT request to the projects endpoint', async function (this: ApiWorld) {
  const testDataPath = path.resolve(__dirname, '../../testData/apiTestData.json');
  const apiTestData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
  const url = process.env.BASE_URL! + process.env.PUT_ENDPOINT!;
  const response = await this.request.put(url, {
    headers: apiTestData.putRequest.headers,
    data: apiTestData.putRequest.body,
  });
  this.response = { status: response.status() };
  if (response.ok()) {
    this.response.data = await response.json();
  }
});

When('I send a DELETE request to the hook', async function (this: ApiWorld) {
  let hookId = this.hookId;
  if (!hookId) {
    const testDataPath = path.resolve(__dirname, '../../testData/apiTestData.json');
    const apiTestData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
    hookId = apiTestData.deleteRequest.id;
  }
  const endpoint = process.env.DELETE_ENDPOINT!.replace('{hook_id}', hookId!);
  const url = process.env.BASE_URL! + endpoint;
  const response = await this.request.delete(url);
  this.response = { status: response.status() };
});

Then('the response status code should be {int}', async function (this: ApiWorld, statusCode: number) {
  expect(this.response.status).toBe(statusCode);
});
