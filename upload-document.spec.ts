import { test, expect } from '@playwright/test';
import path from 'path';

test('should upload and extract document', async ({ page }) => {
  console.log('Starting document upload test');
  
  // Define file paths from testData directory
  const testDataDir = 'D:\\Lab3\\HarpMd\\l3-us-qa\\Staging\\Non-Integrated\\testData';
  const file1 = path.join(testDataDir, 'Customer Inventory Buying List.pdf');
  const file2 = path.join(testDataDir, 'Customer Inventory Buying Uploaded List.pdf');
  
  // First upload attempt - cancel
  await page.getByRole('button', { name: 'Upload Document' }).click();
  await page.getByRole('button', { name: 'Browse Files' }).setInputFiles(file1);
  await page.getByRole('button', { name: 'Cancel' }).click();
  console.log('First upload cancelled');
  
  // Second upload attempt - complete
  await page.getByRole('button', { name: 'Upload Document' }).click();
  await page.getByRole('button', { name: 'Browse Files' }).setInputFiles(file2);
  console.log('File uploaded: Customer Inventory Buying Uploaded List.pdf');
  
  // Extract and save document
  await page.getByRole('button', { name: 'Extract Document' }).click();
  console.log('Document extraction initiated');
  
  await page.getByRole('button', { name: 'Confirm & Save' }).click();
  console.log('Document saved successfully');
});
