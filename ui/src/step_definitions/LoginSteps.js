'use strict';

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('user opens the login page', async function () {
  const loginPage = this.scenarioContext.getPageObject('loginPage');
  await loginPage.open();
});

Given('user logs in as {string}', async function (role) {
  const loginPage = this.scenarioContext.getPageObject('loginPage');
  await loginPage.loginAs(role);
});

When('user enters username {string} and password {string}', async function (username, password) {
  const loginPage = this.scenarioContext.getPageObject('loginPage');
  await loginPage.safeFill('usernameInput', username);
  await loginPage.safeFill('passwordInput', password);
  await loginPage.safeClick('loginButton');
});

Then('the products page should be visible', async function () {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.page.waitForURL(/inventory.html/);
  const title = await inventoryPage.getText('pageTitle');
  expect(title).toBe('Products');
});

When('user adds {string} to the cart', async function (itemName) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.addItemToCartByName(itemName);
});

Then('the cart badge count should be {string}', async function (expectedCount) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  const count = await inventoryPage.getCartCount();
  expect(count).toBe(expectedCount);
});

Then('user should see login error message containing {string}', async function (expectedMessage) {
  const loginPage = this.scenarioContext.getPageObject('loginPage');
  const error = await loginPage.getErrorMessage();
  expect(error).toContain(expectedMessage);
});

When('user opens side menu and clicks logout', async function () {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.logout();
});

When('user opens side menu and clicks reset app state', async function () {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.resetAppState();
});

Then('user should be redirected to the login page', async function () {
  const loginPage = this.scenarioContext.getPageObject('loginPage');
  await loginPage.page.waitForURL(/saucedemo.com\/?$/);
  const loginBtn = loginPage.loc('loginButton');
  await expect(loginBtn).toBeVisible();
});
