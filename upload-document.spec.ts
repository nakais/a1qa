import { test, expect } from '@playwright/test';

test('should upload and extract document', async ({ page }) => {
  console.log('Starting document upload test');
  
  // First upload attempt - cancel
  await page.getByRole('button', { name: 'Upload Document' }).click();
  await page.getByRole('button', { name: 'Browse Files' }).setInputFiles('Customer Inventory Buying List.pdf');
  await page.getByRole('button', { name: 'Cancel' }).click();
  console.log('First upload cancelled');
  
  // Second upload attempt - complete
  await page.getByRole('button', { name: 'Upload Document' }).click();
  await page.getByRole('button', { name: 'Browse Files' }).setInputFiles('Customer Inventory Buying Uploaded List.pdf');
  console.log('File uploaded: Customer Inventory Buying Uploaded List.pdf');
  
  // Extract and save document
  await page.getByRole('button', { name: 'Extract Document' }).click();
  console.log('Document extraction initiated');
  
  await page.getByRole('button', { name: 'Confirm & Save' }).click();
  console.log('Document saved successfully');
});
