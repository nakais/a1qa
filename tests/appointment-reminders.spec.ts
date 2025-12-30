import { test, expect } from '@playwright/test';

test.describe('Appointment Reminders Settings', () => {
  const reminderDays = '5';
  const emailBodyTemplate = `Dear {patientFirstName},

This is a reminder that your appointment is tomorrow:

Date: {appointmentDate}
Time: {appointmentTime}
Provider: {providerName}
Location: {facilityName}

Confirm: {confirmationLink}

If you need to cancel or reschedule, please contact us at {businessPhone}.

We look forward to seeing you! don't hesitate to contact us

Best regards,
{businessName}`;

  const emailBodyTemplateDynamic = `Dear {patientFirstName},

This is a reminder that your appointment is in ${reminderDays} days:

Date: {appointmentDate}
Time: {appointmentTime}
Provider: {providerName}
Location: {facilityName}

Confirm: {confirmationLink}

If you need to cancel or reschedule, please contact us at {businessPhone}.

We look forward to seeing you! don't hesitate to contact us

Best regards,
{businessName}`;

  test.beforeEach(async ({ page }) => {
    // Navigate to the appointment reminders page before each test
    // using domcontentloaded to avoid waiting for slow external resources
    await page.goto('https://sandbox.useharp.com/appointment-reminders', { waitUntil: 'domcontentloaded' });
  });

  test('should allow discarding changes to email body', async ({ page }) => {
    console.log('Starting test: should allow discarding changes to email body');
    
    // Select the Email tab
    await page.getByRole('button', { name: 'Email' }).first().click();
    
    // Edit the Email Body
    await page.getByRole('textbox', { name: 'Email Body' }).click();
    await page.getByRole('textbox', { name: 'Email Body' }).fill(emailBodyTemplate);
    
    // Reset changes
    await page.getByRole('button', { name: 'Reset' }).click();
    
    // Edit again
    await page.getByRole('textbox', { name: 'Email Body' }).click();
    await page.getByRole('textbox', { name: 'Email Body' }).fill(emailBodyTemplate);
    
    // Discard changes via the main action button
    await page.getByRole('button', { name: 'Discard Changes' }).click();
    
    // Verify toast or notification
    await expect(page.getByText('Changes Discarded')).toBeVisible();
    console.log('Changes discarded successfully');
  });

  test('should allow adding, editing, and removing a reminder (Lifecycle)', async ({ page }) => {
     console.log(`Starting lifecycle test: Add -> Edit -> Remove for ${reminderDays} days`);

    // 1. ADD REMINDER
    await page.getByRole('textbox', { name: 'e.g.,' }).click();
    await page.getByRole('textbox', { name: 'e.g.,' }).fill(reminderDays);
    await page.getByRole('button', { name: 'Add Reminder' }).click();
    await expect(page.getByText('Day Added')).toBeVisible();
    console.log('Reminder added');
    
    // 2. EDIT REMINDER EMAIL
    // Assuming the new reminder appears at the specific index or we find it.
    // The original code used .nth(1) for the second email tab.
    await page.getByRole('button', { name: 'Email' }).nth(1).click();
    
    // Click on the existing text to focus (simulating user) or just fill
    // We use the generalized textbox locator
    await page.getByRole('textbox', { name: 'Email Body' }).fill(emailBodyTemplateDynamic);
    
    // Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify Success
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    await expect(page.getByText(`${reminderDays} days before appointment`)).toBeVisible();
    console.log('Reminder edited and saved');

    // 3. REMOVE REMINDER
    // We use the locator from the original codegen.
    // Note: This relies on the button position.
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
    
    await expect(page.getByText('Day Removed')).toBeVisible();
    
    // Save Changes after removal
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    
    console.log('Reminder removed successfully');
  });

});
