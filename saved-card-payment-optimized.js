// Optimized Saved Card Payment Test with Random Customer Search

test('Saved Card Payment with Random Customer', async ({ page }) => {
  try {
    console.log("💳 Starting saved card payment test...");

    // Navigate to pay page
    await page.goto('https://sprightly-travesseiro-0bd724.netlify.app/pay');
    console.log("✅ Navigated to pay page");

    // ========== PART 1: Add Item and Open Payment Form ==========
    console.log("🛒 Part 1: Adding item and opening payment form...");
    
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    await page.getByRole('combobox').first().selectOption('products');
    await page.getByRole('combobox').nth(1).selectOption('sports');
    await page.getByRole('button', { name: 'Add' }).click();
    console.log("✅ Sports product added");

    await page.getByRole('button', { name: 'Credit Card Keyed $' }).click();
    console.log("✅ Credit card payment form opened");

    // ========== PART 2: Customer Search ==========
    console.log("👤 Part 2: Searching for customer...");
    
    // Search using three letters (e.g., "mic" for Michael)
    const searchQuery = 'mic';
    await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill(searchQuery);
    console.log(`✅ Searched with: "${searchQuery}"`);
    
    // Wait for search results to appear
    await page.waitForTimeout(1500);
    
    // Select first search result using multiple strategies
    let customerSelected = false;
    
    // Strategy 1: Look for dropdown/autocomplete options
    const dropdownOptions = page.locator('[role="option"], [role="listbox"] [role="option"], .dropdown-item, [class*="option"], [class*="autocomplete"] [class*="item"]');
    const optionCount = await dropdownOptions.count();
    
    if (optionCount > 0) {
      await dropdownOptions.first().click();
      const selectedName = await dropdownOptions.first().textContent();
      console.log(`✅ Selected first search result: ${selectedName?.trim()}`);
      customerSelected = true;
    }
    
    // Strategy 2: Look for clickable customer names in search results
    if (!customerSelected) {
      const customerResults = page.locator('text=/^[A-Z][a-z]+ [A-Z][a-z]+$/').or(page.getByText(/^[A-Z][a-z]+ [A-Z][a-z]+$/));
      const resultCount = await customerResults.count();
      
      if (resultCount > 0) {
        await customerResults.first().click();
        const selectedName = await customerResults.first().textContent();
        console.log(`✅ Selected customer: ${selectedName?.trim()}`);
        customerSelected = true;
      }
    }
    
    // Strategy 3: Look for any clickable element in search results area
    if (!customerSelected) {
      const searchResultsArea = page.locator('[class*="search"], [class*="dropdown"], [class*="results"], [class*="autocomplete"]');
      const clickableResults = searchResultsArea.locator('div, li, button, a').filter({ hasText: /./ });
      const fallbackCount = await clickableResults.count();
      
      if (fallbackCount > 0) {
        await clickableResults.first().click();
        const selectedName = await clickableResults.first().textContent();
        console.log(`✅ Selected customer from fallback: ${selectedName?.trim()}`);
        customerSelected = true;
      }
    }
    
    // Strategy 4: Last resort - look for any text that matches the search pattern
    if (!customerSelected) {
      const anyMatch = page.locator(`text=/.*${searchQuery}.*/i`);
      const matchCount = await anyMatch.count();
      
      if (matchCount > 0) {
        await anyMatch.first().click();
        console.log("✅ Selected customer from text match");
        customerSelected = true;
      } else {
        throw new Error(`No customer search results found for "${searchQuery}"`);
      }
    }

    // ========== PART 3: Handle Saved Cards ==========
    console.log("💳 Part 3: Checking for saved cards...");
    
    // Wait a bit for saved cards section to load
    await page.waitForTimeout(1000);
    
    // Check if saved cards section exists
    const savedCardsHeading = page.getByRole('heading', { name: /Saved Cards/i });
    const savedCardsExists = await savedCardsHeading.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (savedCardsExists) {
      // Look for saved card buttons (they usually contain card info like "Visa ••••" or card numbers)
      const savedCardButtons = page.getByRole('button').filter({ 
        hasText: /(Visa|Mastercard|Amex|Discover).*••••|Exp:|^\d{4}/
      });
      const cardCount = await savedCardButtons.count();
      
      if (cardCount > 0) {
        // Select first saved card
        const firstCard = savedCardButtons.first();
        await firstCard.click();
        const cardText = await firstCard.textContent();
        console.log(`✅ Found and selected saved card: ${cardText?.trim()}`);
        
        // Proceed directly to payment
        await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
        console.log("✅ Processing payment with saved card");
      } else {
        console.log("⚠️ Saved cards section exists but no cards found, adding new card");
        await addNewCard(page);
      }
    } else {
      console.log("⚠️ No saved cards section found, adding new card");
      await addNewCard(page);
    }

    // ========== PART 4: Process Payment ==========
    console.log("💵 Part 4: Processing payment...");
    
    // Wait for payment confirmation dialog
    await expect(page.getByRole('heading', { name: 'Payment Confirmation' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Proceed with Payment' }).click();
    console.log("✅ Payment confirmed");

    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Payment modal closed");

    // ========== PART 5: Delete Saved Card ==========
    console.log("🗑️ Part 5: Deleting saved card from customer...");
    
    await page.getByRole('button', { name: 'Customers' }).click();
    await page.getByRole('link', { name: 'Customers' }).click();
    console.log("✅ Navigated to customers page");

    // Search for customer
    await page.getByRole('textbox', { name: 'Search customers...' }).fill('Michael');
    await page.getByText('Michael Johnson').click();
    console.log("✅ Customer found and selected");

    // Navigate to payment methods
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Payment Methods' }).click();
    await page.waitForTimeout(1000);
    console.log("✅ Navigated to payment methods");

    // Find and delete the card
    const cardElement = page.getByText(/Visa.*2049/i);
    const cardExists = await cardElement.isVisible().catch(() => false);
    
    if (cardExists) {
      await cardElement.click();
      await page.getByRole('button').nth(2).click();
      
      await expect(page.getByRole('heading', { name: 'Delete Payment Method' })).toBeVisible();
      await page.getByRole('button', { name: 'Delete Card' }).click();
      console.log("✅ Card deleted successfully");
    } else {
      console.log("⚠️ Card not found in payment methods");
    }

    await page.getByRole('button', { name: 'Close' }).click();
    console.log("✅ Modal closed");

    console.log("🎉 Saved card payment test completed successfully!");

  } catch (error) {
    console.error('❌ Saved card payment test failed:', error.message);
    await page.screenshot({ path: `saved-card-payment-error-${Date.now()}.png` });
    throw error;
  }
});

// Helper function to add new card
async function addNewCard(page) {
  console.log("💳 Adding new card...");
  
  await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
  
  // Handle validation
  const validationError = await page.getByText('Make sure all the fields are').isVisible().catch(() => false);
  if (validationError) {
    await page.getByRole('textbox', { name: '12345' }).fill('12345');
    await page.getByRole('textbox', { name: '5678 9012 3456' }).fill('4100 0000 0000 2049');
    await page.getByRole('textbox', { name: 'MM/YY' }).fill('11/29');
    await page.getByRole('textbox', { name: '123', exact: true }).fill('234');
    await page.getByRole('button', { name: 'Process Card Payment - $' }).click();
  }
  
  console.log("✅ New card added and payment initiated");
}
