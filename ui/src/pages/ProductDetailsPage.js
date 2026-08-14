'use strict';

const BasePage = require('./BasePage');

class ProductDetailsPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async getTitle() {
    return this.getText('productTitle');
  }

  async getPrice() {
    return this.getText('productPrice');
  }

  async getDescription() {
    return this.getText('productDesc');
  }

  async addToCart() {
    await this.safeClick('addToCartButton');
  }

  async removeFromCart() {
    await this.safeClick('removeButton');
  }

  async backToProducts() {
    await this.safeClick('backToProductsButton');
  }
}

module.exports = ProductDetailsPage;
