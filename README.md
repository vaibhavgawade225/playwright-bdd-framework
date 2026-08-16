# Playwright + Cucumber BDD Hybrid Framework

A **production-grade, unified BDD test automation framework** covering both **UI and API testing** using Playwright, Cucumber JS, and JavaScript - with zero external HTTP libraries, built-in schema validation, and dual HTML reporting.

---

## Key Features

| Feature | Details |
|---------|---------|
| **Unified Engine** | Playwright handles both UI browser automation and HTTP API calls - no axios/supertest needed |
| **Tag-Driven Execution** | `@ui` launches browser lazily; `@api` runs instantly without any browser overhead |
| **Secure Configuration** | Credentials stay in `.env` (gitignored); `config.json` uses `${ENV_VAR}` placeholders for safe commits |
| **Page Object Model** | All pages extend `BasePage` with built-in `safeClick`, `safeFill`, `getText`, and element highlighting |
| **Schema Validation** | AJV-powered JSON Schema validation built into `APIClient` |
| **Dual Reporting** | Multiple Cucumber HTML Report + Allure HTML Report auto-generated after every run |
| **CI/CD Ready** | GitHub Actions with parallel API + UI jobs, weekly scheduled runs, and 7-day artifact retention |

---

## Project Structure

```
playwright-bdd-framework/
├── config.json                        # Shared config with ${ENV_VAR} placeholders
├── .env.example                       # Environment variable template (committed)
├── cucumber.js                        # Cucumber runner config and formatters
├── package.json                       # Scripts and dependencies
│
├── api/                               # API Automation Module
│   └── src/
│       ├── Core/
│       │   └── hooks.js               # @api lifecycle: request context setup and teardown
│       ├── Steps/
│       │   ├── CommonSteps.js         # Reusable generic API step definitions
│       │   └── UsersApiSteps.js       # Endpoint-specific step definitions
│       ├── Utils/
│       │   ├── APIClient.js           # HTTP methods wrapper + AJV schema validator
│       │   ├── APIUtility.js          # Dynamic request builder (params, body, headers)
│       │   ├── ConfigManager.js       # Config and env resolver
│       │   ├── JsonFileReader.js      # JSON payload and schema file loader
│       │   └── ScenarioContext.js     # Cross-step shared state and Page Object bridge
│       └── resources/
│           ├── Features/              # @api Gherkin feature files
│           ├── Query_Parameters/      # API query param JSON files
│           ├── Request_Bodies/        # Request payload JSON files
│           └── Schema/                # AJV JSON Schema files for response validation
│
├── ui/                                # UI Automation Module
│   └── src/
│       ├── core/
│       │   └── hooks.js               # @ui lifecycle: browser/context/page + screenshot/video
│       ├── features/                  # @ui Gherkin feature files
│       ├── locators/                  # Page locators as JSON files (one per page)
│       ├── pages/                     # Page Object classes (extend BasePage)
│       ├── step_definitions/          # UI BDD step definitions
│       ├── testdata/                  # UI test data JSON files
│       └── utils/
│           ├── ConfigManager.js       # UI-specific config manager
│           └── generateHtmlReport.js  # HTML report generator (Cucumber + Allure)
│
└── .github/
    └── workflows/
        └── tests.yml                  # GitHub Actions CI - parallel jobs + weekly cron
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or v20+
- **Git**

### Installation

```sh
git clone https://github.com/vaibhavgawade225/playwright-bdd-framework.git
cd playwright-bdd-framework
npm install
npx playwright install --with-deps chromium
cp .env.example .env
```

> Edit `.env` with your actual credentials before running tests.

---

## Test Execution

```sh
# Run all tests (API + UI) and auto-generate reports
npm test

# Run by module
npm run test:ui          # Only @ui scenarios
npm run test:api         # Only @api scenarios

# Run by tag
npm run test:smoke       # @smoke scenarios
npm run test:regression  # @regression scenarios
```

---

## Test Reports

Reports are auto-generated in the `reports/` directory after every run.

```sh
npm run report           # Regenerate HTML reports manually
npm run report:allure    # Build Allure HTML report
npm run allure:open      # Open interactive Allure dashboard in browser
```

| Report | Path |
|--------|------|
| Multiple Cucumber HTML | `reports/html-report/index.html` |
| Allure HTML | `reports/allure-report/index.html` |

---

## Framework Best Practices

### 1. Feature File Guidelines

- **One feature per file** - never mix UI and API scenarios in the same `.feature` file
- **Always tag scenarios** with at minimum `@ui` or `@api`, plus `@smoke` or `@regression`
- Use **Scenario Outline** for data-driven tests instead of duplicating scenarios
- Write steps in **plain business language** - no CSS selectors or technical detail in Gherkin

```gherkin
# Good
Scenario: User logs in with valid credentials
  Given the user is on the login page
  When they login as "standard_user"
  Then they should see the products page

# Avoid
Scenario: Login
  Given user clicks "#user-name" and types "standard_user"
```

---

### 2. Tagging Strategy

| Tag | Purpose |
|-----|---------|
| `@ui` | Browser-based scenario - launches Playwright browser |
| `@api` | API-only scenario - no browser, faster execution |
| `@smoke` | Critical happy-path tests - run on every deploy |
| `@regression` | Full suite - run nightly or weekly |
| `@wip` | Work-in-progress - excluded from CI runs |

> **Rule:** Every scenario must have `@ui` OR `@api`, plus at least one of `@smoke` / `@regression`.

---

### 3. Page Object Model Rules

- Every page class **must extend `BasePage`**
- Define all selectors in **`locators/<PageName>.json`** - never hardcode selectors in page classes or step files
- Use `BasePage` built-in methods: `safeClick()`, `safeFill()`, `getText()` - they auto-wait and highlight elements
- Register every new page in **`pageObjectRegistry.js`**

```js
// Correct - use BasePage methods
async login(username, password) {
  await this.safeFill('usernameInput', username);
  await this.safeFill('passwordInput', password);
  await this.safeClick('loginButton');
}

// Avoid - raw Playwright calls inside page class
async login(username, password) {
  await this.page.fill('#user-name', username);
}
```

---

### 4. Step Definitions Rules

- Steps must be **thin** - delegate to page objects or `APIClient`, never contain raw Playwright/HTTP logic
- Use `this.scenarioContext` to **share data between steps** - never use global variables
- Keep steps **reusable** across multiple scenarios

```js
// Correct - thin step
When('the user logs in as {string}', async function (role) {
  const loginPage = this.scenarioContext.getPageObject('LoginPage');
  await loginPage.loginAs(role);
});

// Avoid - raw logic inside step definition
When('the user logs in as {string}', async function (role) {
  await this.page.fill('#user-name', 'standard_user');
  await this.page.fill('#password', 'secret_sauce');
  await this.page.click('#login-button');
});
```

---

### 5. API Testing Rules

- All HTTP calls go through **`APIClient`** - never use `fetch` or `axios` directly
- Store request bodies in `api/src/resources/Request_Bodies/` as JSON files
- Store JSON Schemas in `api/src/resources/Schema/` and validate every API response
- Use `ScenarioContext.set()` / `.get()` to pass data between steps (e.g., created resource ID)

```js
// Store response data for use in subsequent steps
this.scenarioContext.set('userId', responseBody.id);

// In the next step
const userId = this.scenarioContext.get('userId');
```

---

### 6. Environment and Configuration Rules

- **Never hardcode URLs or credentials** in test code, page objects, or step definitions
- All values must flow from `.env` to `ConfigManager` to test code
- Keep `.env.example` updated as documentation for all required variables
- `config.json` is for **non-sensitive defaults only** and is safe to commit

```
.env              - actual secrets (gitignored - never commit)
.env.example      - template with all keys, no real values (committed)
config.json       - non-sensitive defaults using ${ENV_VAR} syntax (committed)
```

---

### 7. Locator Best Practices

- Prefer **`data-test`** or **`data-testid`** attributes over brittle CSS class selectors or XPath
- Store all locators in `ui/src/locators/<PageName>.json` - one file per page
- Use **descriptive, semantic key names** in the JSON

```json
{
  "usernameInput":  "[data-test='username']",
  "passwordInput":  "[data-test='password']",
  "loginButton":    "[data-test='login-button']",
  "errorMessage":   "[data-test='error']"
}
```

---

### 8. CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/tests.yml`) runs automatically:

| Trigger | When |
|---------|------|
| `push` to `main` | On every direct push |
| `pull_request` to `main` | On every PR opened or updated |
| `workflow_dispatch` | Manual trigger from the GitHub Actions UI |
| `schedule` (weekly cron) | Every Monday at 11:30 AM IST (06:00 UTC) |

**Jobs run in parallel:**

- **`api-tests`** - runs `npm run test:api` (no browser install required)
- **`ui-tests`** - installs Chromium, then runs `npm run test:ui`

Both jobs upload test reports as downloadable artifacts with **7-day retention**.

**Required GitHub Variables** - set before first run.
Go to: Repository > Settings > Secrets and variables > Actions > Variables tab

| Variable | Value |
|----------|-------|
| `UI_BASE_URL` | `https://www.saucedemo.com` |
| `API_BASE_URL` | `https://jsonplaceholder.typicode.com` |

---

## License

Distributed under the **MIT License**.

---

> **Author:** Vaibhav Gawade
