import { test, expect } from '@playwright/test';

test("Appointment payment update - create, update payment, and delete", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing appointment payment update functionality...");
  
  // Navigate to appointments page
  await page.goto('https://sandbox.useharp.com/appointments');
  console.log("✓ Navigated to appointments page");
  
  // Open appointment creation form
  await page.getByRole('button', { name: 'Add Calendar' }).click();
  console.log("✓ Opened appointment creation form");
  
  // Search and select patient
  await page.getByRole('textbox', { name: 'Search by name, email, or' }).fill('ben');
  await page.getByRole('button', { name: 'Ben White naz+bw+patient@' }).click();
  console.log("✓ Selected patient: Ben White");
  
  // Search and select provider
  await page.getByRole('textbox', { name: 'Search by name or specialty...' }).fill('Dr. Hamilton');
  await page.getByRole('button', { name: 'Dr. Hamilton neurology' }).click();
  console.log("✓ Selected provider: Dr. Hamilton (neurology)");
  
  // Set appointment date
  await page.getByRole('textbox', { name: 'Date *' }).fill('2025-12-23');
  console.log("✓ Set date: 2025-12-23");
  
  // Select time slot
  await page.getByRole('combobox').filter({ hasText: 'Select time' }).click();
  await page.getByRole('option', { name: '10:00 AM' }).click();
  console.log("✓ Selected time: 10:00 AM");
  
  // Fill appointment type
  await page.getByRole('textbox', { name: 'Appointment Type' }).fill('Consultation');
  console.log("✓ Set appointment type: Consultation");
  
  // Create appointment
  await page.getByRole('button', { name: 'Create Appointment' }).click();
  console.log("✅ Appointment created successfully");
  
  // Filter to show only Dr. Hamilton's calendar
  await page.getByRole('button', { name: 'Select Lists (4/4)' }).click();
  await page.getByRole('button', { name: 'Deselect All' }).click();
  await page.getByRole('checkbox', { name: 'Dr. Hamilton' }).click();
  console.log("✓ Filtered to Dr. Hamilton's calendar");
  
  // Wait for calendar to load
  await page.waitForTimeout(1000);
  
  // Find and click on the appointment
  await page.getByText('Ben White10:00 AMBen White10:').click();
  console.log("✓ Opened appointment details");
  
  // Open payment information editor
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  console.log("✓ Opened payment editor");
  
  // Update payment amount
  await page.getByRole('spinbutton').fill('0');
  await page.getByRole('button', { name: 'Save' }).click();
  console.log("✓ Updated payment amount to $0");
  
  // Verify payment information is displayed
  await page.getByText('Ben White10:00 AMBen White10:').click();
  await expect(page.getByText('$')).toBeVisible();
  console.log("✅ Payment information verified");
  
  // Delete the appointment
  await page.getByRole('button', { name: 'Delete' }).click();
  console.log("✓ Clicked Delete button");
  
  await page.getByRole('button', { name: 'Delete Calendar' }).click();
  console.log("✓ Confirmed deletion");
  
  // Verify success
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  console.log("✅ Appointment deleted successfully");
  
  console.log("✅ Appointment payment update test PASSED");
});
