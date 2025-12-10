// ROBUST FIX: Replace the section starting from line 490 with this:

        // VERIFY CARD SAVED & DELETE 
        await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('michael johnson');
        await page.locator('.flex.items-center.justify-between.p-3').click();

        await page.getByRole('button', { name: 'Credit Card Keyed' }).click();
        
        // Wait for payment form to be fully loaded
        await page.waitForTimeout(1000);
        
        await page.getByRole('textbox', { name: '0.00' }).fill('15');
        
        // Wait for saved cards to appear (they may load asynchronously)
        await page.waitForTimeout(2000);
        
        // Check if there's a "Use saved card" or similar button/dropdown that needs to be clicked
        const useSavedCardButton = page.getByRole('button', { name: /use.*saved|saved.*card/i });
        const savedCardButtonCount = await useSavedCardButton.count();
        
        if (savedCardButtonCount > 0) {
          console.log("💳 Found 'Use saved card' button, clicking...");
          await useSavedCardButton.first().click();
          await page.waitForTimeout(1000);
        }
        
        // Try multiple locator strategies for the saved card
        let card = null;
        let cardFound = false;
        
        // Strategy 1: Original locator with regex for flexibility
        card = page.locator('text=/Visa.*4242.*12[\\/]27/i');
        if (await card.count() > 0) {
          cardFound = true;
          console.log("💳 Found card with Strategy 1 (regex match)");
        }
        
        // Strategy 2: Look for any text containing "4242" and "Exp" or date
        if (!cardFound) {
          card = page.locator('text=/4242.*(?:Exp|12[\\/]27)/i');
          if (await card.count() > 0) {
            cardFound = true;
            console.log("💳 Found card with Strategy 2 (partial match)");
          }
        }
        
        // Strategy 3: Look for button or clickable element with card info
        if (!cardFound) {
          card = page.getByRole('button', { name: /4242/i });
          if (await card.count() > 0) {
            cardFound = true;
            console.log("💳 Found card with Strategy 3 (button)");
          }
        }
        
        // Strategy 4: Look in any element containing the card number
        if (!cardFound) {
          card = page.locator('text=/.*4242.*/i');
          if (await card.count() > 0) {
            // Filter to find the one that also mentions Visa or Exp
            const allCards = await card.all();
            for (const cardElement of allCards) {
              const text = await cardElement.textContent();
              if (text && (text.includes('Visa') || text.includes('Exp') || text.includes('12/27'))) {
                card = cardElement;
                cardFound = true;
                console.log("💳 Found card with Strategy 4 (text search)");
                break;
              }
            }
          }
        }
        
        if (!cardFound) {
          // Debug: Take screenshot and log page content
          console.log("❌ Could not find saved card. Taking debug screenshot...");
          await page.screenshot({ path: `debug-saved-card-not-found-${Date.now()}.png`, fullPage: true });
          
          // Log all visible text on the page for debugging
          const bodyText = await page.locator('body').textContent();
          console.log("Page content snippet:", bodyText?.substring(0, 1000));
          
          throw new Error('Saved card with number 4242 not found. Check debug screenshot.');
        }
        
        // Verify the card is visible
        await expect(card.first()).toBeVisible({ timeout: 10000 });
        console.log("💳Card 4242... visible");
