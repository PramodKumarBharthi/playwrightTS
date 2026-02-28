# Playwright-BDD Test Automation Framework

A scalable, enterprise-grade test automation framework built with **Playwright** and **Cucumber BDD** for comprehensive testing across web applications, mobile web emulation, and API endpoints. Features cross-browser support, Allure reporting, and CI/CD integration with GitHub Actions.

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Usage & Test Execution](#-usage--test-execution)
- [Test Reporting](#-test-reporting)
- [GitHub Actions CI/CD](#-github-actions-cicd)
- [Environment Variables](#-environment-variables)
- [NPM Scripts](#-npm-scripts)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⭐ Features

### Core Testing Capabilities
- ✅ **Web Testing** - Automated tests for web applications with Playwright browser automation
- ✅ **Mobile Web Testing** - Device emulation for mobile browsers (Pixel 5, iPhone 12, etc.)
- ✅ **API Testing** - Comprehensive API endpoint validation and integration testing
- ✅ **Cross-Browser Support** - Run tests across Chromium, Firefox, and WebKit

### Framework Features
- 🎯 **BDD with Cucumber** - Write tests in human-readable Gherkin syntax
- 🏗️ **Page Object Model (POM)** - Maintainable and scalable test structure
- 📊 **Allure Reporting** - Interactive test reports with detailed analytics
- 🔄 **Parallel Execution** - Configurable worker threads for faster test runs
- 🎭 **UI & API Isolation** - Separate worlds/fixtures for UI and API testing
- 🏷️ **Advanced Tagging** - Run tests by tags (@web, @api, @sanity, @smoke, @critical, etc.)
- 🔍 **Detailed Logging** - Comprehensive test execution logs with timestamps
- 📸 **Screenshots & Videos** - Automatic capture on test failure
- 🚀 **GitHub Actions CI/CD** - Automated testing on push and pull requests

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### System Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (included with Node.js)
- **Git**: v2.0.0 or higher

### Optional Tools (Recommended)
- **VS Code**: For development and debugging
  - Extensions: 
    - Playwright Test for VS Code (for debugging)
    - Cucumber (Gherkin) Full Support
- **Allure**: For standalone report generation (auto-installed via npm)

### Browser Drivers
Automatically installed via `npm install`. Supports:
- Chromium (Google Chrome)
- Firefox
- WebKit (Safari)

---

## 📥 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/PramodKumarBharthi/playwrightTS.git
cd playwright-cucumber-framework
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- `@playwright/test` - Browser automation
- `playwright-bdd` - BDD test generation
- `@cucumber/cucumber` - BDD framework
- `allure-playwright` - Report generation
- TypeScript, ESLint, Prettier, and more

### 3. Install Playwright Browsers
```bash
npx playwright install --with-deps
```

Or for specific browser:
```bash
npx playwright install chromium --with-deps
```

### 4. Verify Installation
```bash
npm run bddgen --version
npx playwright --version
```

---

## ⚙️ Configuration

### Environment Variables Setup

#### Development Environment (Local)
Copy the example environment file and update values:
```bash
cp .env.example .env
```

**`.env` (Development)**
```dotenv
# Test Environment
TEST_ENV=development
BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
API_BASE_URL=https://posthook-api.mock.beeceptor.com

# Browser Configuration
BROWSER=chromium
HEADLESS=false           # false = show browser during tests
TIMEOUT=30000           # Test timeout in milliseconds

# Test Credentials
TEST_USER=Admin
TEST_PASSWORD=admin123

# Parallel Execution
WORKERS=2               # Number of parallel workers (1 = sequential)

# Reporting
ALLURE_RESULTS_DIR=allure-results
```

#### CI/CD Environments (GitHub Actions)
Two separate configuration files for different test types:

**`.envUI` (Web Tests)**
```dotenv
TEST_ENV=UI
BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
API_BASE_URL=https://posthook-api.mock.beeceptor.com
TEST_USER=Admin
TEST_PASSWORD=admin123
HEADLESS=true           # Required for CI
TIMEOUT=30000
WORKERS=1               # Sequential for CI stability
```

**`.envAPI` (API Tests)**
```dotenv
TEST_ENV=API
API_BASE_URL=https://posthook-api.mock.beeceptor.com
BASE_URL=https://posthook-api.mock.beeceptor.com
GET_ENDPOINT=/v1/hooks
POST_ENDPOINT=/v1/hooks
DELETE_ENDPOINT=/v1/hooks/{hook_id}
PUT_ENDPOINT=/v1/projects/
TEST_USER=Admin
TEST_PASSWORD=admin123
HEADLESS=true           # Required for CI
TIMEOUT=30000
WORKERS=1               # Sequential for CI stability
```

### Playwright Configuration

Main configuration file: `playwright.config.ts`

Key settings:
- **testDir**: `.features-gen` (auto-generated from feature files)
- **fullyParallel**: true (runs tests in parallel)
- **workers**: Read from WORKERS env variable
- **timeout**: 30 seconds per test
- **retries**: 0 locally, 2 in CI

### TypeScript Configuration

`tsconfig.json` includes:
- ES2020 target with modern features
- Strict type checking enabled
- Source maps for debugging
- Path aliases for clean imports

---

## 📁 Project Structure

```
playwright-cucumber-framework/
│
├── .github/workflows/
│   └── test.yml              # GitHub Actions CI/CD workflow
│
├── features/                 # BDD Feature files
│   ├── web/
│   │   └── login.feature
│   ├── mobile/
│   │   └── mobile_login.feature
│   └── api/
│       └── webhookAPI.feature
│
├── src/
│   ├── config/
│   │   ├── config.ts         # Load and parse environment variables
│   │   └── devices.ts        # Device configurations for mobile testing
│   │
│   ├── pages/                # Page Object Models
│   │   ├── basePage.ts       # Base page with common actions
│   │   ├── loginPage.ts      # Login page object
│   │   └── dashboardPage.ts  # Dashboard page object
│   │
│   ├── steps/
│   │   ├── login.steps.ts    # Login feature step definitions
│   │   ├── mobile.steps.ts   # Mobile feature step definitions
│   │   └── webhook.steps.ts  # API feature step definitions
│   │
│   ├── support/              # BDD Fixtures & Hooks
│   │   ├── ui-fixtures.ts    # UIWorld fixture for web tests
│   │   ├── api-fixtures.ts   # ApiWorld fixture for API tests
│   │   ├── hooks.ts          # Before/After hooks
│   │   └── world.ts          # World type definitions
│   │
│   ├── interfaces/
│   │   └── iResponse.ts      # API response interfaces
│   │
│   └── utils/
│       ├── logger.ts         # Logging utility
│       ├── testData.ts       # Centralized test data
│       └── httpHelper.ts     # HTTP request helpers
│
├── tests/                    # Additional test files (if any)
│   └── web/
│       └── login.spec.ts     # Manual Playwright tests (optional)
│
├── testData/                 # Test data files
│   ├── apiTestData.json
│   └── webTestData.json
│
├── .features-gen/            # AUTO-GENERATED test specs
│   └── (generated from features/)
│
├── allure-results/           # Allure test results (generated)
├── allure-report/            # Allure HTML report (generated)
├── playwright-report/        # Playwright HTML report (generated)
│
├── .env                      # Environment variables (git ignored)
├── .env.example              # Example environment file
├── .envUI                    # CI/CD UI test config
├── .envAPI                   # CI/CD API test config
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── playwright.config.ts      # Playwright configuration
├── allure-config.json        # Allure configuration
├── README.md                 # This file
└── LICENSE                   # MIT License
```

---

## 🚀 Usage & Test Execution

### Generate Tests from Features
Before running tests, generate test specs from feature files:
```bash
npm run bddgen
```

This creates `.feature.spec.js` files in `.features-gen/` directory.

### Run All Tests
```bash
npm test
```

### Web Tests Only
```bash
npm run test:web          # Chrome with UI test config
npm run test:chromium     # Chrome browser
npm run test:firefox      # Firefox browser
npm run test:webkit       # Safari browser
npm run test:mobile       # Mobile devices
```

### API Tests Only
```bash
npm run test:api          # All API tests
```

### Tests by Tag
```bash
npm run test:sanity       # @sanity tagged tests
npm run test:smoke        # @smoke tagged tests
npm run test:critical     # @critical tagged tests
npm run test:regression   # @regression tagged tests
npm run test:positive     # @positive tagged tests
npm run test:negative     # @negative tagged tests
```

### Parallel & Sequential Execution
```bash
npm run test:parallel     # Run with 4 workers
npm run test:sequential   # Run with 1 worker (sequential)

# Manual override
WORKERS=2 npm run test:web    # Override to 2 workers
WORKERS=1 npm run test:web    # Force sequential execution
```

### Browser & Debug Modes
```bash
npm run test:headed       # Show browser window
npm run test:debug        # Debug mode with inspector
npm run test:ui           # Interactive UI mode
npm run test:watch        # Watch mode for development
```

### Grouped Test Runs
```bash
npm run test:web:allure    # Web tests + Allure report
npm run test:api:allure    # API tests + Allure report
npm run test:complete      # All tests + Allure report + open report
```

---

## 📊 Test Reporting

### Allure Report Generation

#### Generate Report
```bash
npm run allure:generate
# or
npx allure generate allure-results --clean -o allure-report
```

#### Open Report
```bash
npm run allure:open
# or
npx allure open allure-report
```

#### Clean & Generate
```bash
npm run allure:clean      # Remove old results/reports
npm run test:complete     # Run tests + generate + open
```

### Playwright HTML Report
```bash
npx playwright show-report
```

### Report Contents
Allure reports include:
- ✅ Test execution timeline
- 📈 Pass/Fail statistics
- 🏷️ Test categorization by tags
- 📸 Screenshots & videos on failure
- 📝 Detailed step logs
- ⏱️ Execution time metrics
- 🌍 Environment information

---

## 🔄 GitHub Actions CI/CD

### Workflow Overview
File: `.github/workflows/test.yml`

The workflow is triggered on:
- ✅ Push to `main` and `develop` branches
- ✅ Pull requests to `main` and `develop` branches
- ✅ Daily scheduled run (2 AM UTC)

### CI/CD Jobs

#### Web Tests Job
- Installs dependencies
- Installs Playwright (Chromium only in CI)
- Copies `.envUI` configuration
- Generates test specs via bddgen
- Runs web tests with `--project=chromium`
- Generates Allure report
- Uploads artifacts

#### API Tests Job
- Installs dependencies
- Installs Playwright
- Copies `.envAPI` configuration
- Generates test specs via bddgen
- Runs API tests with `--project=API`
- Generates Allure report
- Uploads artifacts

#### Configuration in CI
- **Browser**: Chrome/Chromium only (faster, reliable in CI)
- **Headless**: true (required for CI environments)
- **Workers**: 1 (sequential for stability)
- **Retries**: 2 (automatic retry on failure)
- **Timeout**: 30 seconds per test

### View CI Results
1. Go to repository → **Actions** tab
2. Click on the workflow run
3. View logs or download artifacts
4. Download Allure reports from artifacts

### Troubleshooting CI Failures
Common issues and solutions:

| Issue | Cause | Solution |
|-------|-------|----------|
| `net::ERR_ABORTED` | waitUntil timeout | Using `load` instead of `networkidle` |
| `Protocol "ttps:" not supported` | URL typo | Check API_BASE_URL in config |
| No results | bddgen failed | Verify feature file syntax |
| Permission denied | Git push | Check branch permissions |

---

## 🔐 Environment Variables

### Complete Variable Reference

| Variable | Default | Description | Type |
|----------|---------|-------------|------|
| `TEST_ENV` | development | Environment name (development/API/UI) | string |
| `BASE_URL` | see default | Application base URL | URL |
| `API_BASE_URL` | see default | API base endpoint | URL |
| `BROWSER` | chromium | Default browser (chromium/firefox/webkit) | string |
| `HEADLESS` | false | Run browser headless mode | boolean |
| `TIMEOUT` | 30000 | Test timeout in milliseconds | number |
| `WORKERS` | 2 | Number of parallel workers | number |
| `TEST_USER` | Admin | Test account username | string |
| `TEST_PASSWORD` | admin123 | Test account password | string |
| `ALLURE_RESULTS_DIR` | allure-results | Allure results directory | path |

### Variable Loading
- Variables are loaded from `.env` file via `dotenv`
- Environment variables override `.env` values
- CI/CD uses specific config files (`.envUI`, `.envAPI`)
- All variables are validated at startup (see logs)

---

## 📜 NPM Scripts

### Quick Reference
```bash
# Testing
npm test                    # Run all tests
npm run test:web           # Web tests
npm run test:api           # API tests
npm run test:parallel      # Parallel execution (4 workers)
npm run test:sequential    # Sequential execution (1 worker)

# Report Generation
npm run allure:generate    # Generate Allure report
npm run allure:open        # Open report in browser
npm run allure:clean       # Clean old reports

# Development
npm run bddgen             # Generate specs from features
npm run test:debug         # Debug mode
npm run test:ui            # Interactive UI mode
npm run test:watch         # Watch mode

# By Tag
npm run test:sanity        # @sanity tagged tests
npm run test:smoke         # @smoke tagged tests
npm run test:critical      # @critical tagged tests
npm run test:regression    # @regression tagged tests
```

### Full Script Listing
See `package.json` scripts section for complete list.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. "Playwright browsers not found"
```bash
# Solution: Install browsers
npx playwright install --with-deps
```

#### 3. "Feature files not generating test specs"
```bash
# Check feature file syntax with:
npm run bddgen

# Verify features are in: features/**/*.feature
```

#### 4. ".env file not loaded"
```bash
# Verify .env file exists and is readable
ls -la .env

# Check for syntax errors:
cat .env | grep -v "^#" | grep -v "^$"
```

#### 5. "Tests timeout in CI but pass locally"
- Check: `waitUntil: 'load'` in page navigation (not 'networkidle')
- Verify: API URLs are complete with https://
- Ensure: WORKERS=1 in CI config files
- Check: TIMEOUT value is sufficient (30000ms = 30s)

#### 6. "Allure report not generated"
```bash
# Check if results exist:
ls -la allure-results/

# Manual generation:
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### Debug Mode
```bash
# Run tests with browser inspector
npm run test:debug

# Run in interactive UI mode
npm run test:ui

# View all test logs
npm test 2>&1 | tee test-execution.log
```

### Reset Everything
```bash
# Clean all generated files
npm run allure:clean
rm -rf .features-gen playwright-report test-results

# Reinstall everything
rm -rf node_modules package-lock.json
npm install
npx playwright install --with-deps

# Regenerate and run
npm run bddgen
npm test
```

---

## 🤝 Contributing

### Guidelines
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Add comments for complex logic
- Write feature files in clear Gherkin syntax

### Testing Before PR
```bash
# Run all checks before submitting
npm run bddgen
npm test
npm run allure:generate

# Verify no linting issues
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For issues, feature requests, or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review GitHub Issues
3. Check Playwright documentation: https://playwright.dev
4. Check Cucumber documentation: https://cucumber.io

---

## 🔗 Useful Links

- **Playwright Docs**: https://playwright.dev
- **Playwright-BDD**: https://vitalets.github.io/playwright-bdd
- **Cucumber.js**: https://github.com/cucumber/cucumber-js
- **Allure Reports**: https://docs.qameta.io/allure
- **GitHub Actions**: https://docs.github.com/en/actions

---

## 🎯 Roadmap

- [ ] Docker support for CI/CD
- [ ] Advanced reporting with custom metrics
- [ ] Visual regression testing
- [ ] Performance monitoring
- [ ] Multi-environment support
- [ ] Test data management system

---

**Last Updated**: February 2026

**Version**: 1.0.0

**Maintainer**: QA Automation Team
   - `npm run test:headed`: Show browser (overrides `.env`).
   - `npm run test:parallel`: Run tests in parallel (4 workers, overrides `.env` WORKERS).
   - `npm run test:chromium`: Run tests in Chrome only.


6. **Generate Allure Reports**
   After running the tests, generate the Allure report with:
   ```
   npm run allure:report
   ```

## CI/CD Integration
This project includes a GitHub Actions workflow for continuous integration. The configuration is located in `.github/workflows/ci.yml`. It automatically runs tests on push and pull request events.

## Development
To contribute to the project, please follow these guidelines:

- **Linting**: Before committing, run the linter to check for code quality issues.
  ```
  npm run lint
  ```
- **Formatting**: Ensure your code is formatted correctly.
  ```
  npm run format
  ```

## License
This project is licensed under the MIT License. See the LICENSE file for more details.