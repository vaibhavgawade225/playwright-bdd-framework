'use strict';

const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const schemas = {
  user: require('../resources/Schema/userSchema.json'),
  userList: require('../resources/Schema/userListSchema.json'),
  post: require('../resources/Schema/postSchema.json'),
  postList: require('../resources/Schema/postListSchema.json'),
  comment: require('../resources/Schema/commentListSchema.json'),
  commentList: require('../resources/Schema/commentListSchema.json'),
  todo: require('../resources/Schema/todoSchema.json'),
  todoList: require('../resources/Schema/todoListSchema.json'),
};

When('I send a GET request to {string}', async function (endpoint) {
  const api = this.scenarioContext.getApiClient();
  await api.get(endpoint);
});

When('I send a POST request to {string} with body:', async function (endpoint, bodyString) {
  const api = this.scenarioContext.getApiClient();
  const payload = JSON.parse(bodyString);
  await api.post(endpoint, payload);
});

When('I send a PUT request to {string} with body:', async function (endpoint, bodyString) {
  const api = this.scenarioContext.getApiClient();
  const payload = JSON.parse(bodyString);
  await api.put(endpoint, payload);
});

When('I send a DELETE request to {string}', async function (endpoint) {
  const api = this.scenarioContext.getApiClient();
  await api.delete(endpoint);
});

Then('the response status should be {int}', async function (expectedStatus) {
  const api = this.scenarioContext.getApiClient();
  expect(api.getStatus()).toBe(expectedStatus);
});

Then('the response should match the {string} schema', async function (schemaName) {
  const api = this.scenarioContext.getApiClient();
  const schema = schemas[schemaName];
  if (!schema) throw new Error(`No schema registered under name "${schemaName}"`);
  await api.validateSchema(schema);
});

Then('the response field {string} should equal {string}', async function (field, expectedValue) {
  const api = this.scenarioContext.getApiClient();
  const body = await api.getJson();
  const actualValue = body.data ? body.data[field] : body[field];
  expect(String(actualValue)).toBe(expectedValue);
});

Then('I store the response field {string} as {string}', async function (field, key) {
  const api = this.scenarioContext.getApiClient();
  const body = await api.getJson();
  this.scenarioContext.set(key, body.data ? body.data[field] : body[field]);
});
