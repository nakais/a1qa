// Optimized QR Code Payment with Items Test

test('QR Code Payment with Items', async ({ page, context }) => {
  try {
    console.log("📱 Starting QR code payment with items test...");

    // ========== PART 1: Generate QR Code with Items ==========
    console.log("🔲 Part 1: Generating QR code with items...");
    
    // Open items menu
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    console.log("✅ Items menu opened");

    // Search and select customer
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('Michael');
    await page.getByText('Michael Johnson').click();
    console.log("✅ Customer selected: Michael Johnson");

    // Open QR Code form
    await page.getByRole('button', { name: 'QR Code' }).click();
    console.log("✅ QR Code form opened");

    // Add service item
    await page.getByRole('combobox').nth(1).selectOption('legal');
    await page.getByRole('combobox').first().selectOption('services');
    await page.getByRole('button', { name: 'Add' }).click();
    console.log("✅ Legal service item added");

    // Decrease quantity
    await page.locator('.flex.items-center.space-x-1 > .p-0\\.5.rounded.hover\\:bg-gray-100.disabled\\:opacity-50').click();
    console.log("✅ Quantity decreased");

    // Generate QR code
    await page.getByRole('button', { name: 'Generate QR' }).click();
    console.log("✅ QR code generated");

    // Wait for QR code URL to appear and extract it
    await expect(page.getByText("https://sprightly-travesseiro")).toBeVisible({ timeout: 10000 });
    const urlElement = page.getByText("https://sprightly-travesseiro");
    const generatedUrl = await urlElement.textContent();
    console.log(`✅ Generated QR URL: ${generatedUrl}`);

    // Copy QR code link
    await page.getByRole('button', { name: 'Copy' }).click();
    console.log("✅ QR code link copied");

    // ========== PART 2: Test QR Payment Page ==========
    console.log("💳 Part 2: Testing QR code payment page...");
    
    // Open QR payment page in new tab
    const paymentPage = await context.newPage();
    
    try {
      await paymentPage.goto(generatedUrl);
      console.log("✅ Opened payment URL in new tab");

      // Test validation errors
      await paymentPage.getByRole('textbox', { name: '5678 9012 3456' }).fill('1234 5678 9012 3456');
      await paymentPage.getByRole('button', { name: 'Pay $' }).click();
      
      // Verify all validation errors
      await expect(paymentPage.getByText('Please enter a valid card')).toBeVisible();
      await expect(paymentPage.getByText('Please enter a valid expiry')).toBeVisible();
      await expect(paymentPage.getByText('Please enter a valid CVV')).toBeVisible();
      await expect(paymentPage.getByText('ZIP code is invalid')).toBeVisible();
      console.log("✅ All validation errors displayed correctly");

      // Fill required fields
      await paymentPage.getByRole('textbox', { name: '12345' }).fill('12345');
      await paymentPage.getByRole('textbox', { name: '123', exact: true }).fill('1');
      await paymentPage.getByRole('textbox', { name: 'MM/YY' }).fill('11/28');
      await paymentPage.getByRole('button', { name: 'Pay $' }).click();
      console.log("✅ Required fields filled");

      // Verify invalid card error
      await expect(paymentPage.getByText('Please enter a valid card')).toBeVisible();
      console.log("✅ Invalid card validation works");

      // Enter card that requires CVV validation
      await paymentPage.getByRole('textbox', { name: '5678 9012 3456' }).fill('4100 0000 0000 1017');
      await paymentPage.getByRole('button', { name: 'Pay $' }).click();
      
      // Verify CVV validation
      await expect(paymentPage.getByText('Please enter a valid CVV')).toBeVisible();
      console.log("✅ CVV validation displayed");

      // Enter valid CVV and complete payment
      await paymentPage.getByRole('textbox', { name: '123', exact: true }).fill('113');
      await paymentPage.getByRole('button', { name: 'Pay $' }).click();
      
      // Verify successful payment
      await expect(paymentPage.getByRole('heading', { name: 'Payment Successful!' })).toBeVisible();
      console.log("✅ Payment completed successfully via QR code");

    } finally {
      // Always close the payment page
      await paymentPage.close();
      console.log("✅ Payment page closed");
    }

    console.log("🎉 QR code payment with items test completed successfully!");

  } catch (error) {
    console.error('❌ QR code payment test failed:', error.message);
    await page.screenshot({ path: `qr-payment-error-${Date.now()}.png` });
    throw error;
  }
});
