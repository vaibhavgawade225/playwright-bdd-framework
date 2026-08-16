'use strict';

const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { request } = require('@playwright/test');
const ConfigManager = require('../Utils/ConfigManager');

setDefaultTimeout(ConfigManager.getDefaultTimeout());

Before({ tags: '@api' }, async function () {
  this.apiRequestContext = await request.newContext({
    baseURL: ConfigManager.getAPIBaseURL(),
    extraHTTPHeaders: ConfigManager.getAPIHeaders(),
  });
});

After({ tags: '@api' }, async function () {
  await this.apiRequestContext?.dispose().catch(() => {});
});
