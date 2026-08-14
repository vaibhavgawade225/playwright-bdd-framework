'use strict';

const ConfigManager = require('../utils/ConfigManager');

class BasePage {
  constructor(page) {
    this.page = page;
    this.timeout = ConfigManager.getDefaultTimeout();
    this.locators = require(`../locators/${this.constructor.name}.json`);
  }

  loc(key) {
    const selector = this.locators[key];
    if (!selector) throw new Error(`Locator "${key}" not found in ${this.constructor.name}.json`);
    return this.page.locator(selector);
  }

  async highlight(key, { index = 0, color = 'red', borderSize = '3px' } = {}) {
    if (!ConfigManager.isHighlightElement() || !this.page) return;
    try {
      const el = this.loc(key).nth(index);
      await el.evaluate((node, { color, borderSize }) => {
        node.style.border = `${borderSize} solid ${color}`;
        node.style.boxShadow = `0 0 10px ${color}`;
      }, { color, borderSize });
    } catch (_) {
    }
  }

  async safeClick(key, { index = 0 } = {}) {
    const el = this.loc(key).nth(index);
    await el.waitFor({ state: 'visible', timeout: this.timeout });
    await this.highlight(key, { index });
    await el.click();
  }

  async safeFill(key, value, { index = 0 } = {}) {
    const el = this.loc(key).nth(index);
    await el.waitFor({ state: 'visible', timeout: this.timeout });
    await this.highlight(key, { index });
    await el.fill(value);
  }

  async getText(key, { index = 0 } = {}) {
    const el = this.loc(key).nth(index);
    await el.waitFor({ state: 'visible', timeout: this.timeout });
    await this.highlight(key, { index });
    return ((await el.textContent()) || '').trim();
  }

  async waitForCondition(conditionFn, { timeout = this.timeout, interval = 250, message = 'Condition not met in time' } = {}) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const result = await conditionFn();
      if (result) return result;
      await this.page.waitForTimeout(interval);
    }
    throw new Error(message);
  }
}

module.exports = BasePage;
