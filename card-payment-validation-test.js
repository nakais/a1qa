// Optimized Card Payment with Expiry Date Validation Test

test('Card Payment with Expiry Date Validation', async ({ page }) => {
  try {
    console.log("💳 Starting card payment with validation test...");

    // ========== PART 1: Add Item and Open Payment Form ==========
    console.log("🛒 Part 1: Adding item and opening payment form...");
    
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    await page.getByRole('combobox').nth(1).selectOption('maintenance');
    await page.getByRole('button', { name: 'Add' }).first().click();
    console.log("✅ Maintenance service added");

    // Decrease quantity
    await page.locator('.flex.items-center.space-x-1 > .p-0\\.5.rounded.hover\\:bg-gray-100.disabled\\:opacity-50').click();
    console.log("✅ Quantity decreased");

    await page.getByRole('button', { name: 'Credit Card Keyed $' }).click();
    console.log("✅ Credit card payment form opened");

    // ========== PART 2: Search and Select Customer ==========
    console.log("👤 Part 2: Searching for customer...");
    
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('mic');
    await page.waitForTimeout(1000);
    await page.getByText('Michael Johnson').click();
    console.log("✅ Customer selected: Michael Johnson");

    // ========== PART 3: Fill Card Details ==========
    console.log("💳 Part 3: Filling card details...");
    
    await page.getByRole('textbox', { name: '5678 9012 3456' }).fill('5211 1111 1113 1438');
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('22/13');
    await page.getByRole('textbox', { name: '123', exact: true }).fill('123');
    await page.getByRole('textbox', { name: '12345' }).fill('12345');
    console.log("✅ Card details filled (testing invalid expiry: 22/13)");

    // ========== PART 4: Test Expiry Date Validation ==========
    console.log("🔍 Part 4: Testing expiry date validation...");
    
    // Test invalid expiry date (22/13 - invalid month)
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    await expect(page.getByText('Invalid')).toBeVisible();
    console.log("✅ Invalid expiry validation works (22/13 rejected)");

    // Test invalid expiry date (12/11 - expired date)
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('12/11');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    await expect(page.getByText('Invalid')).toBeVisible();
    console.log("✅ Expired date validation works (12/11 rejected)");

    // Use valid expiry date
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('12/28');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    console.log("✅ Valid expiry date entered (12/28)");

    // ========== PART 5: Process Payment ==========
    console.log("💵 Part 5: Processing payment...");
    
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment' }).click();
    console.log("✅ Payment confirmed");

    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment modal closed");

    console.log("🎉 Card payment validation test completed successfully!");

  } catch (error) {
    console.error('❌ Card payment test failed:', error.message);
    await page.screenshot({ path: `card-payment-error-${Date.now()}.png` }).catch(() => {});
    throw error;
  }
});
