// Optimized Multiple Items ACH Payment Test

test('Multiple Items ACH Payment', async ({ page }) => {
  try {
    console.log("🏦 Starting multiple items ACH payment test...");

    // Navigate to pay page
    await page.goto('https://sprightly-travesseiro-0bd724.netlify.app/pay');
    console.log("✅ Navigated to pay page");

    // ========== PART 1: Add Multiple Items ==========
    console.log("🛒 Part 1: Adding multiple items from different categories...");
    
    // Open items menu
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    console.log("✅ Items menu opened");

    // Add items from different categories
    const itemsToAdd = [
      { category: 'services', subcategory: 'healthcare', buttonIndex: 2 },
      { category: 'products', subcategory: 'clothing', buttonIndex: 3 },
      { category: 'products', subcategory: 'food', buttonIndex: 1 },
      { category: 'products', subcategory: 'office', buttonIndex: 0 },
      { category: 'products', subcategory: 'electronics', buttonIndex: 0 }
    ];

    for (const item of itemsToAdd) {
      await page.getByRole('combobox').first().selectOption(item.category);
      await page.getByRole('combobox').nth(1).selectOption(item.subcategory);
      await page.getByRole('button', { name: 'Add' }).nth(item.buttonIndex).click();
      console.log(`✅ Added ${item.subcategory} from ${item.category}`);
    }

    // Remove some items (delete button clicked twice)
    const deleteButton = page.locator('div:nth-child(4) > .flex.items-center.justify-between > div:nth-child(2) > .p-0\\.5.text-red-600');
    await deleteButton.click();
    await deleteButton.click();
    console.log("✅ Removed 2 items");

    // ========== PART 2: Process ACH Payment ==========
    console.log("💵 Part 2: Processing ACH payment...");
    
    await page.getByRole('button', { name: 'ACH $' }).click();
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    
    // Verify validation error
    await expect(page.getByText('Make sure all the fields are')).toBeVisible();
    console.log("✅ Validation error displayed correctly");

    // Fill bank account details
    await page.getByRole('combobox').nth(2).selectOption('Savings');
    await page.getByRole('textbox', { name: '1001' }).fill('1111');
    await page.getByRole('textbox', { name: '123456789' }).fill('123456789');
    await page.getByRole('textbox', { name: 'Account number', exact: true }).fill('21212121212121');
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    console.log("✅ Bank account details entered");

    // Verify account holder name validation
    await expect(page.getByText('Account holder name is')).toBeVisible();
    console.log("✅ Account holder name validation displayed");

    // Enter account holder name (simplified - no CapsLock needed)
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Michael Johnson');
    await page.getByRole('button', { name: 'Process ACH Payment - $' }).click();
    console.log("✅ Account holder name entered");

    // ========== PART 3: Confirm Payment ==========
    console.log("✅ Part 3: Confirming payment...");
    
    await page.getByRole('button', { name: 'Proceed with Payment' }).click();
    await expect(page.getByRole('heading', { name: 'Payment Receipt' })).toBeVisible();
    console.log("✅ Payment receipt displayed");

    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment modal closed");

    console.log("🎉 Multiple items ACH payment test completed successfully!");

  } catch (error) {
    console.error('❌ Multiple items ACH payment test failed:', error.message);
    await page.screenshot({ path: `multiple-items-ach-error-${Date.now()}.png` });
    throw error;
  }
});
