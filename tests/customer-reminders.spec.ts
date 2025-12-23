import { test, expect } from '@playwright/test';

test('Customer reminders - send and filter', async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing customer reminders functionality...");
  
  // Search for customer
  await page.getByRole('textbox', { name: 'Search customers...' }).fill('john mccarthy');
  await expect(page.getByText('John McCarthy', { exact: true })).toBeVisible();
  await page.getByText('JMJohn McCarthy100%Customer').dblclick();
  console.log("✓ Opened John McCarthy's profile");

  // Navigate to Reminders tab
  await page.getByRole('combobox').dblclick();
  await page.getByRole('option', { name: 'Reminders' }).click();
  console.log("✓ Opened Reminders tab");

  // Send first reminder: Payment On Account Custom (Both Email + SMS)
  await page.getByRole('button', { name: 'Send Reminder' }).click();
  await page.getByRole('button', { name: 'Payment On Account Custom' }).click();
  console.log("✓ Selected Payment On Account Custom reminder");
  
  // Switch to Both (Email + SMS)
  await page.getByRole('tab', { name: 'SMS' }).click();
  await page.getByRole('tab', { name: 'Both' }).click();
  console.log("✓ Selected Both (Email + SMS) delivery method");
  
  // Enter amount and send
  await page.getByPlaceholder('0.00').fill('2');
  await page.getByRole('button', { name: 'Send Both Reminders' }).click();
  console.log("✓ Sent reminder with $2 amount");

  // Verify reminder sent timestamp appears
  try {
    await expect(page.locator('div').filter({ hasText: /^Last Senta few seconds ago$/ }).nth(1)).toBeVisible();
    console.log("✅ Verified 'Last Sent' timestamp updated");
  } catch (error) {
    console.log("❌ ERROR: 'Last Sent' timestamp did not appear");
    throw new Error("Reminder timestamp not found");
  }

  // Send second reminder: Co Pay Custom encounter (Email only)
  await page.getByRole('button', { name: 'Send Reminder' }).click();
  await page.getByRole('button', { name: 'Co Pay Custom encounter' }).click();
  console.log("✓ Selected Co Pay Custom encounter reminder");
  
  await page.getByPlaceholder('0.00').fill('2');
  await page.getByRole('button', { name: 'Send Email Reminder' }).click();
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  console.log("✅ Second reminder sent successfully");

  // Test filter dropdowns
  console.log("Testing reminder filters...");
  
  // Filter by type: All Types -> Email Only -> SMS Only
  await page.getByRole('combobox').filter({ hasText: 'All Types' }).click();
  await page.getByRole('option', { name: 'Email Only' }).click();
  console.log("✓ Filtered to Email Only");
  
  await page.getByRole('combobox').filter({ hasText: 'Email Only' }).click();
  await page.getByRole('option', { name: 'SMS Only' }).click();
  console.log("✓ Filtered to SMS Only");
  
  // Sort order: Newest First -> Oldest First
  await page.getByRole('combobox').filter({ hasText: 'Newest First' }).click();
  await page.getByText('Oldest First').click();
  console.log("✓ Changed sort to Oldest First");

  // Clear filters
  await page.getByRole('button', { name: 'Clear All' }).click();
  console.log("✓ Cleared all filters");

  // Close modals
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Close' }).first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  console.log("✓ Closed all modals");

  console.log("✅ Customer reminders test PASSED");
});
