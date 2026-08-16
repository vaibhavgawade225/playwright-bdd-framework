'use strict';

const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async isLoaded() {
    const title = await this.getText('pageTitle');
    return title.toLowerCase() === 'products';
  }

  async addItemToCartByName(itemName) {
    const itemContainer = this.loc('inventoryItem').filter({
      has: this.page.locator(this.locators.inventoryItemName, { hasText: itemName }),
    });
    await itemContainer.locator(this.locators.addToCartButton).click();
  }

  async removeItemByName(itemName) {
    const itemContainer = this.loc('inventoryItem').filter({
      has: this.page.locator(this.locators.inventoryItemName, { hasText: itemName }),
    });
    await itemContainer.locator(this.locators.removeButton).click();
  }

  async addAllItemsToCart() {
    const count = await this.loc('addToCartButton').count();
    for (let i = 0; i < count; i++) {
      await this.loc('addToCartButton').nth(0).click();
    }
  }

  async clickProductByName(itemName) {
    await this.loc('inventoryItemName').filter({ hasText: itemName }).click();
  }

  async getCartCount() {
    const badge = this.loc('cartBadge');
    if ((await badge.count()) === 0) return '0';
    return (await badge.textContent()).trim();
  }

  async sortBy(optionValue) {
    await this.loc('sortSelect').selectOption(optionValue);
  }

  async getItemPrices() {
    const priceTexts = await this.loc('inventoryItemPrice').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async getItemNames() {
    return this.loc('inventoryItemName').allTextContents();
  }

  async openCart() {
    await this.safeClick('cartLink');
  }

  async openMenu() {
    await this.safeClick('menuButton');
  }

  async logout() {
    await this.openMenu();
    await this.safeClick('logoutLink');
  }

  async resetAppState() {
    await this.openMenu();
    await this.safeClick('resetAppStateLink');
  }

  async isSocialLinkVisible(platform) {
    const locatorKey = `${platform.toLowerCase()}Link`;
    return this.loc(locatorKey).isVisible();
  }
}

module.exports = InventoryPage;
