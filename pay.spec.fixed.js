// Fixed version of the test - replace the problematic section with this:

test.only('Complete saved card payment flow with customer selections', async () => {
  const page = adminSuite.getPage();

  try {
    // START PAYMENT PROCESS
    await page.getByRole('button', { name: 'Credit Card Keyed' }).click();

    // SEARCH & SELECT CUSTOMER 
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('Michael johnson');
    await page.getByText('Michael Johnson', { exact: true }).click();

    // ENTER AMOUNT & TIP 
    await page.getByRole('textbox', { name: '0.00' }).fill('10');
    await page.getByPlaceholder('0.00').nth(1).fill('3'); // Tip or second amount field
    await page.getByRole('textbox', { name: '5678 9012 3456' }).fill('4242 4242 4242 4242');
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('12/27');
    await page.getByRole('textbox', { name: '123', exact: true }).fill('123');
    await page.getByRole('textbox', { name: '12345' }).fill('12345');
    await page.getByRole('checkbox', { name: 'Save card for future payments' }).check();

    //ENCOUNTER TYPE SELECTION 
    await page.getByText('Encounter Type (Required)').click();
    await page.getByRole('combobox').nth(1).selectOption('1756999772240');
    console.log("✅ Selected encounter type");

    // PROCESS PAYMENT WITH XPATH
    await page.click('xpath=//*[@id="root"]/div[1]/main/main/div/div[2]/div/div[3]/div[3]/button');

    // ----------------------- PAYMENT CONFIRMATION -----------------------
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment ($7.00)' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅Payement processed successfully");

    // VERIFY CARD SAVED & DELETE 
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('michael johnson');
    await page.locator('.flex.items-center.justify-between.p-3').click();

    await page.getByRole('button', { name: 'Credit Card Keyed' }).click();
    
    // Wait for the payment form to be ready
    await page.waitForTimeout(1000);
    
    // Fill amount and wait for saved cards to load
    await page.getByRole('textbox', { name: '0.00' }).fill('15');
    
    // Wait a bit for saved cards to appear (they might load asynchronously)
    await page.waitForTimeout(2000);
    
    // Try multiple locator strategies to find the saved card
    console.log("💳 Looking for saved card...");
    
    // Strategy 1: Try the original locator with more flexible matching
    let card = page.locator('text=/Visa.*4242.*12\/27/i');
    const cardCount = await card.count();
    
    if (cardCount === 0) {
      // Strategy 2: Try with different text patterns
      card = page.locator('text=/Visa.*••••.*4242/i');
      const cardCount2 = await card.count();
      
      if (cardCount2 === 0) {
        // Strategy 3: Look for any element containing "4242" and "12/27" or "Exp"
        card = page.locator('text=/4242.*(?:12\/27|Exp)/i');
        const cardCount3 = await card.count();
        
        if (cardCount3 === 0) {
          // Strategy 4: Look for saved payment methods section and then the card
          // Sometimes saved cards are in a dropdown or separate section
          const savedCardsSection = page.locator('[data-testid*="saved"], [class*="saved"], [class*="card"]');
          const sectionCount = await savedCardsSection.count();
          
          if (sectionCount > 0) {
            console.log(`💳 Found ${sectionCount} potential saved card sections`);
            // Try clicking on the section to expand it
            await savedCardsSection.first().click();
            await page.waitForTimeout(1000);
            card = page.locator('text=/4242/i');
          } else {
            // Strategy 5: Look for any button or clickable element with card info
            card = page.getByRole('button').filter({ hasText: /4242/i });
            const buttonCount = await card.count();
            
            if (buttonCount === 0) {
              // Last resort: Take a screenshot and log available text
              console.log("❌ Could not find saved card with any strategy");
              const pageText = await page.textContent('body');
              console.log("Page text snippet:", pageText?.substring(0, 500));
              await page.screenshot({ path: `debug-saved-card-${Date.now()}.png` });
              throw new Error('Saved card not found after trying multiple locator strategies');
            }
          }
        }
      }
    }
    
    // Now verify the card is visible
    await expect(card.first()).toBeVisible({ timeout: 10000 });
    console.log("💳Card 4242... visible");

    // Navigate to customers & payment method section
    console.log("💳 Navigate to customers & payment method");
    await page.getByRole('button', { name: 'Customers' }).click();
    await page.getByRole('link', { name: 'Customers' }).click();
    await page.getByRole('textbox', { name: 'Search customers...' }).fill('Michael johnson');
    await page.getByText('Michael Johnson', { exact: true }).click();

    await page.getByRole('combobox').click();
    await page.getByText('Payment Methods').click();
    await page.waitForTimeout(2000);

    // Delete saved card
    console.log("💳 Looking for card 4242...");

    // Select the correct saved card container
    // Click the specific card (4242)
    await page.getByText(/Visa.*4242/).first().click();

    // Click the delete/trash button inside the modal/card menu
    // Look for delete buttons (usually represented by icons or specific buttons)
    const deleteButtons = page
      .getByRole("button")
      .filter({ hasText: /^$/ }); // Empty text buttons (likely icons)
    const deleteButtonCount = await deleteButtons.count();

    if (deleteButtonCount === 0) {
      // Alternative: Look for any button that might be a delete action
      const alternativeDeleteButtons = page.locator(
        'button[title*="delete"], button[aria-label*="delete"], button:has(svg[data-icon="trash"])'
      );
      const altDeleteCount = await alternativeDeleteButtons.count();

      if (altDeleteCount === 0) {
        throw new Error(
          "No delete buttons found in payment methods section"
        );
      }

      // Use alternative delete button
      console.log(
        `✅ Found ${altDeleteCount} alternative delete button(s)`
      );
      await alternativeDeleteButtons.first().click();
    } else {
      console.log(`✅ Found ${deleteButtonCount} delete button(s)`);
      // Click the first delete button (icon button with empty text)
      await deleteButtons.first().click();
    }

    console.log("✅ Delete button clicked");

    // Wait for delete confirmation dialog
    await page.waitForTimeout(1000);

    // Click the "Delete Card" confirmation button
    const deleteCardButton = page.getByRole("button", {
      name: "Delete Card",
    });
    await expect(deleteCardButton).toBeVisible({ timeout: 5000 });
    await deleteCardButton.click();
    console.log("✅ Delete Card confirmation clicked");

    // Wait for deletion to process
    await page.waitForTimeout(2000);

    // Close modal
    await page.getByRole('button', { name: 'Close' }).click();

    console.log("🗑️ Card 4242 deleted successfully");

  } catch (error) {
    console.error('❌ Payment test failed:', error.message);
    await page.screenshot({ path: `payment-error-${Date.now()}.png` });
    throw error;
  }
});
