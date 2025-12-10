// Fixed Cash Payment with Items Test - With Proper Setup

test.describe('Cash Payment Tests', () => {
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test('Cash Payment with inventory item', async () => {
    const page = adminSuite.getPage();

    try {
      console.log("💰 Starting cash payment with items test...");

      // ========== PART 1: Add Items to Cart ==========
      console.log("🛒 Part 1: Adding items to cart...");
      
      // Open items/products menu
      await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
      console.log("✅ Items menu opened");

      // Search and add X-ray item
      await page.getByRole('textbox', { name: 'Search products & services...' }).fill('X-ray');
      await page.getByRole('button', { name: 'Add' }).first().click();
      console.log("✅ X-ray item added to cart");

      // Adjust quantity (increase)
      await page.locator('.p-0\\.5.text-red-600').click();
      await page.getByRole('button', { name: 'Add' }).first().click();
      console.log("✅ Quantity adjusted");

      // Increase quantity multiple times
      const incrementButton = page.locator('.p-1\\.5 > .flex.items-center.justify-between > div:nth-child(2) > button').first();
      await incrementButton.click();
      await page.getByRole('button', { name: 'Add' }).first().click();
      console.log("✅ Quantity increased");

      // Decrease quantity multiple times
      const decrementButton = page.locator('.flex.items-center.space-x-1 > .p-0\\.5.rounded.hover\\:bg-gray-100.disabled\\:opacity-50');
      await decrementButton.click();
      await decrementButton.click();
      await decrementButton.click();
      console.log("✅ Quantity decreased 3 times");

      // Increase quantity again
      await incrementButton.click();
      await incrementButton.click();
      await incrementButton.click();
      console.log("✅ Quantity increased 3 times");

      // ========== PART 2: Process Cash Payment ==========
      console.log("💵 Part 2: Processing cash payment...");
      
      await page.getByRole('button', { name: 'Cash $' }).click();
      await page.getByRole('button', { name: 'Process Cash Payment - $' }).click();
      console.log("✅ Cash payment initiated");

      // Confirm payment
      await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
      await page.getByRole('button', { name: 'Proceed with Payment' }).click();
      console.log("✅ Payment confirmed");

      // ========== PART 3: Handle Receipt ==========
      console.log("📧 Part 3: Handling receipt...");
      
      // Test receipt modal (open and cancel)
      await page.getByRole('button', { name: 'Send Receipt' }).click();
      await page.getByRole('button', { name: 'Cancel' }).click();
      console.log("✅ Receipt modal tested (opened and cancelled)");

      // Close payment modal
      await page.getByRole('button', { name: 'Close' }).click();
      console.log("✅ Payment modal closed");

      console.log("🎉 Cash payment with items test completed successfully!");

    } catch (error) {
      console.error('❌ Cash payment test failed:', error.message);
      await page.screenshot({ path: `cash-payment-error-${Date.now()}.png` });
      throw error;
    }
  });
});
