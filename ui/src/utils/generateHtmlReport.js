'use strict';

const reporter = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const reportsDir = path.resolve(__dirname, '../../../reports');
const cucumberJsonDir = path.join(reportsDir, 'cucumber-json');
const jsonReportFile = path.join(cucumberJsonDir, 'cucumber-report.json');

if (fs.existsSync(jsonReportFile)) {
  console.log('📊 Processing Cucumber JSON results...');
  try {
    const rawData = fs.readFileSync(jsonReportFile, 'utf-8');
    const features = JSON.parse(rawData);

    // Filter API features vs UI features
    const apiFeatures = features.filter(f => (f.uri || '').includes('api') || (f.tags || []).some(t => t.name === '@api'));
    const uiFeatures = features.filter(f => (f.uri || '').includes('ui') || (f.tags || []).some(t => t.name === '@ui'));

    const apiJsonDir = path.join(cucumberJsonDir, 'api');
    const uiJsonDir = path.join(cucumberJsonDir, 'ui');

    fs.mkdirSync(apiJsonDir, { recursive: true });
    fs.mkdirSync(uiJsonDir, { recursive: true });

    if (apiFeatures.length > 0) {
      fs.writeFileSync(path.join(apiJsonDir, 'api-report.json'), JSON.stringify(apiFeatures, null, 2));
      reporter.generate({
        jsonDir: apiJsonDir,
        reportPath: path.join(reportsDir, 'cucumber-reports', 'api-report'),
        pageTitle: 'API Automation Report',
        reportName: 'REST API Test Automation Suite',
        displayDuration: true,
        metadata: {
          browser: { name: 'node', version: 'latest' },
          device: 'API Server Context',
          platform: { name: process.platform, version: process.arch },
        },
        customData: {
          title: 'API Suite Info',
          data: [
            { label: 'Layer', value: 'REST API Testing' },
            { label: 'Scenarios Count', value: String(apiFeatures.reduce((acc, f) => acc + (f.elements ? f.elements.length : 0), 0)) },
            { label: 'Execution Time', value: new Date().toLocaleString() },
          ],
        },
      });
      console.log(`✅ Cucumber API Report: ${path.join(reportsDir, 'cucumber-reports', 'api-report', 'index.html')}`);
    }

    if (uiFeatures.length > 0) {
      fs.writeFileSync(path.join(uiJsonDir, 'ui-report.json'), JSON.stringify(uiFeatures, null, 2));
      reporter.generate({
        jsonDir: uiJsonDir,
        reportPath: path.join(reportsDir, 'cucumber-reports', 'ui-report'),
        pageTitle: 'UI Automation Report',
        reportName: 'Browser UI Test Automation Suite',
        displayDuration: true,
        metadata: {
          browser: { name: 'chromium', version: 'latest' },
          device: 'Web Browser Context',
          platform: { name: process.platform, version: process.arch },
        },
        customData: {
          title: 'UI Suite Info',
          data: [
            { label: 'Layer', value: 'Browser UI Testing (Playwright)' },
            { label: 'Scenarios Count', value: String(uiFeatures.reduce((acc, f) => acc + (f.elements ? f.elements.length : 0), 0)) },
            { label: 'Execution Time', value: new Date().toLocaleString() },
          ],
        },
      });
      console.log(`✅ Cucumber UI Report: ${path.join(reportsDir, 'cucumber-reports', 'ui-report', 'index.html')}`);
    }

    // Generate combined report
    reporter.generate({
      jsonDir: cucumberJsonDir,
      reportPath: path.join(reportsDir, 'cucumber-reports', 'combined-report'),
      pageTitle: 'Unified Test Automation Report',
      reportName: 'Full UI & API Integrated Test Suite',
      displayDuration: true,
      metadata: {
        browser: { name: 'chrome', version: 'latest' },
        device: 'Unified Environment',
        platform: { name: process.platform, version: process.arch },
      },
      customData: {
        title: 'Full Suite Info',
        data: [
          { label: 'Project', value: 'playwright-cucumber-hybrid-bdd-framework' },
          { label: 'Execution Time', value: new Date().toLocaleString() },
        ],
      },
    });
    console.log(`✅ Cucumber Combined Report: ${path.join(reportsDir, 'cucumber-reports', 'combined-report', 'index.html')}`);

  } catch (e) {
    console.error('⚠️ Error processing Cucumber reports:', e.message);
  }
}

// 2. Generate Single-File Allure HTML Report
const allureResultsDir = path.join(reportsDir, 'allure-results');
if (fs.existsSync(allureResultsDir)) {
  console.log('📊 Generating Allure HTML Report...');
  try {
    const allureBin = path.resolve(__dirname, '../../../node_modules/.bin/allure');
    const cmd = process.platform === 'win32' ? `"${allureBin}.cmd"` : `"${allureBin}"`;
    const allureOutputDir = path.join(reportsDir, 'allure-report');

    execSync(`${cmd} generate "${allureResultsDir}" --single-file --clean -o "${allureOutputDir}"`, { stdio: 'inherit' });
    console.log(`✅ Allure Single-File Report: ${path.join(allureOutputDir, 'index.html')}`);
  } catch (e) {
    console.error('⚠️ Allure Report Error:', e.message);
  }
}

// 3. Clean up raw JSON temp folders to keep reports/ directory clean
[cucumberJsonDir, allureResultsDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (_) {}
  }
});
