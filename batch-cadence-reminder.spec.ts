import { test, expect } from '@playwright/test';

test('batch cadence reminder workflow', async ({ page }) => {
  console.log('Starting batch cadence reminder test');

  // Navigate to Batch Cadence tab
  console.log('Clicking Batch Cadence tab');
  await page.getByRole('tab', { name: 'Batch Cadence' }).click();

  // Select first batch from dropdown
  console.log('Selecting first batch');
  await page.getByRole('combobox').filter({ hasText: 'All Batches (24)' }).click();
  await page.getByText('BATCH_1756477624392_a43028de').click();

  // Clear filters and select different batch
  console.log('Clearing filters and selecting new batch');
  await page.getByRole('button', { name: 'Clear Filters' }).click();
  await page.getByRole('combobox').filter({ hasText: 'All Batches (24)' }).click();
  await page.getByRole('option', { name: 'BATCH_1756494703537_3d69911f' }).click();

  // Navigate through reminder workflow
  console.log('Opening Reminder History');
  await page.getByRole('button', { name: 'Reminder History' }).click();

  console.log('Opening Invoices');
  await page.getByRole('button', { name: 'Invoices' }).click();

  // Send reminder and verify success
  console.log('Sending reminder');
  await page.getByRole('button', { name: 'Send Reminder' }).click();

  console.log('Verifying success message');
  await expect(page.getByText('Successfully sent to ')).toBeVisible();

  console.log('Test completed successfully');
});
