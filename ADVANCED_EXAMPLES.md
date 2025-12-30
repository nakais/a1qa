# Advanced Test Examples

This document provides advanced examples and patterns for extending the test suite.

## 📚 Table of Contents

1. [API Mocking](#api-mocking)
2. [Data-Driven Testing](#data-driven-testing)
3. [Visual Regression Testing](#visual-regression-testing)
4. [Performance Testing](#performance-testing)
5. [Accessibility Testing](#accessibility-testing)
6. [Page Object Model](#page-object-model)
7. [Custom Fixtures](#custom-fixtures)
8. [Retry Strategies](#retry-strategies)
9. [Test Data Factories](#test-data-factories)
10. [Advanced Assertions](#advanced-assertions)

---

## 1. API Mocking

### Mock API responses for reliable tests

```typescript
import { test, expect } from '@playwright/test';

test('should handle API failures gracefully', async ({ page }) => {
  // Mock the save endpoint to return an error
  await page.route('**/api/google-review/settings', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  await page.goto(TEST_CONFIG.url);
  await toggleSwitch(page, 'Enable Google Review Requests', true);
  await clickButton(page, 'Save Changes');
  
  // Verify error message is shown
  await expect(page.getByText('Failed to save settings')).toBeVisible();
});

test('should handle slow API responses', async ({ page }) => {
  // Mock with delay to test loading states
  await page.route('**/api/google-review/settings', async route => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true })
    });
  });

  await page.goto(TEST_CONFIG.url);
  await clickButton(page, 'Save Changes');
  
  // Verify loading indicator appears
  await expect(page.getByRole('progressbar')).toBeVisible();
  
  // Verify success after loading
  await verifySuccess(page);
});
```

---

## 2. Data-Driven Testing

### Test multiple scenarios with different data sets

```typescript
import { test } from '@playwright/test';

const testScenarios = [
  {
    name: 'Minimum timing value',
    timing: '1',
    expected: 'Settings saved successfully'
  },
  {
    name: 'Maximum timing value',
    timing: '365',
    expected: 'Settings saved successfully'
  },
  {
    name: 'Invalid negative value',
    timing: '-1',
    expected: 'Please enter a positive number'
  },
  {
    name: 'Invalid non-numeric value',
    timing: 'abc',
    expected: 'Please enter a valid number'
  },
  {
    name: 'Empty value',
    timing: '',
    expected: 'This field is required'
  }
];

testScenarios.forEach(({ name, timing, expected }) => {
  test(`Request Timing: ${name}`, async ({ page }) => {
    console.log(`\n=== Testing: ${name} ===`);
    
    await page.goto(TEST_CONFIG.url);
    await fillTextbox(page, 'Request Timing', timing, false);
    await clickButton(page, 'Save Changes');
    
    await expect(page.getByText(expected)).toBeVisible();
    console.log(`✓ Verified: ${expected}`);
  });
});
```

---

## 3. Visual Regression Testing

### Capture and compare screenshots

```typescript
import { test, expect } from '@playwright/test';

test('should match visual snapshot of settings page', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Take screenshot and compare with baseline
  await expect(page).toHaveScreenshot('settings-page.png', {
    maxDiffPixels: 100, // Allow minor differences
    threshold: 0.2      // 20% threshold
  });
});

test('should match snapshot after configuration', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Configure settings
  await toggleSwitch(page, 'Enable Google Review Requests', true);
  await fillTextbox(page, 'Request Timing', '15');
  
  // Capture configured state
  await expect(page).toHaveScreenshot('settings-configured.png');
});

test('should match snapshot of success message', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  await clickButton(page, 'Save Changes');
  
  // Capture success state
  const successElement = page.getByText('Success', { exact: true });
  await expect(successElement).toHaveScreenshot('success-message.png');
});
```

---

## 4. Performance Testing

### Measure and assert performance metrics

```typescript
import { test, expect } from '@playwright/test';

test('should load page within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto(TEST_CONFIG.url);
  
  const loadTime = Date.now() - startTime;
  console.log(`Page load time: ${loadTime}ms`);
  
  // Assert load time is under 3 seconds
  expect(loadTime).toBeLessThan(3000);
});

test('should measure and report performance metrics', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
      loadComplete: perf.loadEventEnd - perf.loadEventStart,
      domInteractive: perf.domInteractive - perf.fetchStart,
      ttfb: perf.responseStart - perf.requestStart
    };
  });
  
  console.log('Performance Metrics:', metrics);
  
  // Assert metrics are within acceptable ranges
  expect(metrics.ttfb).toBeLessThan(500); // Time to first byte < 500ms
  expect(metrics.domInteractive).toBeLessThan(2000); // DOM interactive < 2s
});
```

---

## 5. Accessibility Testing

### Test WCAG compliance and accessibility

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('should be accessible according to WCAG standards', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Inject axe-core
  await injectAxe(page);
  
  // Run accessibility checks
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  });
});

test('should have proper ARIA labels', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Check switch has proper ARIA attributes
  const switchElement = page.getByRole('switch', { name: 'Enable Google Review Requests' });
  const ariaLabel = await switchElement.getAttribute('aria-label');
  
  expect(ariaLabel).toBeTruthy();
  console.log(`✓ Switch has ARIA label: ${ariaLabel}`);
});

test('should be keyboard navigable', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Tab through elements
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  
  // Verify focus is on expected element
  const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  console.log(`Focused element: ${focusedElement}`);
  
  // Activate with keyboard
  await page.keyboard.press('Space');
  
  // Verify action was performed
  const switchElement = page.getByRole('switch', { name: 'Enable Google Review Requests' });
  await expect(switchElement).toBeChecked();
});
```

---

## 6. Page Object Model

### Organize tests with Page Objects

```typescript
// google-review-page.ts
import { Page } from '@playwright/test';

export class GoogleReviewPage {
  constructor(private page: Page) {}

  // Locators
  get enableSwitch() {
    return this.page.getByRole('switch', { name: 'Enable Google Review Requests' });
  }

  get smsSwitch() {
    return this.page.getByRole('switch', { name: 'SMS Notifications' });
  }

  get timingInput() {
    return this.page.getByRole('textbox', { name: 'Request Timing' });
  }

  get saveButton() {
    return this.page.getByRole('button', { name: 'Save Changes' });
  }

  get resetButton() {
    return this.page.getByRole('button', { name: 'Reset to Defaults' });
  }

  get successMessage() {
    return this.page.getByText('Success', { exact: true });
  }

  // Actions
  async goto() {
    await this.page.goto('https://sandbox.useharp.com/google-review');
  }

  async enableGoogleReviews() {
    if (!await this.enableSwitch.isChecked()) {
      await this.enableSwitch.click();
    }
  }

  async disableGoogleReviews() {
    if (await this.enableSwitch.isChecked()) {
      await this.enableSwitch.click();
    }
  }

  async setRequestTiming(days: string) {
    await this.timingInput.click();
    await this.timingInput.fill(days);
  }

  async enableSMS() {
    if (!await this.smsSwitch.isChecked()) {
      await this.smsSwitch.click();
    }
  }

  async save() {
    await this.saveButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async verifySuccess() {
    await this.successMessage.waitFor({ state: 'visible' });
  }
}

// Usage in test
test('should configure using Page Object Model', async ({ page }) => {
  const googleReviewPage = new GoogleReviewPage(page);
  
  await googleReviewPage.goto();
  await googleReviewPage.enableGoogleReviews();
  await googleReviewPage.setRequestTiming('15');
  await googleReviewPage.enableSMS();
  await googleReviewPage.save();
  await googleReviewPage.verifySuccess();
});
```

---

## 7. Custom Fixtures

### Create reusable test fixtures

```typescript
import { test as base } from '@playwright/test';
import { GoogleReviewPage } from './google-review-page';

// Extend base test with custom fixtures
type MyFixtures = {
  googleReviewPage: GoogleReviewPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  googleReviewPage: async ({ page }, use) => {
    const googleReviewPage = new GoogleReviewPage(page);
    await googleReviewPage.goto();
    await use(googleReviewPage);
  },

  authenticatedPage: async ({ page }, use) => {
    // Perform authentication
    await page.goto('https://sandbox.useharp.com/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await use(page);
  }
});

// Usage
test('should use custom fixtures', async ({ googleReviewPage }) => {
  // Page is already initialized and navigated
  await googleReviewPage.enableGoogleReviews();
  await googleReviewPage.save();
});
```

---

## 8. Retry Strategies

### Implement smart retry logic

```typescript
import { test, expect } from '@playwright/test';

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = initialDelay * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

test('should retry flaky operations', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // Retry save operation with backoff
  await retryWithBackoff(async () => {
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Success')).toBeVisible({ timeout: 2000 });
  }, 3, 1000);
});

// Configure retry at test level
test.describe('Flaky tests', () => {
  test.use({ retries: 3 });
  
  test('might fail sometimes', async ({ page }) => {
    // Test that might need retries
  });
});
```

---

## 9. Test Data Factories

### Generate test data dynamically

```typescript
import { test } from '@playwright/test';

// Test data factory
class TestDataFactory {
  static randomEmail(): string {
    return `test-${Date.now()}@example.com`;
  }

  static randomPhone(): string {
    return `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }

  static randomMessage(): string {
    const templates = [
      'Thank you for your visit!',
      'We appreciate your feedback!',
      'Please review us on Google!'
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  static googleReviewConfig(overrides?: Partial<GoogleReviewSettings>): GoogleReviewSettings {
    return {
      enabled: true,
      requestTiming: 15,
      smsNotifications: {
        enabled: true,
        messageTemplate: this.randomMessage()
      },
      ...overrides
    };
  }
}

// Usage
test('should save random configuration', async ({ page }) => {
  const config = TestDataFactory.googleReviewConfig({
    requestTiming: 30
  });
  
  await page.goto(TEST_CONFIG.url);
  await toggleSwitch(page, 'Enable Google Review Requests', config.enabled);
  await fillTextbox(page, 'Request Timing', config.requestTiming.toString());
  
  console.log('Testing with config:', config);
});
```

---

## 10. Advanced Assertions

### Custom matchers and assertions

```typescript
import { test, expect } from '@playwright/test';

// Custom matcher for toggle state
expect.extend({
  async toBeInState(element: Locator, expectedState: 'enabled' | 'disabled') {
    const isChecked = await element.isChecked();
    const actualState = isChecked ? 'enabled' : 'disabled';
    
    const pass = actualState === expectedState;
    
    return {
      pass,
      message: () => pass
        ? `Expected element not to be ${expectedState}`
        : `Expected element to be ${expectedState}, but was ${actualState}`
    };
  }
});

test('should use custom matchers', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  const switchElement = page.getByRole('switch', { name: 'Enable Google Review Requests' });
  
  // Use custom matcher
  await expect(switchElement).toBeInState('disabled');
  
  await switchElement.click();
  
  await expect(switchElement).toBeInState('enabled');
});

// Soft assertions (don't stop test on failure)
test('should perform soft assertions', async ({ page }) => {
  await page.goto(TEST_CONFIG.url);
  
  // These won't stop the test if they fail
  await expect.soft(page.getByText('Google Review Settings')).toBeVisible();
  await expect.soft(page.getByRole('switch')).toHaveCount(2);
  await expect.soft(page.getByRole('button', { name: 'Save' })).toBeEnabled();
  
  // Test continues even if soft assertions failed
  console.log('Test completed');
});
```

---

## 🎯 Putting It All Together

### Complete advanced test example

```typescript
import { test, expect } from '@playwright/test';
import { GoogleReviewPage } from './google-review-page';
import { TestDataFactory } from './test-data-factory';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Advanced Google Review Tests', () => {
  let googleReviewPage: GoogleReviewPage;

  test.beforeEach(async ({ page }) => {
    googleReviewPage = new GoogleReviewPage(page);
    await googleReviewPage.goto();
  });

  test('should perform comprehensive validation', async ({ page }) => {
    // Generate test data
    const config = TestDataFactory.googleReviewConfig();
    
    // Measure performance
    const startTime = Date.now();
    
    // Configure settings
    await googleReviewPage.enableGoogleReviews();
    await googleReviewPage.setRequestTiming(config.requestTiming.toString());
    await googleReviewPage.enableSMS();
    
    // Take visual snapshot
    await expect(page).toHaveScreenshot('configured-state.png');
    
    // Check accessibility
    await injectAxe(page);
    await checkA11y(page);
    
    // Save with retry
    await retryWithBackoff(async () => {
      await googleReviewPage.save();
      await googleReviewPage.verifySuccess();
    });
    
    // Verify performance
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000);
    
    console.log(`✓ Test completed in ${duration}ms`);
  });
});
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [API Testing with Playwright](https://playwright.dev/docs/api-testing)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)

---

These advanced patterns will help you build a robust, maintainable test suite that can handle complex scenarios and scale with your application! 🚀
