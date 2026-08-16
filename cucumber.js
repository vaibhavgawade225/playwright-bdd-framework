module.exports = {
  default: {
    requireModule: ['dotenv/config'],
    require: [
      'api/src/Core/**/*.js',
      'api/src/Steps/**/*.js',
      'ui/src/core/**/*.js',
      'ui/src/step_definitions/**/*.js',
    ],
    format: [
      'summary',
      'progress',
      'json:reports/cucumber-json/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      resultsDir: 'reports/allure-results',
    },
    paths: [
      'api/src/resources/Features/**/*.feature',
      'ui/src/features/**/*.feature',
    ],
    retry: process.env.CI ? 1 : 0,
  },
};
