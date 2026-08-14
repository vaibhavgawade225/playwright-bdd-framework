'use strict';

const { Before, After, AfterAll, Status } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const ConfigManager = require('../utils/ConfigManager');
const ScenarioContext = require('../../../api/src/Utils/ScenarioContext');
const APIClient = require('../../../api/src/Utils/APIClient');

let browser = null;
const browserEngines = { chromium, firefox, webkit };

Before({ tags: '@ui' }, async function () {
  if (!browser) {
    const engine = browserEngines[ConfigManager.getBrowser()] || chromium;
    browser = await engine.launch({ headless: ConfigManager.isHeadless() });
  }

  const contextOptions = { baseURL: ConfigManager.getUIBaseURL() };
  if (ConfigManager.isRecordVideo()) {
    const videoDir = path.resolve(__dirname, '../../../reports/videos/');
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
    contextOptions.recordVideo = { dir: videoDir };
  }

  this.context = await browser.newContext(contextOptions);
  this.page = await this.context.newPage();
});

Before(async function () {
  this.scenarioContext = new ScenarioContext({
    page: this.page || null,
    apiClient: this.apiRequestContext ? new APIClient(this.apiRequestContext) : null,
  });
});

After(async function (scenario) {
  const isFailed = scenario.result?.status === Status.FAILED;
  const isPassed = scenario.result?.status === Status.PASSED;

  if (this.page) {
    const sanitizeName = scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const screenshotsDir = path.resolve(__dirname, '../../../reports/screenshots/');

    if (isFailed && ConfigManager.isScreenshotOnFailure()) {
      if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
      const screenshotPath = path.join(screenshotsDir, `FAILED_${sanitizeName}.png`);
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => null);
      if (screenshot) this.attach(screenshot, 'image/png');
      console.error(`❌ Scenario failed: "${scenario.pickle.name}"`);
    }

    if (isPassed && ConfigManager.isScreenshotOnPass()) {
      if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
      const screenshotPath = path.join(screenshotsDir, `PASSED_${sanitizeName}.png`);
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => null);
      if (screenshot) this.attach(screenshot, 'image/png');
    }

    if (ConfigManager.isRecordVideo()) {
      const video = this.page.video();
      await this.page.close().catch(() => {});
      this.page = null;
      if (video) {
        const videoPath = await video.path().catch(() => null);
        if (videoPath && fs.existsSync(videoPath)) {
          const videoBuffer = fs.readFileSync(videoPath);
          this.attach(videoBuffer, 'video/webm');
        }
      }
    }
  }

  this.scenarioContext?.clear();
  await this.page?.close().catch(() => {});
  await this.context?.close().catch(() => {});
});

AfterAll(async function () {
  await browser?.close();
  browser = null;
});
