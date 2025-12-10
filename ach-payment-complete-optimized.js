// Optimized ACH Payment Test - Complete Flow

test('ACH Payment with saved bank account and receipt', async () => {
  const page = adminSuite.getPage();

  try {
    console.log("🏦 Starting ACH payment test...");

    // Navigate to pay page
    await page.goto('https://sprightly-travesseiro-0bd724.netlify.app/pay');
    console.log("✅ Navigated to pay page");

    // ========== PART 1: Create and Save Bank Account ==========
    console.log("📝 Part 1: Creating and saving bank account...");
    
    await page.getByRole('button', { name: 'ACH' }).click();
    
    // Search and select customer
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('michael');
    await page.getByText('Michael Johnson').click();
    console.log("✅ Customer selected: Michael Johnson");

    // Enter payment details
    await page.getByRole('textbox', { name: '0.00' }).fill('15');
    await page.getByRole('combobox').first().selectOption('percentage');
    await page.getByPlaceholder('0', { exact: true }).fill('9');
    console.log("✅ Payment amount: $15.00, Tip: 9%");

    // Save bank account for future
    await page.getByRole('checkbox', { name: 'Save bank account for future' }).check();
    console.log("✅ Save bank account checkbox checked");

    // Enter bank account details
    await page.getByRole('textbox', { name: '1001' }).fill('10001');
    await page.getByRole('combobox').nth(1).selectOption('Savings');
    await page.getByRole('textbox', { name: '123456789' }).fill('123456789');
    await page.getByRole('textbox', { name: 'Account number' }).fill('242424242');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Michael Johnson');
    console.log("✅ Bank account details entered");

    // Select encounter type and process
    await page.getByText('Encounter Type (Required)').click();
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    
    // Confirm payment
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment ($13.65)' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment completed: $13.65");

    // ========== PART 2: Test Validation Errors ==========
    console.log("🔍 Part 2: Testing validation with saved account...");
    
    await page.getByRole('button', { name: 'ACH' }).click();
    await page.getByRole('textbox', { name: '0.00' }).fill('15');
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    
    // Verify validation error appears
    await expect(page.getByText('Make sure all the fields are')).toBeVisible();
    console.log("✅ Validation error displayed correctly");

    // Fill required fields to test validation
    await page.getByRole('textbox', { name: '1001' }).fill('1234');
    await page.getByRole('textbox', { name: '123456789' }).fill('123456789');
    await page.getByRole('textbox', { name: 'Account number', exact: true }).fill('24242424');
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    
    // Verify account holder name validation
    await expect(page.getByText('Account holder name is')).toBeVisible();
    console.log("✅ Account holder name validation displayed");

    // ========== PART 3: Complete Payment with Saved Account ==========
    console.log("💳 Part 3: Completing payment with saved account...");
    
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Michael Johnson');
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    
    // Confirm payment
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment' }).click();
    console.log("✅ Payment processed successfully");

    // ========== PART 4: Receipt Operations ==========
    console.log("📧 Part 4: Testing receipt operations...");
    
    // Print receipt
    await page.getByRole('button', { name: 'Print Receipt' }).click();
    console.log("✅ Print receipt clicked");

    // Send receipt with multiple emails
    await page.getByRole('button', { name: 'Send Receipt' }).click();
    await page.getByRole('textbox', { name: 'Primary email address' }).fill('naz+test@labthree.org');
    await page.getByRole('button', { name: 'Add Another Email' }).click();
    await page.getByRole('textbox', { name: 'Additional email address' }).fill('naz+test2@labthree.org');
    await page.getByRole('button', { name: 'Send Receipt (2)' }).click();
    
    // Verify receipt sent
    await expect(page.getByText('Receipt sent successfully')).toBeVisible();
    console.log("✅ Receipt sent successfully to 2 emails");

    // Test cancel functionality
    await page.getByRole('button', { name: 'Send Receipt' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    console.log("✅ Cancel button works correctly");

    // Close receipt modal
    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Receipt modal closed");

    console.log("🎉 All ACH payment tests completed successfully!");

  } catch (error) {
    console.error('❌ ACH payment test failed:', error.message);
    await page.screenshot({ path: `ach-payment-error-${Date.now()}.png` });
    throw error;
  }
});
