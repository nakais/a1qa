import { test, expect } from '@playwright/test';
import path from 'path';

test('should upload and extract document', async ({ page }) => {
  console.log('Starting document upload test');
  
  // Define file path from testData directory
  const testDataDir = 'D:\\Lab3\\HarpMd\\l3-us-qa\\Staging\\Non-Integrated\\testData';
  const filePath = path.join(testDataDir, 'Customer Inventory Buying Uploaded List.pdf');
  
  // Upload document
  await page.getByRole('button', { name: 'Upload Document' }).click();
  await page.getByRole('button', { name: 'Browse Files' }).setInputFiles(filePath);
  console.log('File uploaded: Customer Inventory Buying Uploaded List.pdf');
  
  // Extract and save document
  await page.getByRole('button', { name: 'Extract Document' }).click();
  console.log('Document extraction initiated');
  
  await page.getByRole('button', { name: 'Confirm & Save' }).click();
  console.log('Document saved successfully');
});
