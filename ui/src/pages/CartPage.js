'use strict';

const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async isLoaded() {
    const title = await this.getText('pageTitle');
    return title.toLowerCase().includes('cart');
  }

  async getCartItemNames() {
    return this.loc('cartItemName').allTextContents();
  }

  async removeItemByName(itemName) {
    const itemContainer = this.loc('cartItem').filter({
      has: this.page.locator(this.locators.cartItemName, { hasText: itemName }),
    });
    await itemContainer.locator(this.locators.removeButton).click();
  }

  async proceedToCheckout() {
    await this.safeClick('checkoutButton');
  }

  async continueShopping() {
    await this.safeClick('continueShoppingButton');
  }
}

module.exports = CartPage;
