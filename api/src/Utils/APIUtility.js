'use strict';

const JsonFileReader = require('./JsonFileReader');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true, strict: false });

class APIUtility {
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

  async sendRequest({ method, url, headersName, queryFileName, bodyFileName }) {
    const cleanedEndpoint = this._cleanEndpoint(url);

    const headers = headersName && headersName !== 'NA'
      ? JsonFileReader.readJson('headers', headersName)
      : {};

    const params = queryFileName && queryFileName !== 'NA'
      ? JsonFileReader.readJson('Query_Parameters', queryFileName)
      : {};

    const data = bodyFileName && bodyFileName !== 'NA'
      ? JsonFileReader.readJson('Request_Bodies', bodyFileName)
      : undefined;

    const options = {
      ...(Object.keys(headers).length > 0 ? { headers } : {}),
      ...(Object.keys(params).length > 0 ? { params } : {}),
      ...(data ? { data } : {}),
    };

    const httpMethod = method.toUpperCase();

    switch (httpMethod) {
      case 'GET':
        this.lastResponse = await this.request.get(cleanedEndpoint, options);
        break;
      case 'POST':
        this.lastResponse = await this.request.post(cleanedEndpoint, options);
        break;
      case 'PUT':
        this.lastResponse = await this.request.put(cleanedEndpoint, options);
        break;
      case 'PATCH':
        this.lastResponse = await this.request.patch(cleanedEndpoint, options);
        break;
      case 'DELETE':
        this.lastResponse = await this.request.delete(cleanedEndpoint, options);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return this.lastResponse;
  }

  getStatus() {
    return this.lastResponse ? this.lastResponse.status() : null;
  }

  async getJson() {
    return this.lastResponse ? this.lastResponse.json().catch(() => null) : null;
  }

  async getText() {
    return this.lastResponse ? this.lastResponse.text() : '';
  }

  async validateSchemaFile(schemaFileName) {
    if (!schemaFileName || schemaFileName === 'NA') return true;

    const schema = JsonFileReader.readJson('Schema', schemaFileName);
    const body = await this.getJson();
    const validate = ajv.compile(schema);
    const valid = validate(body);
    if (!valid) {
      throw new Error(`Schema validation failed for "${schemaFileName}":\n${JSON.stringify(validate.errors, null, 2)}`);
    }
    return true;
  }
}

module.exports = APIUtility;
