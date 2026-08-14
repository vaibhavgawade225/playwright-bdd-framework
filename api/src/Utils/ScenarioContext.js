'use strict';

class ScenarioContext {
  constructor({ page = null, apiClient = null } = {}) {
    this.page = page;
    this.apiClient = apiClient;
    this._pageObjects = new Map();
    this._data = new Map();
  }

  getPageObject(name) {
    if (!this.page) {
      throw new Error(`getPageObject("${name}") called but no browser page exists. Tag the scenario with @ui.`);
    }
    if (this._pageObjects.has(name)) {
      return this._pageObjects.get(name);
    }
    const PageObjectClass = require('../../../ui/src/pages/pageObjectRegistry')[name];
    if (!PageObjectClass) {
      throw new Error(`No page object registered under name "${name}". Check ui/src/pages/pageObjectRegistry.js`);
    }
    const instance = new PageObjectClass(this.page);
    instance._scenarioContext = this;
    this._pageObjects.set(name, instance);
    return instance;
  }

  getApiClient() {
    if (!this.apiClient) {
      throw new Error('getApiClient() called but no API request context exists. Tag the scenario with @api.');
    }
    return this.apiClient;
  }

  set(key, value) {
    this._data.set(key, value);
  }

  get(key) {
    return this._data.get(key);
  }

  has(key) {
    return this._data.has(key);
  }

  clear() {
    this._pageObjects.clear();
    this._data.clear();
  }
}

module.exports = ScenarioContext;
