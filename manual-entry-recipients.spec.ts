import { test, expect } from '@playwright/test';

test.describe('Manual Entry Recipients', () => {
  
  test('should send document to manually entered recipients', async ({ page }) => {
    console.log('Starting manual entry recipients test');
    
    // Navigate to Digital Documents
    await page.locator('a').filter({ hasText: 'Digital Documents' }).click();
    console.log('Navigated to Digital Documents');
    
    // Search for document
    await page.getByRole('textbox', { name: 'Search documents by name...' }).click();
    await page.getByRole('textbox', { name: 'Search documents by name...' }).fill('customer inventory buying list');
    await expect(page.getByText('Customer Inventory Buying List')).toBeVisible();
    console.log('Document found: Customer Inventory Buying List');
    
    // Start send flow with manual entry
    await page.getByRole('button', { name: 'Send' }).click();
    await page.getByRole('button', { name: 'Manual Entry' }).click();
    console.log('Selected Manual Entry option');
    
    // Add first recipient
    await page.getByRole('button', { name: 'Add Your First Recipient' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('John McCarthy');
    await page.getByRole('textbox', { name: 'john@example.com' }).fill('naz+test@labthree.org');
    await page.getByRole('checkbox', { name: 'SMS' }).check();
    await page.getByRole('textbox', { name: '+' }).fill('7755057115');
    await page.getByRole('button', { name: 'Add Recipient' }).click();
    console.log('Added first recipient: John McCarthy');
    
    // Add second recipient
    const recipient2Section = page.locator('div').filter({ hasText: /^Recipient 2Name \*Email \*Phone \*Note \(Optional\)$/ });
    await recipient2Section.getByPlaceholder('John Doe').fill('Michael Johnson');
    await recipient2Section.getByPlaceholder('john@example.com').fill('john@gmail.com');
    await recipient2Section.getByPlaceholder('+').fill('5553453455');
    console.log('Added second recipient: Michael Johnson');
    
    // Send document
    await page.getByRole('button', { name: 'Send Document' }).click();
    console.log('Document send initiated');
    
    // Verify success
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    console.log('Document sent successfully to both recipients');
  });
});
