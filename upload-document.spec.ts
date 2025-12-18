import { test, expect } from '@playwright/test';
import * as path from 'path';

test('should upload and extract document', async ({ page }) => {
  console.log('Starting document upload test');
  
  // Define file path - use path.resolve for absolute path
  const filePath = path.resolve('D:/Lab3/HarpMd/l3-us-qa/Staging/Non-Integrated/testData/Digital document upload.pdf');
  
  // Upload document
  await page.getByRole('button', { name: 'Upload Document' }).click();
  await page.getByRole('button', { name: 'Browse Files' }).setInputFiles(filePath);
  console.log('File uploaded: Digital document upload.pdf');
  
  // Extract and save document
  await page.getByRole('button', { name: 'Extract Document' }).click();
  console.log('Document extraction initiated');
  
  await page.getByRole('button', { name: 'Confirm & Save' }).click();
  console.log('Document saved successfully');
  
  // Verify success
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  console.log('Document sent successfully');
});
