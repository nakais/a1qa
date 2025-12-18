# Document and Customer Search Test

Playwright test suite for document and customer search functionality.

## Test Coverage

The test verifies:
- Document search by name
- Customer search by name, email, and phone number
- Document sending to selected customer
- Success confirmation

## Structure

- `document-customer-search.spec.ts` - Main test file with helper functions
- `playwright.config.ts` - Playwright configuration
- `package.json` - Dependencies and scripts

## Setup

```bash
npm install
```

## Run Tests

```bash
# Headless mode
npm test

# Headed mode (see browser)
npm run test:headed

# UI mode (interactive)
npm run test:ui
```

## Key Improvements

1. **Helper Functions**: Extracted `searchDocument()` and `searchCustomer()` for reusability
2. **Console Logging**: Added strategic console logs to track test progress
3. **Constants**: Extracted BASE_URL for easier maintenance
4. **Comments**: Added descriptive comments for each test section
5. **Test Organization**: Wrapped in `test.describe()` for better structure
