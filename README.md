# Playwright Cucumber Framework

## Overview
This project is a scalable automation framework built using Playwright and Cucumber BDD for testing web applications, mobile web emulation, and API endpoints. It supports multiple browsers including Chromium, Firefox, and WebKit, and utilizes Allure for detailed reporting. The framework is designed with a clear separation between UI and API testing concerns, using dedicated "worlds" for each.

## Features
- **Web Testing**: Automated tests for web applications using Playwright's browser automation capabilities.
- **Mobile Web Emulation**: Test mobile web applications with device emulation profiles for devices like Pixel and iPhone.
- **API Testing**: Validate API endpoints with automated tests. The framework uses a separate `ApiWorld` to manage API test state and clients, ensuring no overlap with UI tests.
- **Cross-Browser Support**: Run tests across Chromium, Firefox, and WebKit.
- **Allure Reporting**: Generate detailed and interactive test reports for better insights into test execution.

## Project Structure
```
playwright-cucumber-framework
├── .features-gen           # Auto-generated test files from features
├── features
│   ├── web
│   ├── mobile
│   └── api
├── src
│   ├── pages               # Page Object Models for UI tests
│   ├── steps               # Step definitions for feature files
│   ├── support             # BDD worlds, hooks, and configurations
│   │   ├── api-fixtures.ts
│   │   ├── ui-fixtures.ts
│   │   └── cucumber.conf.ts
│   ├── api                 # API clients and models
│   ├── interfaces          # TypeScript interfaces
│   ├── config              # Application and test configuration
│   └── utils               # Utility functions and helpers
├── tests
│   └── e2e
├── reports
│   ├── allure-report
│   └── junit-report.xml
├── .github
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── tslint.json
└── .eslintrc.js
```

## Setup Instructions
1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd playwright-cucumber-framework
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and update the values as needed.

4. **Generate BDD Test Files**
   Before running the tests, you may need to generate the Playwright test files from the feature files.
   ```
   npm run bddgen
   ```

5. **Run Tests**
   To execute the tests, use the following commands. These scripts use your `.env` settings automatically.
   - `npm test`: Run all tests.
   - `npm run test:web`: Web tests only.
   - `npm run test:api`: API tests only.
   - `npm run test:smoke`: Smoke tests.
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