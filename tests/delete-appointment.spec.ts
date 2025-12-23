import { test, expect } from '@playwright/test';

test("Delete appointment - find and remove scheduled appointment", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing delete appointment functionality...");
  
  // Login
  await page.goto('https://sandbox.useharp.com/login');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('mohi+nih@labthree.org');
  await page.getByRole('textbox', { name: 'Password' }).fill('Mohi@12345');
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log("✓ Logged in successfully");
  
  // Navigate to appointments
  await page.goto('https://sandbox.useharp.com/dashboard');
  await page.getByRole('link', { name: 'Appointments' }).click();
  console.log("✓ Navigated to appointments page");
  
  // Filter to show only Dr. peyton's calendar
  await page.getByRole('button', { name: 'Select Lists (3/3)' }).click();
  await page.getByRole('button', { name: 'Deselect All' }).click();
  await page.getByRole('checkbox', { name: 'Dr. peyton' }).click();
  console.log("✓ Filtered to Dr. peyton's calendar");
  
  // Verify calendar is visible
  await expect(page.locator('div').filter({ hasText: 'Calendar ManagementManage' }).nth(4)).toBeVisible();
  console.log("✓ Calendar loaded");
  
  // Find a date with appointments (dynamic search)
  console.log("🔍 Searching for date with appointments...");
  
  let appointmentFound = false;
  let selectedDate = null;
  
  // Look for dates with appointment count indicators like "24(2)" - day 24 with 2 appointments
  // These appear as text elements with pattern: number followed by (count)
  const dateElements = await page.locator('text=/^\\d+\\(\\d+\\)$/').all();
  
  if (dateElements.length === 0) {
    console.log("❌ ERROR: No appointments found on any date");
    throw new Error("No appointments available to delete");
  }
  
  // Click on first date with appointments
  const firstDateWithAppt = dateElements[0];
  const dateText = await firstDateWithAppt.textContent();
  await firstDateWithAppt.click();
  selectedDate = dateText;
  console.log(`✅ Found date with appointments: ${dateText}`);
  
  // Wait for appointment details to load
  await page.waitForTimeout(1000);
  
  // Find and click on first appointment in the list
  // Appointments show format: "Name Time Status: Pending"
  const appointmentLocator = page.locator('div').filter({ 
    hasText: /Status: Pending|Status: Confirmed|Status: Checked In/ 
  }).first();
  
  const appointmentVisible = await appointmentLocator.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (!appointmentVisible) {
    console.log("❌ ERROR: No appointment details found");
    throw new Error("Could not find appointment to delete");
  }
  
  await appointmentLocator.click();
  const appointmentInfo = await appointmentLocator.textContent();
  console.log(`✓ Selected appointment: ${appointmentInfo?.substring(0, 50)}...`);
  
  // Delete the appointment
  await page.getByRole('button', { name: 'Delete' }).click();
  console.log("✓ Clicked Delete button");
  
  await page.getByRole('button', { name: 'Delete Calendar' }).click();
  console.log("✓ Confirmed deletion");
  
  // Verify success
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  console.log("✅ Appointment deleted successfully");
  
  console.log("✅ Delete appointment test PASSED");
});
