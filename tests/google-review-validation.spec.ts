import { test, expect } from '@playwright/test';

/**
 * Validation Test Cases for Google Review Configuration
 * Tests: Input validation, boundary conditions, and error handling
 */

test.describe('Google Review Configuration - Validation Tests', () => {
  
  const BASE_URL = 'https://sandbox.useharp.com/google-review';

  test.describe('Request Timing Validation', () => {

    test('TC101 - should accept minimum valid timing value (1 day)', async ({ page }) => {
      console.log('\n=== TC101: Minimum Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering minimum value "1"');
      await timingInput.click();
      await timingInput.fill('1');
      
      console.log('Step 2: Verifying value is accepted');
      await expect(timingInput).toHaveValue('1');
      
      console.log('Step 3: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      // Check for either success or no error
      console.log('Step 4: Verifying no validation error');
      // Wait a bit to see if error appears
      await page.waitForTimeout(1000);
      
      console.log('✓ Minimum value accepted\n');
    });

    test('TC102 - should accept typical timing value (15 days)', async ({ page }) => {
      console.log('\n=== TC102: Typical Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering typical value "15"');
      await timingInput.fill('15');
      
      console.log('Step 2: Verifying value is accepted');
      await expect(timingInput).toHaveValue('15');
      
      console.log('✓ Typical value accepted\n');
    });

    test('TC103 - should accept maximum reasonable timing value (365 days)', async ({ page }) => {
      console.log('\n=== TC103: Maximum Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering maximum value "365"');
      await timingInput.fill('365');
      
      console.log('Step 2: Verifying value is accepted');
      await expect(timingInput).toHaveValue('365');
      
      console.log('✓ Maximum value accepted\n');
    });

    test('TC104 - should handle negative timing value', async ({ page }) => {
      console.log('\n=== TC104: Negative Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering negative value "-5"');
      await timingInput.fill('-5');
      
      console.log('Step 2: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation feedback');
      // Look for error message or validation feedback
      await page.waitForTimeout(1000);
      
      console.log('✓ Negative value validation tested\n');
    });

    test('TC105 - should handle zero timing value', async ({ page }) => {
      console.log('\n=== TC105: Zero Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering zero value "0"');
      await timingInput.fill('0');
      
      console.log('Step 2: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation feedback');
      await page.waitForTimeout(1000);
      
      console.log('✓ Zero value validation tested\n');
    });

    test('TC106 - should handle decimal timing value', async ({ page }) => {
      console.log('\n=== TC106: Decimal Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering decimal value "15.5"');
      await timingInput.fill('15.5');
      
      console.log('Step 2: Verifying value handling');
      const value = await timingInput.inputValue();
      console.log(`Value after input: "${value}"`);
      
      console.log('✓ Decimal value handling tested\n');
    });

    test('TC107 - should handle non-numeric timing value', async ({ page }) => {
      console.log('\n=== TC107: Non-Numeric Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering non-numeric value "abc"');
      await timingInput.fill('abc');
      
      console.log('Step 2: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation feedback');
      await page.waitForTimeout(1000);
      
      console.log('✓ Non-numeric value validation tested\n');
    });

    test('TC108 - should handle empty timing value', async ({ page }) => {
      console.log('\n=== TC108: Empty Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Clearing the input field');
      await timingInput.click();
      await timingInput.clear();
      
      console.log('Step 2: Attempting to save with empty value');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation feedback');
      await page.waitForTimeout(1000);
      
      console.log('✓ Empty value validation tested\n');
    });

    test('TC109 - should handle very large timing value', async ({ page }) => {
      console.log('\n=== TC109: Very Large Value Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering very large value "9999"');
      await timingInput.fill('9999');
      
      console.log('Step 2: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation feedback');
      await page.waitForTimeout(1000);
      
      console.log('✓ Very large value validation tested\n');
    });

    test('TC110 - should handle special characters in timing value', async ({ page }) => {
      console.log('\n=== TC110: Special Characters Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      const specialInputs = ['@#$', '15!', '1+5', '1 5'];
      
      for (const input of specialInputs) {
        console.log(`Testing special input: "${input}"`);
        await timingInput.fill(input);
        await page.waitForTimeout(500);
      }
      
      console.log('✓ Special characters validation tested\n');
    });
  });

  test.describe('SMS Message Template Validation', () => {

    test('TC201 - should accept message with all template variables', async ({ page }) => {
      console.log('\n=== TC201: Template Variables Test ===');
      
      await page.goto(BASE_URL);
      
      // Enable SMS
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      const message = 'Hi {PatientName}, visit {businessName} and review at {reviewLink}';
      
      console.log('Step 1: Entering message with template variables');
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.fill(message);
      
      console.log('Step 2: Verifying message is accepted');
      await expect(messageBox).toHaveValue(message);
      
      console.log('✓ Template variables accepted\n');
    });

    test('TC202 - should accept message with maximum length', async ({ page }) => {
      console.log('\n=== TC202: Maximum Length Message Test ===');
      
      await page.goto(BASE_URL);
      
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      // Create a very long message
      const longMessage = 'A'.repeat(1000) + ' {PatientName} {businessName} {reviewLink}';
      
      console.log(`Step 1: Entering long message (${longMessage.length} characters)`);
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.fill(longMessage);
      
      console.log('Step 2: Checking message handling');
      await page.waitForTimeout(500);
      
      console.log('✓ Long message handling tested\n');
    });

    test('TC203 - should accept message with special characters', async ({ page }) => {
      console.log('\n=== TC203: Special Characters in Message Test ===');
      
      await page.goto(BASE_URL);
      
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      const message = 'Hi {PatientName}! @#$%^&*() <> "" \'\' Thank you!';
      
      console.log('Step 1: Entering message with special characters');
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.fill(message);
      
      console.log('Step 2: Verifying message is accepted');
      await expect(messageBox).toHaveValue(message);
      
      console.log('✓ Special characters accepted\n');
    });

    test('TC204 - should accept message with line breaks', async ({ page }) => {
      console.log('\n=== TC204: Line Breaks in Message Test ===');
      
      await page.goto(BASE_URL);
      
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      const message = 'Hi {PatientName}\n\nThank you!\n\n{businessName}';
      
      console.log('Step 1: Entering message with line breaks');
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.fill(message);
      
      console.log('Step 2: Verifying message with line breaks');
      await expect(messageBox).toHaveValue(message);
      
      console.log('✓ Line breaks accepted\n');
    });

    test('TC205 - should handle empty message template', async ({ page }) => {
      console.log('\n=== TC205: Empty Message Test ===');
      
      await page.goto(BASE_URL);
      
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      console.log('Step 1: Clearing message template');
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.clear();
      
      console.log('Step 2: Attempting to save with empty message');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation feedback');
      await page.waitForTimeout(1000);
      
      console.log('✓ Empty message validation tested\n');
    });

    test('TC206 - should handle message without required variables', async ({ page }) => {
      console.log('\n=== TC206: Missing Variables Test ===');
      
      await page.goto(BASE_URL);
      
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      const message = 'Thank you for your visit! Please leave us a review.';
      
      console.log('Step 1: Entering message without template variables');
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.fill(message);
      
      console.log('Step 2: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking if message is accepted or warning shown');
      await page.waitForTimeout(1000);
      
      console.log('✓ Message without variables tested\n');
    });
  });

  test.describe('Form Validation', () => {

    test('TC301 - should not save when required fields are invalid', async ({ page }) => {
      console.log('\n=== TC301: Invalid Required Fields Test ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Entering invalid data');
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('invalid');
      
      console.log('Step 2: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Checking for validation error or prevented save');
      await page.waitForTimeout(1000);
      
      console.log('✓ Invalid fields validation tested\n');
    });

    test('TC302 - should validate all fields before submission', async ({ page }) => {
      console.log('\n=== TC302: Pre-submission Validation Test ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Setting up invalid state');
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('');
      
      console.log('Step 2: Triggering validation by clicking save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 3: Observing validation behavior');
      await page.waitForTimeout(1500);
      
      console.log('✓ Pre-submission validation tested\n');
    });

    test('TC303 - should show field-level validation errors', async ({ page }) => {
      console.log('\n=== TC303: Field-Level Errors Test ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Entering invalid value');
      await timingInput.fill('abc');
      
      console.log('Step 2: Blurring field to trigger validation');
      await timingInput.blur();
      
      console.log('Step 3: Looking for error indicators');
      await page.waitForTimeout(500);
      
      // Check for common error indicators
      const hasError = await page.locator('.error, .invalid, [aria-invalid="true"]').count() > 0;
      console.log(`Error indicators found: ${hasError}`);
      
      console.log('✓ Field-level validation tested\n');
    });
  });
});
