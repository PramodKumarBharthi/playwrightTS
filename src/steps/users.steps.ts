import { Given, When, Then } from '../support/api-fixtures';
import { expect } from '@playwright/test';
import { user } from '../../src/api/models/userModel';
import { ApiWorld } from '../support/world';

Given('I have the user data', async function (this: ApiWorld) {
  this.requestBody = user;
});

When('I send a POST request to {string}', async function (this: ApiWorld, endpoint: string) {
  this.response = await this.userClient.createUser(endpoint, this.requestBody);
});

Then('the response status should be {int}', async function (this: ApiWorld, status: number) {
  expect(this.response.status).toBe(status);
});

Then('the response should contain the created user data', async function (this: ApiWorld) {
  const responseBody = this.response.data;
  expect(responseBody.name).toBe(this.requestBody.name);
  expect(responseBody.email).toBe(this.requestBody.email);
});

Given('a user with ID {string} exists', async function (this: ApiWorld, userId: string) {
  this.userId = userId;
});

When('I send a GET request to {string}', async function (this: ApiWorld, endpoint: string) {
  this.response = await this.userClient.getUser(endpoint);
});

Then('the response should contain the user data', async function (this: ApiWorld) {
  const responseBody = this.response.data;
  // A more robust check would be to compare against expected data from a test data source
  expect(responseBody).toHaveProperty('id');
  expect(responseBody).toHaveProperty('name');
  expect(responseBody).toHaveProperty('email');
});

Given('I have the updated user data', async function (this: ApiWorld) {
  this.requestBody = { ...user, name: 'Jane Doe' };
});

When('I send a PUT request to {string}', async function (this: ApiWorld, endpoint: string) {
  this.response = await this.userClient.updateUser(endpoint, this.requestBody);
});

Then('the response should contain the updated user data', async function (this: ApiWorld) {
  const responseBody = this.response.data;
  expect(responseBody.name).toBe(this.requestBody.name);
});

When('I send a DELETE request to {string}', async function (this: ApiWorld, endpoint: string) {
  this.response = await this.userClient.deleteUser(endpoint);
});

Then('the user should no longer exist', async function (this: ApiWorld) {
  const response = await this.userClient.getUser(`/api/users/${this.userId}`);
  expect(response.status).toBe(404);
});
