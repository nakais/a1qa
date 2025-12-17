import { test, expect } from '@playwright/test';
import { BatchCadenceHelper } from './helpers';

test('batch cadence reminder workflow', async ({ page }) => {
  const helper = new BatchCadenceHelper(page);

  // Navigate to Batch Cadence tab
  await helper.navigateToBatchCadence();

  // Select first batch
  await page.getByRole('combobox').filter({ hasText: 'All Batches (24)' }).click();
  await page.getByText('BATCH_1756477624392_a43028de').click();

  // Clear filters and select different batch
  await helper.clearFilters();
  await helper.selectBatch('BATCH_1756494703537_3d69911f');

  // Navigate through reminder workflow
  await helper.openReminderHistory();
  await helper.openInvoices();

  // Send reminder and verify success
  await helper.sendReminder();
  await expect(page.getByText('Successfully sent to ')).toBeVisible();

  console.log('Test completed successfully');
});
