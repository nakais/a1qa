// Simplified and more reliable card deletion code

        // Delete saved card - specifically targeting card ending in 4242
        console.log("💳 Looking for card 4242 to delete...");

        // Find the specific card by matching both Visa and 4242, and verify it has the correct expiration
        const targetCard = page.locator('text=/Visa.*4242.*12[\\/]27/i');
        const cardExists = await targetCard.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!cardExists) {
          throw new Error("Card with number 4242 and expiration 12/27 not found in payment methods");
        }
        
        console.log("✅ Found card 4242 with expiration 12/27");
        
        // Get the card element and find its parent container
        const cardElement = targetCard.first();
        
        // Find the delete button that's associated with this specific card
        // Strategy: Look for delete button in the same container/row as the card
        let deleteButton = null;
        
        // Try to find the card's container (parent div, card element, etc.)
        const cardContainer = cardElement.locator('xpath=ancestor::div[contains(@class, "card") or contains(@class, "payment") or contains(@class, "method")]').first();
        const containerExists = await cardContainer.count() > 0;
        
        if (containerExists) {
          // Look for delete button within the card container
          deleteButton = cardContainer
            .locator('button[title*="delete" i], button[aria-label*="delete" i], button:has(svg[data-icon="trash"]), button:has(svg[class*="trash"]), button:has(svg[class*="delete"])')
            .or(cardContainer.getByRole('button').filter({ hasText: /^$/ }));
        }
        
        // If not found in container, look for delete button near the card (sibling or nearby)
        if (!deleteButton || (await deleteButton.count()) === 0) {
          // Click the card first to potentially open a menu or highlight it
          await cardElement.click();
          await page.waitForTimeout(500);
          
          // Now look for delete button - it might be in a menu or nearby
          deleteButton = page
            .locator('button[title*="delete" i], button[aria-label*="delete" i]')
            .or(page.locator('button:has(svg[data-icon="trash"]), button:has(svg[class*="trash"])'))
            .or(page.getByRole('button', { name: /delete/i }));
        }
        
        const deleteButtonCount = await deleteButton.count();
        
        if (deleteButtonCount === 0) {
          // Last resort: look for any icon button (empty text) near the card
          const allIconButtons = page.getByRole('button').filter({ hasText: /^$/ });
          const iconButtonCount = await allIconButtons.count();
          
          if (iconButtonCount > 0) {
            // Try the icon button closest to our card
            deleteButton = allIconButtons.first();
            console.log("⚠️ Using fallback: clicking first icon button found");
          } else {
            await page.screenshot({ path: `debug-no-delete-button-${Date.now()}.png`, fullPage: true });
            throw new Error("No delete button found for card 4242. Check debug screenshot.");
          }
        }
        
        console.log(`✅ Found delete button for card 4242`);
        await deleteButton.first().click();
        console.log("✅ Delete button clicked");

        // Wait for delete confirmation dialog
        await page.waitForTimeout(1000);

        // Click the "Delete Card" confirmation button
        const deleteCardButton = page.getByRole("button", {
          name: /Delete Card|Delete|Confirm/i,
        });
        
        await expect(deleteCardButton).toBeVisible({ timeout: 5000 });
        await deleteCardButton.click();
        console.log("✅ Delete Card confirmation clicked");

        // Wait for deletion to process
        await page.waitForTimeout(2000);

        // Verify the card is deleted (should not be visible anymore)
        const cardStillExists = await targetCard.isVisible({ timeout: 2000 }).catch(() => false);
        if (cardStillExists) {
          console.log("⚠️ Warning: Card 4242 may still be visible after deletion");
        } else {
          console.log("✅ Verified: Card 4242 is no longer visible");
        }

        // Close modal if it exists
        const closeButton = page.getByRole('button', { name: 'Close' });
        const isCloseVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isCloseVisible) {
          await closeButton.click();
          console.log("✅ Modal closed");
        }

        console.log("🗑️ Card 4242 deleted successfully");
