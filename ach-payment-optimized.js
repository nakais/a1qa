// Optimized ACH Payment Test Code

test('ACH Payment with saved bank account', async () => {
  const page = adminSuite.getPage();

  try {
    console.log("🏦 Starting ACH payment process...");

    // Start ACH payment
    await page.getByRole('button', { name: 'ACH $' }).click();
    console.log("✅ ACH payment form opened");

    // Enter payment amount
    await page.getByRole('textbox', { name: '0.00' }).fill('15');
    console.log("✅ Payment amount: $15.00");

    // Configure tip as percentage
    await page.getByPlaceholder('0.00').nth(1).click();
    await page.getByRole('combobox').first().selectOption('percentage');
    await page.getByPlaceholder('0', { exact: true }).fill('5');
    console.log("✅ Tip configured: 5%");

    // Save bank account for future use
    await page.getByRole('checkbox', { name: 'Save bank account for future' }).check();
    console.log("✅ Save bank account checkbox checked");

    // Enter bank account details
    await page.getByRole('textbox', { name: '1001' }).fill('1001');
    await page.getByRole('combobox').nth(1).selectOption('Savings');
    await page.getByRole('textbox', { name: '123456789' }).fill('123456789');
    await page.getByRole('textbox', { name: 'Account number' }).fill('234567899876');
    console.log("✅ Bank account details entered");

    // Enter account holder name (simplified - no need for CapsLock)
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Michael Johnson');
    console.log("✅ Account holder name: Michael Johnson");

    // Select encounter type
    await page.getByText('Encounter Type (Required)').click();
    await page.getByRole('combobox').nth(2).selectOption('1756999196675');
    console.log("✅ Encounter type selected");

    // Process payment (removed duplicate click)
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    console.log("✅ Payment processing initiated");

    // Confirm payment
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment ($14.25)' }).click();
    console.log("✅ Payment confirmed: $14.25");

    // Close confirmation modal
    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment completed successfully");

  } catch (error) {
    console.error('❌ ACH payment test failed:', error.message);
    await page.screenshot({ path: `ach-payment-error-${Date.now()}.png` });
    throw error;
  }
});
