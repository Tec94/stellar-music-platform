# Test Setup Guide

This guide walks you through setting up the testing environment for the Adventure Quest Platform.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git installed

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adventure-quest-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (for E2E tests)
   ```bash
   npx playwright install --with-deps
   ```

4. **Install k6** (for load testing)
   
   macOS:
   ```bash
   brew install k6
   ```
   
   Linux:
   ```bash
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6
   ```
   
   Windows:
   ```bash
   choco install k6
   ```

## Running Tests Locally

### Unit Tests

Basic unit test execution:
```bash
npm run test:unit
```

Watch mode for TDD:
```bash
npm run test:watch
```

With coverage:
```bash
npm run test:coverage
```

### Integration Tests

Run integration tests:
```bash
npm run test:integration
```

### E2E Tests

Run all E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with visible browser (debugging):
```bash
npm run test:e2e:headed
```

Run tests in specific browser:
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### Performance Tests

First, build and preview the app:
```bash
npm run build
npm run preview &
```

Then run Lighthouse CI:
```bash
npm run qa:performance
```

### Load Tests

Run chat load test:
```bash
npm run qa:load
```

### Security Tests

Run security scan:
```bash
npm run qa:security
```

## Viewing Test Results

### Coverage Reports

After running tests with coverage, open:
```bash
open coverage/index.html
```

### Playwright Reports

After E2E test runs:
```bash
npx playwright show-report
```

### Lighthouse Reports

Reports are saved to `lhci_reports/` directory and uploaded to temporary storage.

## Troubleshooting

### Playwright Installation Issues

If Playwright browsers fail to install:
```bash
npx playwright install-deps
npx playwright install
```

### Port Already in Use

If the dev server fails to start (port 5173 in use):
```bash
lsof -ti:5173 | xargs kill -9
```

### Coverage Not Generated

Ensure `@vitest/coverage-v8` is installed:
```bash
npm install --save-dev @vitest/coverage-v8
```

### k6 Not Found

Verify k6 installation:
```bash
k6 version
```

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - name: Upload coverage
        uses: codecov/codecov-action@v3
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - performance

test:
  image: node:18
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm run test:coverage
    - npx playwright install --with-deps
    - npm run test:e2e
  coverage: '/Lines\s+:\s+(\d+\.\d+)/'
  artifacts:
    paths:
      - coverage/
      - playwright-report/

performance:
  image: node:18
  stage: performance
  script:
    - npm ci
    - npm run build
    - npm run qa:performance
  artifacts:
    paths:
      - lhci_reports/
```

## Environment Variables

Create `.env.local` for local testing:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Note**: Never commit `.env.local` to version control.

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test && npm run test:e2e:chromium
   ```

2. **Write tests alongside features**
   - Unit test for new utility function
   - Integration test for new component
   - E2E test for new user flow

3. **Keep tests fast**
   - Mock external APIs
   - Use minimal fixtures
   - Run E2E tests only when necessary

4. **Maintain coverage thresholds**
   - Aim for 80%+ coverage on utilities
   - Test critical user paths
   - Don't compromise coverage for speed

5. **Update snapshots carefully**
   ```bash
   npm run test:e2e -- --update-snapshots
   ```

## Getting Help

- Check [testing-report.md](./testing-report.md) for detailed results
- Review test examples in `tests/` directory
- Consult framework documentation:
  - [Vitest](https://vitest.dev)
  - [Playwright](https://playwright.dev)
  - [React Testing Library](https://testing-library.com/react)
  - [k6](https://k6.io/docs)
