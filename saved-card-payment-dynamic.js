// Optimized Saved Card Payment Test with Dynamic Card Selection

test('Saved Card Payment with Dynamic Selection', async ({ page }) => {
  try {
    console.log("💳 Starting saved card payment test...");

    // ========== PART 1: Add Item and Open Payment Form ==========
    console.log("🛒 Part 1: Adding item and opening payment form...");
    
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    await page.getByRole('combobox').first().selectOption('services');
    await page.getByRole('combobox').nth(1).selectOption('legal');
    await page.getByRole('button', { name: 'Add' }).click();
    console.log("✅ Legal service item added");

    await page.getByRole('button', { name: 'Credit Card Keyed $' }).click();
    console.log("✅ Credit card payment form opened");

    // ========== PART 2: Search and Select Customer ==========
    console.log("👤 Part 2: Searching for customer...");
    
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('mic');
    await page.waitForTimeout(1000);
    await page.getByText('Michael Johnson').click();
    console.log("✅ Customer selected: Michael Johnson");

    // ========== PART 3: Check and Select Saved Card ==========
    console.log("💳 Part 3: Checking for saved cards...");
    
    // Wait for saved cards section to load
    await page.waitForTimeout(1000);
    
    // Check if saved cards heading exists
    const savedCardsHeading = page.getByRole('heading', { name: /Saved Cards/i });
    const savedCardsExists = await savedCardsHeading.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (!savedCardsExists) {
      console.error("❌ No saved cards section found - no cards are saved for this customer");
      throw new Error("No saved cards available. Please save a card first.");
    }
    
    // Extract card count from heading (e.g., "Saved Cards (1)")
    const headingText = await savedCardsHeading.textContent();
    const cardCountMatch = headingText?.match(/\((\d+)\)/);
    const cardCount = cardCountMatch ? parseInt(cardCountMatch[1]) : 0;
    
    if (cardCount === 0) {
      console.error("❌ Saved cards section exists but no cards found");
      throw new Error("No saved cards available. Card count is 0.");
    }
    
    console.log(`✅ Found ${cardCount} saved card(s)`);
    
    // Find and select the first saved card dynamically
    const savedCardButtons = page.getByRole('button').filter({ 
      hasText: /(Visa|Mastercard|Amex|Discover).*••••.*Exp:/i
    });
    const availableCards = await savedCardButtons.count();
    
    if (availableCards === 0) {
      console.error("❌ No saved card buttons found");
      throw new Error("No saved cards available. Could not find card buttons.");
    }
    
    // Select first saved card
    const firstCard = savedCardButtons.first();
    const cardText = await firstCard.textContent();
    await firstCard.click();
    console.log(`✅ Selected saved card: ${cardText?.trim()}`);

    // ========== PART 4: Process Payment ==========
    console.log("💵 Part 4: Processing payment...");
    
    await page.getByRole('button', { name: 'Process Saved Card Payment - $' }).click();
    console.log("✅ Payment processing initiated");
    
    // Confirm payment
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed with Payment' }).click();
    console.log("✅ Payment confirmed");
    
    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment modal closed");
    
    console.log("🎉 Saved card payment test completed successfully!");

  } catch (error) {
    console.error('❌ Saved card payment test failed:', error.message);
    await page.screenshot({ path: `saved-card-payment-error-${Date.now()}.png` }).catch(() => {});
    throw error;
  }
});
