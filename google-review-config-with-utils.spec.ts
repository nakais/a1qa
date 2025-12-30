import { test, expect } from '@playwright/test';
import {
  toggleSwitch,
  fillTextbox,
  clickButton,
  verifySuccess,
  logSection,
  logStep,
  validateConfig,
  type TestConfig
} from './test-utils';

/**
 * Test Suite: Google Review Request Configuration (Using Utilities)
 * 
 * This is an alternative version of the test suite that demonstrates
 * how to use the reusable utilities from test-utils.ts
 */

test.describe('Google Review Request Configuration (With Utilities)', () => {
  
  // Test configuration with validation
  const TEST_CONFIG: TestConfig = {
    url: 'https://sandbox.useharp.com/google-review',
    requestTiming: '15',
    customMessage: `Hi {PatientName},

Thank you for choosing {businessName}! We hope you had a great experience.

We'd appreciate it if you could take a moment to share your feedback by leaving us a Google review:
{reviewLink}

Your feedback helps us improve and helps others discover our services. And don't hesitate to communicate with us.

Thank you!
{businessName} Team`
  };

  // Validate configuration before running tests
  test.beforeAll(() => {
    validateConfig(TEST_CONFIG, ['url', 'requestTiming', 'customMessage']);
  });

  test('should configure Google Review Request settings with utilities', async ({ page }) => {
    logSection('Google Review Configuration Test', 1);
    
    // Step 1: Navigate
    logStep(1, `Navigating to ${TEST_CONFIG.url}`);
    await page.goto(TEST_CONFIG.url);
    
    // Step 2: Enable Google Review Requests
    logStep(2, 'Enabling Google Review Requests');
    await toggleSwitch(page, 'Enable Google Review Requests', true);
    
    // Step 3: Set Request Timing
    logStep(3, 'Configuring Request Timing');
    await fillTextbox(page, 'Request Timing', TEST_CONFIG.requestTiming!);
    
    // Step 4: Enable SMS Notifications
    logStep(4, 'Enabling SMS Notifications');
    await toggleSwitch(page, 'SMS Notifications', true);
    
    // Step 5: Customize SMS Message
    logStep(5, 'Customizing SMS Message Template');
    const messageBoxLabel = 'Hi {PatientName}, Thank you for choosing {businessName}! We hope you had a';
    await fillTextbox(page, messageBoxLabel, TEST_CONFIG.customMessage!);
    
    // Step 6: Save Changes
    logStep(6, 'Saving configuration');
    await clickButton(page, 'Save Changes');
    await verifySuccess(page);
    
    // Step 7: Reset to Defaults
    logStep(7, 'Resetting to defaults');
    await clickButton(page, 'Reset to Defaults');
    await verifySuccess(page);
    
    logSection('Test Completed Successfully', 1);
  });

  test('should handle toggle states correctly', async ({ page }) => {
    logSection('Toggle State Management Test', 1);
    
    await page.goto(TEST_CONFIG.url);
    
    // Test enabling
    await toggleSwitch(page, 'Enable Google Review Requests', true);
    const switchElement = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    await expect(switchElement).toBeChecked();
    
    // Test disabling
    await toggleSwitch(page, 'Enable Google Review Requests', false);
    await expect(switchElement).not.toBeChecked();
    
    logSection('Toggle Test Completed', 1);
  });

  test('should accept various request timing values', async ({ page }) => {
    logSection('Request Timing Validation Test', 1);
    
    await page.goto(TEST_CONFIG.url);
    
    const testValues = [
      { value: '1', description: '1 day' },
      { value: '7', description: '1 week' },
      { value: '15', description: '15 days' },
      { value: '30', description: '1 month' }
    ];
    
    for (const { value, description } of testValues) {
      console.log(`Testing: ${description}`);
      await fillTextbox(page, 'Request Timing', value, true, false);
    }
    
    logSection('Timing Validation Completed', 1);
  });

  test('should save custom SMS template', async ({ page }) => {
    logSection('SMS Template Customization Test', 1);
    
    await page.goto(TEST_CONFIG.url);
    
    // Enable SMS first
    await toggleSwitch(page, 'SMS Notifications', true);
    
    // Apply custom template
    const customTemplate = `Hello {PatientName}!

Thanks for visiting {businessName}. Please review us at: {reviewLink}

- {businessName} Team`;
    
    const messageBoxLabel = 'Hi {PatientName}, Thank you for choosing {businessName}! We hope you had a';
    await fillTextbox(page, messageBoxLabel, customTemplate);
    
    // Save
    await clickButton(page, 'Save Changes');
    await verifySuccess(page);
    
    logSection('Template Customization Completed', 1);
  });
});
