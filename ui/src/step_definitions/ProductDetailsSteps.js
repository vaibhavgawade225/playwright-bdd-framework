'use strict';

const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('product detail page should display name {string} and price {string}', async function (expectedName, expectedPrice) {
  const detailsPage = this.scenarioContext.getPageObject('productDetailsPage');
  const title = await detailsPage.getTitle();
  const price = await detailsPage.getPrice();
  expect(title).toBe(expectedName);
  expect(price).toBe(expectedPrice);
});

When('user adds product to cart from details page', async function () {
  const detailsPage = this.scenarioContext.getPageObject('productDetailsPage');
  await detailsPage.addToCart();
});

When('user clicks back to products', async function () {
  const detailsPage = this.scenarioContext.getPageObject('productDetailsPage');
  await detailsPage.backToProducts();
});
