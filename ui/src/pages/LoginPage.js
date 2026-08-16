'use strict';

const BasePage = require('./BasePage');
const ConfigManager = require('../utils/ConfigManager');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async open() {
    await this.page.goto('/');
  }

  async loginAs(role) {
    const { username, password } = ConfigManager.getUserCredentials(role);
    await this.safeFill('usernameInput', username);
    await this.safeFill('passwordInput', password);
    await this.safeClick('loginButton');
  }

  async getErrorMessage() {
    return this.getText('errorMessage');
  }
}

module.exports = LoginPage;
