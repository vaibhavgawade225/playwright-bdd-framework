'use strict';

const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('user proceeds to checkout', async function () {
  const cartPage = this.scenarioContext.getPageObject('cartPage');
  await cartPage.proceedToCheckout();
});

When(
  'user fills checkout information with first name {string}, last name {string}, and postal code {string}',
  async function (firstName, lastName, postalCode) {
    const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
    await checkoutPage.fillInformation(firstName, lastName, postalCode);
    await checkoutPage.clickContinue();
  }
);

When('user clicks continue without filling checkout information', async function () {
  const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
  await checkoutPage.clickContinue();
});

When('user cancels the checkout', async function () {
  const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
  await checkoutPage.clickCancel();
});

When('user completes the checkout order', async function () {
  const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
  await checkoutPage.clickFinish();
});

Then('order completion header should display {string}', async function (expectedHeader) {
  const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
  const headerText = await checkoutPage.getCompleteHeader();
  expect(headerText).toBe(expectedHeader);
});

Then('user should see checkout error message containing {string}', async function (expectedError) {
  const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
  const actualError = await checkoutPage.getErrorMessage();
  expect(actualError).toContain(expectedError);
});

Then('checkout price summary total should equal item total plus tax', async function () {
  const checkoutPage = this.scenarioContext.getPageObject('checkoutPage');
  const subtotal = await checkoutPage.getSubtotal();
  const tax = await checkoutPage.getTax();
  const total = await checkoutPage.getTotal();
  const expectedTotal = parseFloat((subtotal + tax).toFixed(2));
  expect(total).toBe(expectedTotal);
});
