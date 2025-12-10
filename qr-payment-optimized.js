// Optimized QR Code Payment Test

test('QR Code Payment Flow', async ({ page, context }) => {
  try {
    console.log("📱 Starting QR code payment test...");

    // ========== PART 1: Generate QR Code ==========
    console.log("🔲 Part 1: Generating QR code...");
    
    await page.getByRole('button', { name: 'QR Code' }).click();
    console.log("✅ QR Code form opened");

    // Enter payment amount
    await page.getByRole('textbox', { name: '0.00' }).fill('15');
    console.log("✅ Payment amount: $15.00");

    // Configure tip as percentage
    await page.getByRole('combobox').selectOption('percentage');
    await page.getByPlaceholder('0', { exact: true }).fill('10');
    console.log("✅ Tip configured: 10%");

    // Search and select customer
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('Michael');
    await page.locator('.h-full.w-full.rounded-\\[inherit\\] > div > div > div:nth-child(2)').click();
    console.log("✅ Customer selected");

    // Generate QR code
    await page.getByRole('button', { name: 'Generate QR' }).click();
    
    // Verify validation error for encounter type
    await expect(page.getByText('Please select an encounter')).toBeVisible();
    console.log("✅ Encounter type validation displayed");

    // Select encounter type and generate QR
    await page.getByText('Encounter Type (Required)').click();
    await page.getByRole('combobox').nth(1).selectOption('1756999772240');
    await page.getByRole('button', { name: 'Generate QR' }).click();
    console.log("✅ QR code generated successfully");

    // ========== PART 2: Email and Download QR Code ==========
    console.log("📧 Part 2: Sending QR code via email and downloading...");
    
    // Send QR code via email
    await page.getByRole('button', { name: 'Email' }).click();
    await page.getByRole('button', { name: 'Add Email' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).nth(1).fill('naz+test2@labthree.org');
    await page.getByRole('button', { name: 'Send Link' }).click();
    console.log("✅ QR code link sent via email");

    // Download QR code
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    console.log("✅ QR code downloaded");

    // Copy QR code link
    await page.getByRole('button', { name: 'Copy' }).click();
    console.log("✅ QR code link copied");

    // ========== PART 3: Test QR Code Payment Page ==========
    console.log("💳 Part 3: Testing QR code payment page...");
    
    // Open QR code payment page in new tab
    const page1 = await context.newPage();
    await page1.goto('https://sprightly-travesseiro-0bd724.netlify.app/qr/imMQaSYl6d3BF6COY2w5/5cd0058f-8d04-41f4-af43-44fcbb322bac');
    console.log("✅ QR code payment page opened");

    // Test validation errors
    await page1.getByRole('button', { name: 'Pay $' }).click();
    await expect(page1.getByText('Please enter a valid card')).toBeVisible();
    await expect(page1.getByText('Please enter a valid expiry')).toBeVisible();
    await expect(page1.getByText('Please enter a valid CVV')).toBeVisible();
    await expect(page1.getByText('ZIP code is invalid')).toBeVisible();
    console.log("✅ All validation errors displayed correctly");

    // Enter invalid card to test validation
    await page1.getByRole('textbox', { name: '5678 9012 3456' }).fill('1234 5678 9012 3456');
    await page1.getByRole('textbox', { name: 'MM/YY' }).fill('12/28');
    await page1.getByRole('textbox', { name: '123', exact: true }).fill('123');
    await page1.getByRole('textbox', { name: '12345' }).fill('12345');
    await page1.getByRole('button', { name: 'Pay $' }).click();
    
    // Verify invalid card error
    await expect(page1.getByText('Please enter a valid card')).toBeVisible();
    console.log("✅ Invalid card validation works");

    // Enter valid card and complete payment
    await page1.getByRole('textbox', { name: '5678 9012 3456' }).fill('4242 4242 4242 4242');
    await page1.getByRole('button', { name: 'Pay $' }).click();
    
    // Verify successful payment
    await expect(page1.getByRole('heading', { name: 'Payment Successful!' })).toBeVisible();
    console.log("✅ Payment completed successfully via QR code");

    // Close the QR payment page
    await page1.close();
    console.log("🎉 QR code payment test completed successfully!");

  } catch (error) {
    console.error('❌ QR code payment test failed:', error.message);
    await page.screenshot({ path: `qr-payment-error-${Date.now()}.png` });
    throw error;
  }
});
