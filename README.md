# Document and Customer Search Test Suite

Playwright test suite for document and customer search functionality.

## Test Coverage

### Test Files:
1. **document-customer-search.spec.ts** - Document search and customer selection
2. **manual-entry-recipients.spec.ts** - Manual entry of multiple recipients
3. **upload-document.spec.ts** - Document upload and extraction

## Setup

### Install Dependencies
```bash
npm install
npx playwright install chromium
```

### Setup Test Files (for upload tests)
Place your test PDF files in the `test-files/` directory:
- `Customer Inventory Buying List.pdf`
- `Customer Inventory Buying Uploaded List.pdf`

See `test-files/README.md` for more details.

## Run Tests

```bash
# Run all tests (headless)
npm test

# Run specific test file
npx playwright test upload-document.spec.ts

# Headed mode (see browser)
npm run test:headed

# UI mode (interactive)
npm run test:ui
```

## Project Structure

- `document-customer-search.spec.ts` - Search and send document to customer
- `manual-entry-recipients.spec.ts` - Manual recipient entry test
- `upload-document.spec.ts` - File upload test
- `playwright.config.ts` - Playwright configuration
- `test-files/` - Directory for test PDF files
- `package.json` - Dependencies and scripts
