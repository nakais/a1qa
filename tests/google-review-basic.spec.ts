import { test, expect } from '@playwright/test';

/**
 * Basic Test Cases for Google Review Configuration
 * Tests: Core functionality and happy path scenarios
 */

test.describe('Google Review Configuration - Basic Tests', () => {
  
  const BASE_URL = 'https://sandbox.useharp.com/google-review';

  test('TC001 - should load the Google Review settings page successfully', async ({ page }) => {
    console.log('\n=== TC001: Page Load Test ===');
    
    // Navigate to the page
    console.log('Step 1: Navigating to settings page');
    await page.goto(BASE_URL);
    
    // Verify page loaded
    console.log('Step 2: Verifying page elements');
    await expect(page).toHaveTitle(/Google Review|Settings/i);
    await expect(page.getByRole('heading', { name: /Google Review/i })).toBeVisible();
    
    console.log('✓ Page loaded successfully\n');
  });

  test('TC002 - should enable Google Review Requests toggle', async ({ page }) => {
    console.log('\n=== TC002: Enable Toggle Test ===');
    
    await page.goto(BASE_URL);
    
    // Locate the toggle
    const toggleSwitch = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    
    // Check initial state
    console.log('Step 1: Checking initial toggle state');
    const initialState = await toggleSwitch.isChecked().catch(() => false);
    console.log(`Initial state: ${initialState ? 'enabled' : 'disabled'}`);
    
    // Enable if not already enabled
    if (!initialState) {
      console.log('Step 2: Enabling the toggle');
      await toggleSwitch.click();
      await expect(toggleSwitch).toBeChecked();
      console.log('✓ Toggle enabled successfully');
    } else {
      console.log('✓ Toggle already enabled');
    }
    
    console.log('✓ Test completed\n');
  });

  test('TC003 - should disable Google Review Requests toggle', async ({ page }) => {
    console.log('\n=== TC003: Disable Toggle Test ===');
    
    await page.goto(BASE_URL);
    
    const toggleSwitch = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    
    // Ensure it's enabled first
    console.log('Step 1: Ensuring toggle is enabled');
    if (!await toggleSwitch.isChecked()) {
      await toggleSwitch.click();
    }
    
    // Disable it
    console.log('Step 2: Disabling the toggle');
    await toggleSwitch.click();
    await expect(toggleSwitch).not.toBeChecked();
    console.log('✓ Toggle disabled successfully\n');
  });

  test('TC004 - should input valid request timing value', async ({ page }) => {
    console.log('\n=== TC004: Request Timing Input Test ===');
    
    await page.goto(BASE_URL);
    
    const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
    
    console.log('Step 1: Clicking on Request Timing input');
    await timingInput.click();
    
    console.log('Step 2: Entering value "15"');
    await timingInput.fill('15');
    
    console.log('Step 3: Verifying the value');
    await expect(timingInput).toHaveValue('15');
    
    console.log('✓ Request timing set successfully\n');
  });

  test('TC005 - should enable SMS Notifications toggle', async ({ page }) => {
    console.log('\n=== TC005: SMS Notifications Toggle Test ===');
    
    await page.goto(BASE_URL);
    
    const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
    
    console.log('Step 1: Enabling SMS Notifications');
    if (!await smsToggle.isChecked()) {
      await smsToggle.click();
    }
    
    console.log('Step 2: Verifying toggle is enabled');
    await expect(smsToggle).toBeChecked();
    
    console.log('✓ SMS Notifications enabled\n');
  });

  test('TC006 - should update SMS message template', async ({ page }) => {
    console.log('\n=== TC006: SMS Message Template Update Test ===');
    
    await page.goto(BASE_URL);
    
    // Enable SMS first
    const smsToggle = page.getByRole('switch', { name: 'SMS Notifications' });
    if (!await smsToggle.isChecked()) {
      await smsToggle.click();
    }
    
    const messageTemplate = `Hi {PatientName},

Thank you for choosing {businessName}! We hope you had a great experience.

We'd appreciate it if you could take a moment to share your feedback by leaving us a Google review:
{reviewLink}

Your feedback helps us improve and helps others discover our services. And don't hesitate to communicate with us.

Thank you!
{businessName} Team`;

    console.log('Step 1: Locating message template field');
    const messageBox = page.getByRole('textbox', { 
      name: /Hi \{PatientName\}.*Thank you for choosing/i 
    });
    
    console.log('Step 2: Clearing and entering new message');
    await messageBox.click();
    await messageBox.clear();
    await messageBox.fill(messageTemplate);
    
    console.log('Step 3: Verifying message was updated');
    await expect(messageBox).toHaveValue(messageTemplate);
    
    console.log('✓ Message template updated successfully\n');
  });

  test('TC007 - should save configuration changes', async ({ page }) => {
    console.log('\n=== TC007: Save Configuration Test ===');
    
    await page.goto(BASE_URL);
    
    console.log('Step 1: Enabling Google Review Requests');
    const toggleSwitch = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    if (!await toggleSwitch.isChecked()) {
      await toggleSwitch.click();
    }
    
    console.log('Step 2: Setting request timing');
    await page.getByRole('textbox', { name: 'Request Timing' }).fill('15');
    
    console.log('Step 3: Clicking Save Changes button');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    console.log('Step 4: Verifying success message');
    await expect(page.getByText('Success', { exact: true })).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Configuration saved successfully\n');
  });

  test('TC008 - should reset settings to defaults', async ({ page }) => {
    console.log('\n=== TC008: Reset to Defaults Test ===');
    
    await page.goto(BASE_URL);
    
    console.log('Step 1: Modifying some settings');
    await page.getByRole('textbox', { name: 'Request Timing' }).fill('30');
    
    console.log('Step 2: Clicking Reset to Defaults button');
    await page.getByRole('button', { name: 'Reset to Defaults' }).click();
    
    console.log('Step 3: Verifying success message');
    await expect(page.getByText('Success', { exact: true })).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Settings reset successfully\n');
  });

  test('TC009 - should display all required form elements', async ({ page }) => {
    console.log('\n=== TC009: Form Elements Visibility Test ===');
    
    await page.goto(BASE_URL);
    
    console.log('Verifying presence of all form elements:');
    
    // Check toggles
    console.log('  - Google Review Requests toggle');
    await expect(page.getByRole('switch', { name: 'Enable Google Review Requests' })).toBeVisible();
    
    console.log('  - SMS Notifications toggle');
    await expect(page.getByRole('switch', { name: 'SMS Notifications' })).toBeVisible();
    
    // Check input fields
    console.log('  - Request Timing input');
    await expect(page.getByRole('textbox', { name: 'Request Timing' })).toBeVisible();
    
    // Check buttons
    console.log('  - Save Changes button');
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    
    console.log('  - Reset to Defaults button');
    await expect(page.getByRole('button', { name: 'Reset to Defaults' })).toBeVisible();
    
    console.log('✓ All form elements are visible\n');
  });

  test('TC010 - should maintain toggle state after page refresh', async ({ page }) => {
    console.log('\n=== TC010: State Persistence Test ===');
    
    await page.goto(BASE_URL);
    
    console.log('Step 1: Enabling toggle');
    const toggleSwitch = page.getByRole('switch', { name: 'Enable Google Review Requests' });
    if (!await toggleSwitch.isChecked()) {
      await toggleSwitch.click();
    }
    
    console.log('Step 2: Saving changes');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    
    console.log('Step 3: Refreshing page');
    await page.reload();
    
    console.log('Step 4: Verifying toggle state persisted');
    await expect(toggleSwitch).toBeChecked();
    
    console.log('✓ State persisted after refresh\n');
  });
});
