'use strict';

const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const APIUtility = require('../Utils/APIUtility');

When(
  'User sends {string} request to {string} with headers {string} and query file {string} and body file {string}',
  async function (method, url, headersName, queryFileName, bodyFileName) {
    let apiUtility = this.scenarioContext.get('apiUtility');
    if (!apiUtility) {
      const apiRequestContext = this.apiRequestContext;
      apiUtility = new APIUtility(apiRequestContext);
      this.scenarioContext.set('apiUtility', apiUtility);
    }

    await apiUtility.sendRequest({
      method,
      url,
      headersName,
      queryFileName,
      bodyFileName,
    });
  }
);

Then('User verifies the response status code is {int}', async function (expectedStatusCode) {
  const apiUtility = this.scenarioContext.get('apiUtility');
  const actualStatusCode = apiUtility.getStatus();
  expect(actualStatusCode).toBe(expectedStatusCode);
});

Then('User verifies the response body matches JSON schema {string}', async function (schemaFileName) {
  if (!schemaFileName || schemaFileName === 'NA') return;
  const apiUtility = this.scenarioContext.get('apiUtility');
  await apiUtility.validateSchemaFile(schemaFileName);
});

Then('User verifies fields in response: {string} with content type {string}', async function (fieldsString, contentType) {
  if (!fieldsString || fieldsString === 'NA') return;
  const apiUtility = this.scenarioContext.get('apiUtility');

  if (contentType.toLowerCase().includes('text')) {
    const rawText = await apiUtility.getText();
    expect(rawText).toContain(fieldsString);
  } else {
    const jsonBody = await apiUtility.getJson();
    if (fieldsString.includes('=')) {
      const [key, val] = fieldsString.split('=').map(s => s.trim());
      expect(String(jsonBody[key])).toBe(val);
    } else {
      expect(JSON.stringify(jsonBody)).toContain(fieldsString);
    }
  }
});
