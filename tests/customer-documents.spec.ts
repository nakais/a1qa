import { test, expect } from '@playwright/test';

test("View customer details, and digital documents tab", async ({ page }) => {
  console.log("🧪 Testing customer details and digital documents tab...");
  
  // Search for customer
  await page.getByRole('textbox', { name: 'Search customers...' }).fill('sarah robinson');
  await expect(page.getByText('Sarah Robinson', { exact: true })).toBeVisible();
  await page.getByText('SRSarah Robinson100%Customer').click();
  console.log("✓ Opened Sarah Robinson's profile");

  // Navigate to Digital Documents tab
  await page.getByRole('combobox').click();
  await expect(page.getByLabel('Documents', { exact: true })).toBeVisible();
  await page.getByLabel('Documents').getByText('Documents').click();
  console.log("✓ Opened Documents tab");

  // Verify sent document appears
  try {
    await expect(page.getByText('Full Form').first()).toBeVisible({ timeout: 10000 });
    console.log("✅ Verified document in Sent Documents list");
  } catch (error) {
    console.log("❌ ERROR: E2E Customer Form did not appear in Sent Documents list");
    throw new Error("E2E Customer Form not found in customer's Sent Documents");
  }

  // Check tabs dynamically
  const sentTab = page.getByRole('tab', { name: /Sent Documents/ });
  const completedTab = page.getByRole('tab', { name: /Completed Documents/ });
  
  await completedTab.click();
  console.log("✓ Checked Completed Documents tab");
  
  await sentTab.click();
  console.log("✓ Returned to Sent Documents tab");

  // Open send documents modal
  await page.getByRole('button', { name: 'Send Documents' }).click();
  console.log("✓ Opened send documents modal");

  // Search for Full Form
  await page.getByRole("textbox", { name: "Search documents..." }).fill("Full Form");
  await expect(page.getByLabel("Send Documents to Sarah")).toContainText("Full Form");
  console.log("✓ Found document: Full Form");

  // Dynamic customer name and document selection
  await expect(page.getByLabel(/Send Documents to/)).toContainText('Full Form');
  console.log("✓ Found document: Full Form");
  
  // Select document - click on label (works regardless of size/date)
  await page.locator("label").filter({ hasText: /Full Form/ }).first().check();
  console.log("✓ Selected document");
  
  // Verify checkbox is checked
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  console.log("✓ Checkbox confirmed checked");

  // Send document
  await page.getByRole("button", { name: /Send \(\d+\)/ }).click();
  await page.waitForTimeout(2000); // Wait for sending process
  await expect(page.getByText("Success")).toBeVisible();
  console.log("✅ Document sent successfully");

  // Close modal
  await page.getByRole('button', { name: 'Close' }).click();

  console.log("✅ Customer details and digital documents tab test PASSED");
});
