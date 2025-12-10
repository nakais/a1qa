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
    
    // Generate random three letters for search
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let searchQuery = '';
    let customerSelected = false;
    let selectedCustomerName = '';
    const maxRetries = 5; // Maximum number of search attempts
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // Generate new random 3 letters for each attempt
      searchQuery = '';
      for (let i = 0; i < 3; i++) {
        searchQuery += letters[Math.floor(Math.random() * letters.length)];
      }
      
      const searchBox = page.getByRole('textbox', { name: 'Search by name, email, phone' });
      await searchBox.clear();
      await searchBox.fill(searchQuery);
      console.log(`🔍 Attempt ${attempt}: Searched with random letters: "${searchQuery}"`);
      
      // Wait for search results dropdown to appear
      await page.waitForTimeout(1500);
      
      // Strategy 1: Look for dropdown/autocomplete options
      const allOptions = page.locator('[role="option"], [role="listbox"] [role="option"], [class*="option"]:not([class*="sidebar"]), [class*="item"]:not([class*="sidebar"])');
      const optionCount = await allOptions.count();
      
      if (optionCount > 0) {
        // Find first option that looks like a customer name (not UI element)
        for (let i = 0; i < Math.min(optionCount, 10); i++) {
          const option = allOptions.nth(i);
          const text = await option.textContent();
          
          // Skip UI elements and validate it looks like a customer name
          if (text && 
              !text.includes('Toggle') && 
              !text.includes('Sidebar') && 
              !text.includes('Menu') &&
              !text.includes('Close') &&
              !text.includes('Button') &&
              text.trim().length > 2 &&
              /[A-Z]/.test(text)) { // Has capital letter (likely a name)
            
            try {
              await option.click({ force: true, timeout: 3000 });
              selectedCustomerName = text.trim();
              console.log(`✅ Selected customer: ${selectedCustomerName}`);
              customerSelected = true;
              break;
            } catch (clickError) {
              // Try next option if this one fails
              continue;
            }
          }
        }
      }
      
      // Strategy 2: Look for customer names in search results area
      if (!customerSelected) {
        const customerResults = page.locator('text=/^[A-Z][a-z]+ [A-Z][a-z]+$/').filter({ 
          hasNotText: /Toggle|Sidebar|Menu|Close|Button/
        });
        const resultCount = await customerResults.count();
        
        if (resultCount > 0) {
          try {
            await customerResults.first().click({ force: true, timeout: 3000 });
            selectedCustomerName = await customerResults.first().textContent();
            console.log(`✅ Selected customer: ${selectedCustomerName?.trim()}`);
            customerSelected = true;
          } catch (clickError) {
            // Continue to next attempt
          }
        }
      }
      
      // Strategy 3: Fallback - look for any text containing the search query
      if (!customerSelected) {
        const fallbackResults = page.locator(`text=/.*${searchQuery}.*/i`).filter({ 
          hasNotText: /Toggle|Sidebar|Menu|Close|Button/
        });
        const fallbackCount = await fallbackResults.count();
        
        if (fallbackCount > 0) {
          try {
            await fallbackResults.first().click({ force: true });
            selectedCustomerName = await fallbackResults.first().textContent();
            console.log(`✅ Selected customer from fallback: ${selectedCustomerName?.trim()}`);
            customerSelected = true;
          } catch (clickError) {
            // Continue to next attempt
          }
        }
      }
      
      // If customer found, break out of retry loop
      if (customerSelected) {
        break;
      }
      
      // If not found and not last attempt, try again
      if (attempt < maxRetries) {
        console.log(`⚠️ No customer found with "${searchQuery}", trying another search...`);
      }
    }
    
    // If still no customer found after all attempts
    if (!customerSelected) {
      await page.screenshot({ path: `customer-search-debug-${Date.now()}.png` });
      throw new Error(`No customer found after ${maxRetries} search attempts. Check screenshot for details.`);
    }

    // ========== PART 3: Handle Saved Cards ==========
    console.log("💳 Part 3: Checking for saved cards...");
    
    // Wait a bit for saved cards section to load
    await page.waitForTimeout(1000);
    
    // Track if we found a saved card (if yes, we'll skip deletion)
    let savedCardFound = false;
    
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
        savedCardFound = true;
        
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

    // ========== PART 5: Delete Saved Card (only if we created a new one) ==========
    if (!savedCardFound) {
      console.log("🗑️ Part 5: Deleting newly created card from customer...");
      
      await page.getByRole('button', { name: 'Customers' }).click();
      await page.getByRole('link', { name: 'Customers' }).click();
      console.log("✅ Navigated to customers page");

          // Search for customer using the same search query or customer name
          await page.getByRole('textbox', { name: 'Search customers...' }).fill(searchQuery);
          await page.waitForTimeout(1000);
          
          // Try to find and click the customer we selected earlier
          let customerFound = false;
          
          // Strategy 1: Try to find by the selected customer name
          if (selectedCustomerName) {
            try {
              const customerNameParts = selectedCustomerName.split(' ');
              if (customerNameParts.length >= 2) {
                const firstName = customerNameParts[0];
                const lastName = customerNameParts[1];
                const customerElement = page.getByText(new RegExp(`${firstName}.*${lastName}|${lastName}.*${firstName}`, 'i'));
                const exists = await customerElement.isVisible({ timeout: 2000 }).catch(() => false);
                if (exists) {
                  await customerElement.click();
                  console.log(`✅ Customer found and selected: ${selectedCustomerName}`);
                  customerFound = true;
                }
              }
            } catch (error) {
              // Continue to fallback
            }
          }
          
          // Strategy 2: Fallback - try clicking first result that looks like a name
          if (!customerFound) {
            const customerResults = page.locator('text=/^[A-Z][a-z]+ [A-Z][a-z]+$/').first();
            const resultExists = await customerResults.isVisible({ timeout: 2000 }).catch(() => false);
            if (resultExists) {
              await customerResults.click({ force: true });
              const foundName = await customerResults.textContent();
              console.log(`✅ Customer selected from fallback: ${foundName?.trim()}`);
              customerFound = true;
            }
          }
          
          if (!customerFound) {
            throw new Error('Could not find customer to delete card');
          }

      // Navigate to payment methods
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Payment Methods' }).click();
      await page.waitForTimeout(1000);
      console.log("✅ Navigated to payment methods");

      // Find and delete the card (look for the card we just created - ending in 2049)
      const cardElement = page.getByText(/Visa.*2049|Mastercard.*2049|Amex.*2049/i);
      const cardExists = await cardElement.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (cardExists) {
        await cardElement.click();
        await page.getByRole('button').nth(2).click();
        
        await expect(page.getByRole('heading', { name: 'Delete Payment Method' })).toBeVisible();
        await page.getByRole('button', { name: 'Delete Card' }).click();
        console.log("✅ Card deleted successfully");
      } else {
        console.log("⚠️ Card not found in payment methods - may have already been deleted");
      }

      await page.getByRole('button', { name: 'Close' }).click();
      console.log("✅ Modal closed");
    } else {
      console.log("✅ Saved card was used - skipping deletion step");
    }

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
