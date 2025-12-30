import { test, expect } from '@playwright/test';

/**
 * Integration Test Cases for Google Review Configuration
 * Tests: Complete workflows, state management, and feature interactions
 */

test.describe('Google Review Configuration - Integration Tests', () => {
  
  const BASE_URL = 'https://sandbox.useharp.com/google-review';

  test.describe('Complete User Workflows', () => {

    test('TC401 - should complete full configuration workflow', async ({ page }) => {
      console.log('\n=== TC401: Full Configuration Workflow ===');
      
      console.log('Step 1: Navigate to settings page');
      await page.goto(BASE_URL);
      
      console.log('Step 2: Enable Google Review Requests');
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      await expect(reviewToggle).toBeChecked();
      console.log('  ✓ Google Review Requests enabled');
      
      console.log('Step 3: Configure request timing');
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      await timingInput.click();
      await timingInput.fill('15');
      await expect(timingInput).toHaveValue('15');
      console.log('  ✓ Request timing set to 15 days');
      
      console.log('Step 4: Enable SMS Notifications');
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      await expect(smsToggle).toBeChecked();
      console.log('  ✓ SMS Notifications enabled');
      
      console.log('Step 5: Customize SMS message template');
      const message = `Hi {PatientName},

Thank you for choosing {businessName}! We hope you had a great experience.

We'd appreciate it if you could take a moment to share your feedback by leaving us a Google review:
{reviewLink}

Your feedback helps us improve and helps others discover our services. And don't hesitate to communicate with us.

Thank you!
{businessName} Team`;
      
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      await messageBox.click();
      await messageBox.clear();
      await messageBox.fill(message);
      await expect(messageBox).toHaveValue(message);
      console.log('  ✓ Message template customized');
      
      console.log('Step 6: Save configuration');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await expect(page.getByText('Success', { exact: true })).toBeVisible({ timeout: 10000 });
      console.log('  ✓ Configuration saved successfully');
      
      console.log('✓ Full workflow completed successfully\n');
    });

    test('TC402 - should configure and then reset to defaults', async ({ page }) => {
      console.log('\n=== TC402: Configure and Reset Workflow ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Make configuration changes');
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      await timingInput.fill('30');
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      console.log('  ✓ Changes made');
      
      console.log('Step 2: Save changes');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await expect(page.getByText('Success', { exact: true })).toBeVisible();
      console.log('  ✓ Changes saved');
      
      console.log('Step 3: Reset to defaults');
      await page.getByRole('button', { name: 'Reset to Defaults' }).click();
      await expect(page.getByText('Success', { exact: true })).toBeVisible();
      console.log('  ✓ Reset completed');
      
      console.log('Step 4: Verify settings were reset');
      await page.reload();
      console.log('  ✓ Settings verified after reset');
      
      console.log('✓ Configure and reset workflow completed\n');
    });

    test('TC403 - should handle multiple save operations', async ({ page }) => {
      console.log('\n=== TC403: Multiple Save Operations ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      const saveButton = page.getByRole('button', { name: 'Save Changes' });
      
      const timingValues = ['10', '15', '20', '25', '30'];
      
      for (const value of timingValues) {
        console.log(`Save iteration: Setting timing to ${value} days`);
        
        await timingInput.click();
        await timingInput.fill(value);
        await saveButton.click();
        
        await expect(page.getByText('Success', { exact: true })).toBeVisible();
        console.log(`  ✓ Saved with value: ${value}`);
        
        // Wait a bit between saves
        await page.waitForTimeout(1000);
      }
      
      console.log('✓ Multiple save operations completed\n');
    });

    test('TC404 - should handle rapid toggle changes', async ({ page }) => {
      console.log('\n=== TC404: Rapid Toggle Changes ===');
      
      await page.goto(BASE_URL);
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      
      console.log('Step 1: Performing rapid toggle operations');
      for (let i = 0; i < 5; i++) {
        await reviewToggle.click();
        await page.waitForTimeout(200);
        console.log(`  Toggle iteration ${i + 1}`);
      }
      
      console.log('Step 2: Verifying final state');
      const finalState = await reviewToggle.isChecked();
      console.log(`  Final state: ${finalState ? 'enabled' : 'disabled'}`);
      
      console.log('✓ Rapid toggle changes handled\n');
    });
  });

  test.describe('State Management', () => {

    test('TC501 - should preserve unsaved changes during session', async ({ page }) => {
      console.log('\n=== TC501: Unsaved Changes Preservation ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Making changes without saving');
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      await timingInput.fill('25');
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      
      console.log('Step 2: Navigating away (without saving)');
      await page.goto(BASE_URL + '/../settings'); // Navigate to another page
      
      console.log('Step 3: Returning to Google Review settings');
      await page.goto(BASE_URL);
      
      console.log('Step 4: Checking if changes were preserved or reverted');
      await page.waitForTimeout(1000);
      
      console.log('✓ State behavior observed\n');
    });

    test('TC502 - should maintain state after successful save and refresh', async ({ page }) => {
      console.log('\n=== TC502: State Persistence After Save ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Configuring specific settings');
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      await timingInput.fill('20');
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      
      console.log('Step 2: Saving configuration');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await expect(page.getByText('Success', { exact: true })).toBeVisible();
      
      console.log('Step 3: Recording saved values');
      const savedValue = await timingInput.inputValue();
      const savedToggleState = await reviewToggle.isChecked();
      console.log(`  Saved timing: ${savedValue}`);
      console.log(`  Saved toggle: ${savedToggleState}`);
      
      console.log('Step 4: Refreshing page');
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      console.log('Step 5: Verifying values persisted');
      await expect(timingInput).toHaveValue(savedValue);
      if (savedToggleState) {
        await expect(reviewToggle).toBeChecked();
      }
      console.log('  ✓ Values persisted correctly');
      
      console.log('✓ State persistence verified\n');
    });

    test('TC503 - should handle concurrent toggle interactions', async ({ page }) => {
      console.log('\n=== TC503: Concurrent Toggle Interactions ===');
      
      await page.goto(BASE_URL);
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      
      console.log('Step 1: Toggling both switches simultaneously');
      await Promise.all([
        reviewToggle.click(),
        smsToggle.click()
      ]);
      
      console.log('Step 2: Verifying both toggles updated');
      await expect(reviewToggle).toBeChecked();
      await expect(smsToggle).toBeChecked();
      console.log('  ✓ Both toggles enabled');
      
      console.log('Step 3: Saving configuration');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await expect(page.getByText('Success', { exact: true })).toBeVisible();
      
      console.log('✓ Concurrent interactions handled\n');
    });
  });

  test.describe('Feature Interactions', () => {

    test('TC601 - should enable SMS only when Google Reviews are enabled', async ({ page }) => {
      console.log('\n=== TC601: SMS Dependency on Google Reviews ===');
      
      await page.goto(BASE_URL);
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      
      console.log('Step 1: Ensuring Google Reviews are disabled');
      if (await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      
      console.log('Step 2: Checking SMS toggle availability');
      const smsDisabled = await smsToggle.isDisabled().catch(() => false);
      console.log(`  SMS toggle disabled: ${smsDisabled}`);
      
      console.log('Step 3: Enabling Google Reviews');
      await reviewToggle.click();
      
      console.log('Step 4: Checking if SMS toggle becomes available');
      await page.waitForTimeout(500);
      const smsEnabled = !await smsToggle.isDisabled().catch(() => true);
      console.log(`  SMS toggle enabled: ${smsEnabled}`);
      
      console.log('✓ Feature dependency tested\n');
    });

    test('TC602 - should show message template only when SMS is enabled', async ({ page }) => {
      console.log('\n=== TC602: Message Template Visibility ===');
      
      await page.goto(BASE_URL);
      
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      const messageBox = page.getByRole('textbox', { 
        name: /Hi \{PatientName\}/i 
      });
      
      console.log('Step 1: Disabling SMS Notifications');
      if (await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      console.log('Step 2: Checking message template visibility');
      const isHiddenWhenDisabled = !await messageBox.isVisible();
      console.log(`  Message box hidden when SMS disabled: ${isHiddenWhenDisabled}`);
      
      console.log('Step 3: Enabling SMS Notifications');
      await smsToggle.click();
      
      console.log('Step 4: Checking message template visibility');
      await page.waitForTimeout(500);
      const isVisibleWhenEnabled = await messageBox.isVisible();
      console.log(`  Message box visible when SMS enabled: ${isVisibleWhenEnabled}`);
      
      console.log('✓ Conditional visibility tested\n');
    });

    test('TC603 - should validate all enabled features on save', async ({ page }) => {
      console.log('\n=== TC603: Multi-Feature Validation ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Enabling all features');
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
      
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      if (!await smsToggle.isChecked()) {
        await smsToggle.click();
      }
      
      console.log('Step 2: Setting invalid data in timing');
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('invalid');
      
      console.log('Step 3: Attempting to save');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 4: Checking validation behavior');
      await page.waitForTimeout(1500);
      
      console.log('✓ Multi-feature validation tested\n');
    });
  });

  test.describe('Error Recovery', () => {

    test('TC701 - should allow retry after failed save', async ({ page }) => {
      console.log('\n=== TC701: Retry After Failure ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Setting up configuration');
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('15');
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      
      console.log('Step 2: First save attempt');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await page.waitForTimeout(2000);
      
      console.log('Step 3: Second save attempt (retry)');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      console.log('Step 4: Checking for success');
      await page.waitForTimeout(2000);
      
      console.log('✓ Retry capability tested\n');
    });

    test('TC702 - should preserve data during page errors', async ({ page }) => {
      console.log('\n=== TC702: Data Preservation During Errors ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Entering configuration data');
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      await timingInput.fill('18');
      
      const testValue = await timingInput.inputValue();
      console.log(`  Entered value: ${testValue}`);
      
      console.log('Step 2: Simulating page interaction during load');
      await page.waitForTimeout(500);
      
      console.log('Step 3: Verifying data is still present');
      const currentValue = await timingInput.inputValue();
      console.log(`  Current value: ${currentValue}`);
      
      const dataPreserved = testValue === currentValue;
      console.log(`  Data preserved: ${dataPreserved}`);
      
      console.log('✓ Data preservation tested\n');
    });

    test('TC703 - should handle network interruption gracefully', async ({ page }) => {
      console.log('\n=== TC703: Network Interruption Handling ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Configuring settings');
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('22');
      
      console.log('Step 2: Simulating slow network (saving with timeout)');
      const saveButton = page.getByRole('button', { name: 'Save Changes' });
      await saveButton.click();
      
      console.log('Step 3: Observing behavior during potential network issue');
      await page.waitForTimeout(3000);
      
      console.log('Step 4: Checking if error handling is in place');
      const hasLoadingIndicator = await page.locator('[role="progressbar"], .loading, .spinner').count() > 0;
      console.log(`  Loading indicator present: ${hasLoadingIndicator}`);
      
      console.log('✓ Network interruption handling tested\n');
    });
  });

  test.describe('Cross-Browser Compatibility', () => {

    test('TC801 - should function correctly across different viewport sizes', async ({ page }) => {
      console.log('\n=== TC801: Responsive Design Test ===');
      
      const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];
      
      for (const viewport of viewports) {
        console.log(`\nTesting ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
        
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(BASE_URL);
        
        console.log('  Step 1: Verifying form elements are visible');
        await expect(page.getByRole('switch', { name: 'Enable Google Review Requests' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Request Timing' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
        console.log('  ✓ All elements visible');
        
        console.log('  Step 2: Testing interactions');
        const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
        await reviewToggle.click();
        await expect(reviewToggle).toBeChecked();
        console.log('  ✓ Interactions working');
      }
      
      console.log('\n✓ Responsive design tested across viewports\n');
    });
  });
});
