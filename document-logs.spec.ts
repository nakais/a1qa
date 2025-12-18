import { test, expect } from '@playwright/test';

test('should search and filter document logs', async ({ page }) => {
  console.log('Starting document logs test');
  
  // Navigate to Document Logs
  await page.getByRole('button', { name: '📊 Document Logs' }).click();
  console.log('Navigated to Document Logs');
  
  // Search by customer name
  await page.getByRole('textbox', { name: 'Search documents by title or' }).fill('Michael johnson');
  await expect(page.getByText('Michael Johnson').first()).toBeVisible();
  console.log('Search by customer name: Michael Johnson');
  
  // View and close details
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  console.log('Viewed and closed document details');
  
  // Search by email
  await page.getByRole('textbox', { name: 'Search documents by title or' }).fill('naz+test@labthree.org');
  await expect(page.getByText('naz+test@labthree.org').first()).toBeVisible();
  console.log('Search by email: naz+test@labthree.org');
  
  // Search by document title
  await page.getByRole('textbox', { name: 'Search documents by title or' }).fill('Customer inventory buying list');
  await expect(page.getByText('Customer Inventory Buying List').first()).toBeVisible();
  console.log('Search by document title: Customer Inventory Buying List');
  
  // Clear search
  await page.getByRole('textbox', { name: 'Search documents by title or' }).fill('');
  console.log('Search cleared');
  
  // Filter by status: Sent
  await page.getByRole('combobox').first().selectOption('sent');
  await expect(page.getByText('📤 Sent').first()).toBeVisible();
  console.log('Filtered by status: Sent');
  
  // Filter by status: Received
  await page.getByRole('combobox').first().selectOption('received');
  await expect(page.getByText('📥 Received').first()).toBeVisible();
  console.log('Filtered by status: Received');
  
  // Filter by status: All
  await page.getByRole('combobox').first().selectOption('all');
  console.log('Filtered by status: All');
  
  // Filter by completion: Pending
  await page.getByRole('combobox').nth(1).selectOption('pending');
  console.log('Filtered by completion: Pending');
  
  // Filter by completion: Completed
  await page.getByRole('combobox').nth(1).selectOption('completed');
  console.log('Filtered by completion: Completed');
});
