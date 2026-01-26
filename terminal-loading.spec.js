const { test, expect } = require('@playwright/test');

test('Checking terminal are loading successfully', async () => {
  const page = adminSuite.getPage();
  console.log('Setting up credit card terminal payment...');

  // Select Sale transaction type
  // Select Sale
  await page.getByRole('button', { name: 'Sale' }).click();
  await page.getByRole('menuitem', { name: 'Sale' }).click();
  console.log('OK Selected Sale');

  // Select Credit Card payment method
  await page.getByRole('button', { name: 'Credit Card', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Credit Card' }).click();
  console.log('OK Selected Credit Card');

  // Select Credit Card Terminal option
  await page.getByRole('button', { name: 'Card present' }).click();
  await page.getByRole('menuitem', { name: 'Credit Card Terminal' }).click();
  console.log('OK Selected Credit Card Terminal');

  // Open terminal selection
  await page.getByRole('button', { name: 'Choose a terminal' }).click();
  console.log('OK Opened terminal selection');

  // Check if terminals are available
  const noTerminalsMessage = page.getByText('No terminals available', { exact: false });
  const isNoTerminals = await noTerminalsMessage.isVisible().catch(() => false);

  if (isNoTerminals) {
    console.error('ERROR No terminals available');
    throw new Error('Credit card terminal not available - test failed');
  }

  await expect(page.getByText('Terminal 1Terminal 2Terminal')).toBeVisible();

  // Verify at least one terminal option exists
  const terminalOptions = page
    .locator('[role="option"], [role="menuitem"]')
    .filter({ hasText: /terminal|reader/i });
  const terminalCount = await terminalOptions.count();

  if (terminalCount === 0) {
    console.error('ERROR No terminal options found');
    throw new Error('No credit card terminals found in the list');
  }

  console.log(`OK Found ${terminalCount} terminal(s) available`);
});

test('test', async ({ page }) => {
  await page.getByRole('button', { name: 'Pay Now' }).click();
  await page.getByRole('button', { name: 'Sale' }).click();
  await page.getByRole('menuitem', { name: 'Sale' }).click();
  await page.getByRole('button', { name: 'Credit Card' }).click();
  await page.getByRole('menuitem', { name: 'Credit Card' }).click();
  await page.getByRole('button', { name: 'Card present' }).click();
  await page.getByRole('menuitem', { name: 'Credit Card Terminal' }).click();
  await page.getByRole('button', { name: 'Choose a terminal' }).click();

  // Test passes when terminal list is visible
  await expect(page.getByText('Terminal 1Terminal 2Terminal')).toBeVisible();
  console.log('OK Terminal list is visible');
});
