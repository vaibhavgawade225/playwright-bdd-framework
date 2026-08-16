'use strict';

require('dotenv').config();
const path = require('path');
const fs = require('fs');

class ConfigManager {
  static getConfig() {
    const configPath = path.resolve(__dirname, '../../../config.json');
    if (fs.existsSync(configPath)) {
      try {
        let raw = fs.readFileSync(configPath, 'utf-8');
        raw = raw.replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key] !== undefined ? process.env[key] : '');
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  static getBrowser() {
    const cfg = this.getConfig();
    return process.env.BROWSER || cfg.BROWSER || 'chromium';
  }

  static isHeadless() {
    if (process.env.HEADLESS !== undefined) return process.env.HEADLESS !== 'false';
    const cfg = this.getConfig();
    if (cfg.HEADLESS !== undefined && cfg.HEADLESS !== '') return String(cfg.HEADLESS) !== 'false';
    return true;
  }

  static getUIBaseURL() {
    const cfg = this.getConfig();
    return process.env.UI_BASE_URL || cfg.UI_BASE_URL || 'https://www.saucedemo.com';
  }

  static getAPIBaseURL() {
    const cfg = this.getConfig();
    return process.env.API_BASE_URL || cfg.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
  }

  static getDefaultTimeout() {
    const cfg = this.getConfig();
    const val = process.env.DEFAULT_TIMEOUT || cfg.DEFAULT_TIMEOUT || '30000';
    return parseInt(val, 10);
  }

  static isScreenshotOnFailure() {
    if (process.env.SCREENSHOT_ON_FAILURE !== undefined) return process.env.SCREENSHOT_ON_FAILURE === 'true';
    const cfg = this.getConfig();
    return cfg.SCREENSHOT_ON_FAILURE !== undefined ? Boolean(cfg.SCREENSHOT_ON_FAILURE) : true;
  }

  static isScreenshotOnPass() {
    if (process.env.SCREENSHOT_ON_PASS !== undefined) return process.env.SCREENSHOT_ON_PASS === 'true';
    const cfg = this.getConfig();
    return cfg.SCREENSHOT_ON_PASS !== undefined ? Boolean(cfg.SCREENSHOT_ON_PASS) : false;
  }

  static isRecordVideo() {
    if (process.env.RECORD_VIDEO !== undefined) return process.env.RECORD_VIDEO === 'true';
    const cfg = this.getConfig();
    return cfg.RECORD_VIDEO !== undefined ? Boolean(cfg.RECORD_VIDEO) : false;
  }

  static isHighlightElement() {
    if (process.env.HIGHLIGHT_ELEMENT !== undefined) return process.env.HIGHLIGHT_ELEMENT === 'true';
    const cfg = this.getConfig();
    return cfg.HIGHLIGHT_ELEMENT !== undefined ? Boolean(cfg.HIGHLIGHT_ELEMENT) : true;
  }

  static getAPIHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  static getUserCredentials(role = 'standard_user') {
    const cfg = this.getConfig();
    const users = {
      standard_user: {
        username: process.env.STANDARD_USER || cfg.STANDARD_USER || 'standard_user',
        password: process.env.STANDARD_PASSWORD || cfg.STANDARD_PASSWORD || 'secret_sauce',
      },
      locked_out_user: { username: 'locked_out_user', password: 'secret_sauce' },
      problem_user: { username: 'problem_user', password: 'secret_sauce' },
      performance_glitch_user: { username: 'performance_glitch_user', password: 'secret_sauce' },
    };
    return users[role] || users.standard_user;
  }
}

module.exports = ConfigManager;
