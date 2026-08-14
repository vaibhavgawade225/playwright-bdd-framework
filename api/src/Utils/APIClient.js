'use strict';

const Ajv = require('ajv');
const ConfigManager = require('./ConfigManager');

const ajv = new Ajv({ allErrors: true, strict: false });

class APIClient {
  constructor(requestContext) {
    this.request = requestContext;
    this.lastResponse = null;
  }

  _cleanEndpoint(endpoint) {
    if (typeof endpoint === 'string' && endpoint.startsWith('/')) {
      return endpoint.substring(1);
    }
    return endpoint;
  }

  async get(endpoint, options = {}) {
    this.lastResponse = await this.request.get(this._cleanEndpoint(endpoint), options);
    return this.lastResponse;
  }

  async post(endpoint, data, options = {}) {
    this.lastResponse = await this.request.post(this._cleanEndpoint(endpoint), { data, ...options });
    return this.lastResponse;
  }

  async put(endpoint, data, options = {}) {
    this.lastResponse = await this.request.put(this._cleanEndpoint(endpoint), { data, ...options });
    return this.lastResponse;
  }

  async patch(endpoint, data, options = {}) {
    this.lastResponse = await this.request.patch(this._cleanEndpoint(endpoint), { data, ...options });
    return this.lastResponse;
  }

  async delete(endpoint, options = {}) {
    this.lastResponse = await this.request.delete(this._cleanEndpoint(endpoint), options);
    return this.lastResponse;
  }

  async getJson() {
    return this.lastResponse.json();
  }

  getStatus() {
    return this.lastResponse.status();
  }

  async validateSchema(schema) {
    const body = await this.getJson();
    const validate = ajv.compile(schema);
    const valid = validate(body);
    if (!valid) {
      throw new Error(`Schema validation failed:\n${JSON.stringify(validate.errors, null, 2)}`);
    }
    return true;
  }
}

module.exports = APIClient;
