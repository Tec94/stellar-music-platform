# Adventure Quest Platform - Testing Suite

A comprehensive testing infrastructure for the Adventure Quest Platform featuring unit, integration, E2E, performance, load, and security testing.

## Quick Start

### Installation
```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:e2e           # Playwright E2E tests
npm run test:e2e:headed    # E2E tests with browser UI

# Watch mode for development
npm run test:watch
```

### Performance & Load Testing

```bash
# Lighthouse performance testing
npm run qa:performance

# k6 load testing
npm run qa:load

# Security scanning
npm run qa:security
```

## Testing Architecture

### Unit Tests
- **Framework**: Vitest
- **Coverage**: >80% on utilities
- **Location**: `src/**/__tests__/*.test.ts`
- **Scope**: Date formatting, XP calculations, validation, tier logic

### Integration Tests
- **Framework**: React Testing Library + Vitest
- **Location**: `tests/integration/*.test.tsx`
- **Scope**: Auth flows, profile updates, quest completion, media uploads

### E2E Tests
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit
- **Location**: `tests/e2e/*.spec.ts`
- **Scope**: Complete user journeys across browsers and devices

### Performance Testing
- **Tool**: Lighthouse CI
- **Config**: `.lighthouserc.js`
- **Budgets**: LCP <2.5s, FID <100ms, CLS <0.1

### Load Testing
- **Tool**: k6
- **Location**: `tests/load/*.js`
- **Scenarios**: Chat messaging, Quest API

### Security Testing
- **Script**: `scripts/security-scan.mjs`
- **Checks**: Dependencies, secrets, XSS, CSRF, RLS

## Project Structure

```
.
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── QuestCard.tsx
│   │   └── MediaUploader.tsx
│   └── utils/              # Utility functions
│       ├── __tests__/      # Unit tests
│       ├── dateTime.ts
│       ├── xp.ts
│       ├── validation.ts
│       └── tier.ts
├── tests/
│   ├── setup.ts            # Test setup
│   ├── integration/        # Integration tests
│   ├── e2e/               # Playwright E2E tests
│   └── load/              # k6 load tests
├── scripts/
│   └── security-scan.mjs   # Security testing script
├── docs/
│   └── qa/                # QA documentation
│       ├── testing-report.md
│       └── security-report.md
├── vitest.config.ts
├── vitest.unit.config.ts
├── vitest.integration.config.ts
├── playwright.config.ts
└── .lighthouserc.js
```

## Configuration Files

- **vitest.config.ts** - Main Vitest configuration with coverage thresholds
- **vitest.unit.config.ts** - Unit test specific config
- **vitest.integration.config.ts** - Integration test config
- **playwright.config.ts** - Playwright E2E test configuration
- **.lighthouserc.js** - Lighthouse CI performance budgets

## CI/CD Integration

All tests run automatically in CI pipeline:
1. Linting and type checking
2. Unit tests with coverage
3. Integration tests
4. E2E tests (Chromium, Firefox, WebKit)
5. Performance testing with Lighthouse
6. Security scans

## Coverage Thresholds

Minimum coverage requirements:
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Performance Budgets

| Metric | Target |
|--------|--------|
| Performance Score | ≥90 |
| LCP | <2.5s |
| FID | <100ms |
| CLS | <0.1 |
| TBT | <300ms |
| Speed Index | <3.0s |

## Load Testing Thresholds

### Chat System
- Max users: 200 concurrent
- P95 latency: <500ms
- Error rate: <1%

### Quest API
- Max requests: 300/min
- P95 response: <1000ms
- Success rate: >95%

## Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## Mobile Devices

- iOS (iPhone 13)
- Android (Pixel 5)
- iPad Pro

## Documentation

See [docs/qa/testing-report.md](docs/qa/testing-report.md) for detailed testing results and recommendations.

## Contributing

When adding new features:
1. Write unit tests for utilities
2. Add integration tests for components
3. Include E2E tests for user flows
4. Update documentation

## License

MIT
