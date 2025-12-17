# Batch Cadence Tests

Playwright test suite for batch cadence reminder workflow.

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Debug mode
npm run test:debug

# View report
npm run report
```

## Project Structure

```
tests/
  └── batch-cadence-reminder.spec.ts  # Main test file
playwright.config.ts                   # Playwright configuration
package.json                           # Dependencies
```