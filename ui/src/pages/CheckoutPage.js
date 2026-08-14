'use strict';

const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async fillInformation(firstName, lastName, postalCode) {
    if (firstName) await this.safeFill('firstNameInput', firstName);
    if (lastName) await this.safeFill('lastNameInput', lastName);
    if (postalCode) await this.safeFill('postalCodeInput', postalCode);
  }

  async clickContinue() {
    await this.safeClick('continueButton');
  }

  async clickFinish() {
    await this.safeClick('finishButton');
  }

  async clickCancel() {
    await this.safeClick('cancelButton');
  }

  async getCompleteHeader() {
    return this.getText('completeHeader');
  }

  async getErrorMessage() {
    return this.getText('errorMessage');
  }

  async getSubtotal() {
    const text = await this.getText('subtotalLabel');
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTax() {
    const text = await this.getText('taxLabel');
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotal() {
    const text = await this.getText('totalLabel');
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}

module.exports = CheckoutPage;
