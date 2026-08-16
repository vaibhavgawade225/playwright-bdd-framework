'use strict';

const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('user removes product {string} from the cart', async function (itemName) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.removeItemByName(itemName);
});

When('user sorts products by {string}', async function (sortOption) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.sortBy(sortOption);
});

Then('products should be ordered by price {string}', async function (order) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  const prices = await inventoryPage.getItemPrices();
  const sortedPrices = [...prices].sort((a, b) => (order === 'ascending' ? a - b : b - a));
  expect(prices).toEqual(sortedPrices);
});

Then('products should be ordered by name {string}', async function (order) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  const names = await inventoryPage.getItemNames();
  const sortedNames = [...names].sort((a, b) => (order === 'ascending' ? a.localeCompare(b) : b.localeCompare(a)));
  expect(names).toEqual(sortedNames);
});

When('user clicks on product {string}', async function (itemName) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.clickProductByName(itemName);
});

When('user adds all available products to cart', async function () {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.addAllItemsToCart();
});

When('user navigates to the shopping cart', async function () {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  await inventoryPage.openCart();
});

When('user clicks continue shopping on cart page', async function () {
  const cartPage = this.scenarioContext.getPageObject('cartPage');
  await cartPage.continueShopping();
});

Then('the footer should contain visible {string} social link', async function (platform) {
  const inventoryPage = this.scenarioContext.getPageObject('inventoryPage');
  const isVisible = await inventoryPage.isSocialLinkVisible(platform);
  expect(isVisible).toBe(true);
});
