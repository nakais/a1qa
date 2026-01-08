# E2E Testing Suite - Digital Document Sending

Playwright end-to-end testing suite for digital document sending functionality.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
BASE_URL=https://sprightly-travesseiro-0bd724.netlify.app
ADMIN_EMAIL=your_admin@example.com
ADMIN_PASSWORD=your_password
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run specific test suite
```bash
npm run test:digital-docs
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## Test Structure

```
tests/
├── Global/
│   └── login-utils.js          # Authentication utilities
└── e2e/
    └── digital-documents/
        └── digital-document-sending.spec.js  # Main test file
```

## Test Coverage

### Digital Document Sending Test

This test verifies the complete flow of sending digital documents to customers:

1. **Search for Document** - Navigate to digital documents page and search
2. **Select Customer** - Choose customer recipient from search results
3. **Send Document** - Send document and verify success message
4. **Navigate to Customer** - Go to customer profile page
5. **Verify Document** - Check document appears in customer's digital documents
6. **Send Additional Document** - Send another document from customer profile

## Configuration

- **Timeout**: 90 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Browsers**: Chromium (can enable Firefox and WebKit)
- **Screenshots**: On failure
- **Video**: On failure
- **Trace**: On first retry

## CI/CD

The test suite is configured for CI/CD environments with:
- Automatic retries on failure
- Parallel test execution control
- Multiple reporter formats (HTML, JSON, list)
- Screenshot and video artifacts on failure
