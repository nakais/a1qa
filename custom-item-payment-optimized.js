// Optimized Custom Item Payment Test

test('Custom Item Payment with Credit Card', async () => {
  const page = adminSuite.getPage();

  try {
    console.log("🛍️ Starting custom item payment test...");

    // ========== PART 1: Create Custom Item ==========
    console.log("📝 Part 1: Creating custom item...");
    
    // Open items menu
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    console.log("✅ Items menu opened");

    // Create custom product
    await page.getByRole('button', { name: 'Custom', exact: true }).click();
    await page.getByRole('radio', { name: 'Product' }).check();
    console.log("✅ Custom product option selected");

    // Enter product details
    await page.getByRole('textbox', { name: 'Enter product name' }).fill('Knife');
    await page.getByPlaceholder('0.00').fill('15');
    
    // Enter description (long Lorem Ipsum text)
    const description = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.';
    await page.getByRole('textbox', { name: 'Optional description' }).fill(description);
    console.log("✅ Product details entered: Knife, $15.00");

    // Add item
    await page.getByRole('button', { name: 'Add Item' }).click();
    await expect(page.getByText('KnifeCustom Item$15.00 × 1')).toBeVisible();
    console.log("✅ Custom item added and verified");

    // ========== PART 2: Process Credit Card Payment ==========
    console.log("💳 Part 2: Processing credit card payment...");
    
    await page.getByRole('button', { name: 'Credit Card Keyed $' }).click();
    console.log("✅ Credit card payment form opened");

    // Test validation errors
    await page.getByRole('textbox', { name: '5678 9012 3456' }).fill('1234 5678 9123');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    
    // Verify validation errors
    await expect(page.getByText('Make sure all the fields are')).toBeVisible();
    console.log("✅ Validation error displayed correctly");

    // Fill required fields
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('11/11');
    await page.getByRole('textbox', { name: '123', exact: true }).fill('234');
    await page.getByRole('textbox', { name: '12345' }).fill('12345');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    console.log("✅ Required fields filled");

    // Test invalid card validation
    await expect(page.getByText('Please enter a valid card')).toBeVisible();
    await expect(page.getByText('Invalid')).toBeVisible();
    console.log("✅ Invalid card validation displayed");

    // Enter valid card
    await page.getByRole('textbox', { name: '5678 9012 3456' }).fill('4242 4242 4242 4242');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    console.log("✅ Valid card entered");

    // Fix expiration date
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('11/28');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
    console.log("✅ Payment processing initiated");

    // Confirm payment
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment' }).click();
    console.log("✅ Payment confirmed");

    // Close modal
    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment modal closed");

    console.log("🎉 Custom item payment test completed successfully!");

  } catch (error) {
    console.error('❌ Custom item payment test failed:', error.message);
    await page.screenshot({ path: `custom-item-payment-error-${Date.now()}.png` });
    throw error;
  }
});
