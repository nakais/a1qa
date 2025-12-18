import { test, expect } from '@playwright/test';

test.describe('Document and Customer Search', () => {
  const BASE_URL = 'https://sprightly-travesseiro-0bd724.netlify.app';
  
  test('should search document and send to customer by phone number', async ({ page }) => {
    console.log('Starting document and customer search test');
    
    // Navigate to digital documents page
    await page.goto(`${BASE_URL}/digital-documents`);
    console.log('Navigated to digital documents page');
    
    // Search for document
    await page.getByRole('textbox', { name: 'Search documents by name...' }).click();
    await page.getByRole('textbox', { name: 'Search documents by name...' }).fill('customer inventory buying list');
    await page.getByRole('textbox', { name: 'Search documents by name...' }).press('Enter');
    await expect(page.getByText('Customer Inventory Buying List')).toBeVisible();
    console.log('Document found: Customer Inventory Buying List');
    
    // Initiate send document flow
    await page.getByRole('button', { name: 'Send' }).click();
    console.log('Clicked Send button');
    
    // Test customer search by name
    await page.getByRole('textbox', { name: 'Search customers by name,' }).click();
    await page.getByRole('textbox', { name: 'Search customers by name,' }).fill('michael johnson');
    await expect(page.getByText('Michael Johnson')).toBeVisible();
    console.log('Customer found by name: Michael Johnson');
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Test customer search by email
    await page.getByRole('button', { name: 'Send' }).click();
    await page.getByRole('textbox', { name: 'Search customers by name,' }).click();
    await page.getByRole('textbox', { name: 'Search customers by name,' }).fill('naz+test@labthree.org');
    await expect(page.getByText('naz+test@labthree.org')).toBeVisible();
    console.log('Customer found by email: naz+test@labthree.org');
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Search customer by phone and send document
    await page.getByRole('button', { name: 'Send' }).click();
    await page.getByRole('textbox', { name: 'Search customers by name,' }).click();
    await page.getByRole('textbox', { name: 'Search customers by name,' }).fill('5551234567');
    console.log('Searching customer by phone: 5551234567');
    
    // Select customer from results
    await page.getByRole('cell', { name: '5551234567' }).first().click();
    await page.getByRole('row', { name: 'M Michael Johnson naz+test@' }).getByRole('checkbox').check();
    console.log('Customer selected');
    
    // Send document
    await page.getByRole('button', { name: 'Send Document' }).click();
    console.log('Document send initiated');
    
    // Verify success
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    console.log('Document sent successfully');
  });
});
