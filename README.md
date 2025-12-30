# Google Review Request Configuration Tests

This repository contains end-to-end tests for the Google Review Request Configuration page using Playwright.

## Overview

The test suite validates the functionality of the Google Review Request settings page, including:
- Enabling/disabling Google Review Requests
- Configuring request timing
- Managing SMS notification settings
- Customizing SMS message templates
- Saving and resetting configurations

## Project Structure

```
/workspace/
├── google-review-config.spec.ts  # Main test suite
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

## Test Suite Details

### `google-review-config.spec.ts`

#### Test 1: Complete Configuration Flow
**Test Name:** `should configure Google Review Request settings and save successfully`

**What it tests:**
1. Navigates to the Google Review settings page
2. Enables Google Review Requests toggle
3. Sets request timing to 15 days
4. Enables SMS Notifications
5. Customizes the SMS message template
6. Saves the configuration
7. Verifies success message
8. Resets settings to defaults
9. Verifies reset success

**Key Features:**
- Comprehensive logging for each step
- Success verification at critical points
- Tests both save and reset functionality

#### Test 2: Toggle Functionality
**Test Name:** `should toggle Google Review Requests on and off`

**What it tests:**
- Enables the Google Review Requests feature
- Verifies the toggle is checked
- Disables the feature
- Verifies the toggle is unchecked

#### Test 3: Request Timing Validation
**Test Name:** `should validate Request Timing input field`

**What it tests:**
- Tests multiple timing values (1, 7, 15, 30 days)
- Verifies each value is accepted and displayed correctly

#### Test 4: SMS Template Customization
**Test Name:** `should customize and save SMS message template`

**What it tests:**
- Enables SMS notifications
- Applies a custom message template
- Verifies the template was applied
- Saves the configuration
- Verifies success

## Helper Functions

The test suite includes reusable helper functions:

### `toggleSwitch(page, switchName, enable)`
Enables or disables a toggle switch with logging.

**Parameters:**
- `page`: Playwright Page object
- `switchName`: Label of the switch to toggle
- `enable`: Boolean to enable (true) or disable (false)

### `fillTextbox(page, label, value)`
Fills a textbox with the specified value and logs the action.

**Parameters:**
- `page`: Playwright Page object
- `label`: Label of the textbox
- `value`: Value to fill

### `verifySuccess(page)`
Verifies that a success message is displayed after an action.

## Configuration

### Test Configuration Object

The tests use a centralized configuration object for easy maintenance:

```typescript
const TEST_CONFIG = {
  url: 'https://sandbox.useharp.com/google-review',
  requestTiming: '15',
  customMessage: `Hi {PatientName}, ...`
};
```

To modify test data, update this object in `google-review-config.spec.ts`.

## Improvements from Codegen

The original codegen code has been improved in the following ways:

1. **Removed Redundant Actions**: Eliminated unnecessary arrow key presses and multiple clicks
2. **Added Structure**: Organized into multiple focused test cases
3. **Added Logging**: Console logs for debugging and test progress tracking
4. **Made Dynamic**: Helper functions for reusable actions
5. **Added Comments**: Clear documentation for each test and function
6. **Better Assertions**: Proper verification of toggle states and values
7. **Maintainability**: Configuration object for easy updates

## Browser Support

Tests run on:
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## CI/CD Integration

The tests are configured for CI/CD with:
- Automatic retries on failure (2 retries in CI)
- Screenshot capture on failure
- Video recording on failure
- HTML and JSON reports
- Trace collection for debugging

## Debugging

### View traces
When a test fails, traces are automatically collected. View them with:
```bash
npx playwright show-trace trace.zip
```

### Debug a specific test
```bash
npx playwright test --debug -g "should configure Google Review"
```

### Run with Playwright Inspector
```bash
npm run test:debug
```

## Contributing

When adding new tests:
1. Follow the existing naming convention
2. Add console.log statements for debugging
3. Use helper functions where possible
4. Add comments explaining complex interactions
5. Update this README if adding new features

## License

MIT
