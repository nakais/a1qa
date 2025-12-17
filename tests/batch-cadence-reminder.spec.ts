import { test, expect } from '@playwright/test';

// =================== BATCH CADENCE REMINDER TESTS ===================

test("Batch cadence reminder workflow with batch selection", async ({ page }) => {
  console.log("🧪 Testing batch cadence reminder workflow...");

  // Navigate to Batch Cadence tab
  await page.getByRole('tab', { name: 'Batch Cadence' }).click();
  console.log("✅ Batch Cadence tab opened");

  // Select first batch from dropdown
  await page.getByRole('combobox').filter({ hasText: 'All Batches (24)' }).click();
  await page.getByText('BATCH_1756477624392_a43028de').click();
  console.log("✅ First batch selected");

  // Clear filters
  await page.getByRole('button', { name: 'Clear Filters' }).click();
  console.log("✅ Filters cleared");

  // Select random batch from dropdown
  await page.getByRole('combobox').filter({ hasText: 'All Batches (24)' }).click();
  const batchOptions = await page.getByRole('option').all();
  const randomIndex = Math.floor(Math.random() * batchOptions.length);
  const selectedBatch = await batchOptions[randomIndex].textContent();
  await batchOptions[randomIndex].click();
  console.log(`✅ Random batch selected: ${selectedBatch}`);

  // Open Reminder History
  await page.getByRole('button', { name: 'Reminder History' }).click();
  console.log("✅ Reminder History opened");

  // Open Invoices
  await page.getByRole('button', { name: 'Invoices' }).click();
  console.log("✅ Invoices view opened");

  // Send reminder
  await page.getByRole('button', { name: 'Send Reminder' }).click();
  console.log("✅ Reminder sent");

  // Verify success message
  await expect(page.getByText('Successfully sent to ')).toBeVisible();
  console.log("✅ Success message displayed");

  console.log("✅ Batch cadence reminder workflow completed successfully");
});
