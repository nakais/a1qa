import { test, expect, Page } from '@playwright/test';

/**
 * Test Suite: Google Review Request Configuration
 * 
 * This test suite validates the Google Review Request settings page functionality,
 * including enabling/disabling features, configuring settings, and saving changes.
 */

test.describe('Google Review Request Configuration', () => {
  
  // Test configuration constants
  const TEST_CONFIG = {
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

  /**
   * Helper function to enable/disable a toggle switch
   */
  async function toggleSwitch(page: Page, switchName: string, enable: boolean = true) {
    console.log(`${enable ? 'Enabling' : 'Disabling'} switch: ${switchName}`);
    const switchElement = page.getByRole('switch', { name: switchName });
    
    // Check current state and toggle if needed
    const isChecked = await switchElement.isChecked().catch(() => false);
    if (isChecked !== enable) {
      await switchElement.click();
    }
  }

  /**
   * Helper function to fill a textbox with logging
   */
  async function fillTextbox(page: Page, label: string, value: string) {
    console.log(`Filling textbox "${label}" with value: ${value.substring(0, 50)}...`);
    const textbox = page.getByRole('textbox', { name: label });
    await textbox.click();
    await textbox.fill(value);
  }

  /**
   * Helper function to verify success message
   */
  async function verifySuccess(page: Page) {
    console.log('Verifying success message...');
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    console.log('✓ Success message confirmed');
  }

  test('should configure Google Review Request settings and save successfully', async ({ page }) => {
    console.log('\n=== Starting Google Review Configuration Test ===\n');
    
    // Step 1: Navigate to the Google Review settings page
    console.log(`Step 1: Navigating to ${TEST_CONFIG.url}`);
    await page.goto(TEST_CONFIG.url);
    console.log('✓ Page loaded successfully\n');

    // Step 2: Enable Google Review Requests
    console.log('Step 2: Enabling Google Review Requests');
    await toggleSwitch(page, 'Enable Google Review Requests', true);
    console.log('✓ Google Review Requests enabled\n');

    // Step 3: Set Request Timing
    console.log('Step 3: Configuring Request Timing');
    await fillTextbox(page, 'Request Timing', TEST_CONFIG.requestTiming);
    console.log(`✓ Request Timing set to ${TEST_CONFIG.requestTiming} days\n`);

    // Step 4: Enable SMS Notifications
    console.log('Step 4: Enabling SMS Notifications');
    await toggleSwitch(page, 'SMS Notifications', true);
    console.log('✓ SMS Notifications enabled\n');

    // Step 5: Customize SMS Message Template
    console.log('Step 5: Customizing SMS Message Template');
    const messageBoxLabel = 'Hi {PatientName}, Thank you for choosing {businessName}! We hope you had a';
    await fillTextbox(page, messageBoxLabel, TEST_CONFIG.customMessage);
    console.log('✓ Custom message template applied\n');

    // Step 6: Save Changes
    console.log('Step 6: Saving configuration changes');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await verifySuccess(page);
    console.log('✓ Configuration saved successfully\n');

    // Step 7: Reset to Defaults
    console.log('Step 7: Testing Reset to Defaults functionality');
    await page.getByRole('button', { name: 'Reset to Defaults' }).click();
    await verifySuccess(page);
    console.log('✓ Settings reset to defaults successfully\n');

    console.log('=== Test Completed Successfully ===\n');
  });

  test('should toggle Google Review Requests on and off', async ({ page }) => {
    console.log('\n=== Testing Toggle Functionality ===\n');
    
    await page.goto(TEST_CONFIG.url);
    
    // Enable the feature
    console.log('Enabling Google Review Requests...');
    await toggleSwitch(page, 'Enable Google Review Requests', true);
    let switchElement = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    await expect(switchElement).toBeChecked();
    console.log('✓ Feature enabled');

    // Disable the feature
    console.log('Disabling Google Review Requests...');
    await toggleSwitch(page, 'Enable Google Review Requests', false);
    switchElement = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    await expect(switchElement).not.toBeChecked();
    console.log('✓ Feature disabled');

    console.log('\n=== Toggle Test Completed ===\n');
  });

  test('should validate Request Timing input field', async ({ page }) => {
    console.log('\n=== Testing Request Timing Validation ===\n');
    
    await page.goto(TEST_CONFIG.url);
    
    // Test different timing values
    const testValues = ['1', '7', '15', '30'];
    
    for (const value of testValues) {
      console.log(`Testing Request Timing value: ${value}`);
      await fillTextbox(page, 'Request Timing', value);
      
      const textbox = page.getByRole('textbox', { name: 'Request Timing' });
      await expect(textbox).toHaveValue(value);
      console.log(`✓ Value "${value}" accepted`);
    }

    console.log('\n=== Request Timing Validation Test Completed ===\n');
  });

  test('should customize and save SMS message template', async ({ page }) => {
    console.log('\n=== Testing SMS Message Template Customization ===\n');
    
    await page.goto(TEST_CONFIG.url);
    
    // Enable SMS Notifications first
    await toggleSwitch(page, 'SMS Notifications', true);
    
    // Define a custom message
    const customMessage = `Hello {PatientName},

Thank you for your visit to {businessName}. We value your feedback!

Please review us here: {reviewLink}

Best regards,
{businessName}`;

    console.log('Applying custom message template...');
    const messageBoxLabel = 'Hi {PatientName}, Thank you for choosing {businessName}! We hope you had a';
    await fillTextbox(page, messageBoxLabel, customMessage);
    
    // Verify the message was set
    const textbox = page.getByRole('textbox', { name: messageBoxLabel });
    await expect(textbox).toHaveValue(customMessage);
    console.log('✓ Custom message template verified');

    // Save the changes
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await verifySuccess(page);
    
    console.log('\n=== SMS Message Template Test Completed ===\n');
  });
});
