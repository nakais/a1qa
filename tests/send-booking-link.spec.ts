import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test("Send booking link - patient and provider selection", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing send booking link functionality...");
  
  // Generate dynamic link expiration (7-30 days)
  const linkExpiresInDays = faker.number.int({ min: 7, max: 30 });
  
  // Navigate to appointments page
  await page.goto('https://sandbox.useharp.com/appointments');
  console.log("✓ Navigated to appointments page");
  
  // Open send booking link modal
  await page.getByRole('button', { name: 'Send Booking Link' }).click();
  console.log("✓ Opened send booking link modal");
  
  // Search for customer
  await page.getByRole('textbox', { name: 'Search customers by name,' }).fill('michael');
  await expect(page.getByText('MMichael Johnson')).toBeVisible();
  console.log("✓ Found customer: Michael Johnson");
  
  // Select customer
  await page.getByRole('row', { name: 'M Michael Johnson naz+' }).getByRole('checkbox').click();
  console.log("✓ Selected customer: Michael Johnson");
  
  // Deselect all providers and select specific provider
  await page.getByRole('button', { name: 'Deselect All' }).nth(1).click();
  await page.getByRole('checkbox', { name: 'Dr. peyton ENT' }).click();
  console.log("✓ Selected provider: Dr. peyton (ENT)");
  
  // Set link expiration time (dynamic)
  await page.getByRole('spinbutton', { name: 'Link Expires In' }).fill(linkExpiresInDays.toString());
  console.log(`✓ Set link expiration: ${linkExpiresInDays} days`);
  
  // Enable SMS delivery
  await page.getByRole('checkbox', { name: 'SMS' }).click();
  console.log("✓ Enabled SMS delivery");
  
  // Send booking link
  await page.getByRole('button', { name: 'Send to 1 Customer' }).click();
  console.log("✅ Booking link sent successfully");
  
  // Close modal
  await page.getByRole('button', { name: 'Done' }).click();
  console.log("✓ Closed booking link modal");
  
  console.log("✅ Send booking link test PASSED");
});
