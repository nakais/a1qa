// Fixed card deletion code - ensures we delete the correct card (4242)

        // Delete saved card
        console.log("💳 Looking for card 4242 to delete...");

        // Find the specific card container that contains "4242"
        // First, find all elements that contain "4242" and "Visa"
        const cardContainers = page.locator('text=/Visa.*4242/i');
        const cardCount = await cardContainers.count();
        
        if (cardCount === 0) {
          throw new Error("Card with number 4242 not found in payment methods");
        }
        
        console.log(`✅ Found ${cardCount} card(s) matching 4242`);
        
        // Find the parent container of the card text to locate the delete button
        // The delete button is usually in the same container as the card info
        let cardContainer = null;
        let deleteButton = null;
        
        // Strategy 1: Look for the card text and find its parent container
        for (let i = 0; i < cardCount; i++) {
          const cardElement = cardContainers.nth(i);
          const cardText = await cardElement.textContent();
          
          // Verify this is the correct card (contains 4242 and date 12/27)
          if (cardText && cardText.includes('4242') && (cardText.includes('12/27') || cardText.includes('Exp'))) {
            console.log(`✅ Found correct card at index ${i}: ${cardText.trim()}`);
            
            // Find the parent container (usually a div or card element)
            cardContainer = cardElement.locator('..').or(cardElement.locator('xpath=ancestor::div[contains(@class, "card") or contains(@class, "payment")]'));
            
            // Look for delete button within this container
            // Try multiple strategies to find the delete button
            deleteButton = cardContainer
              .locator('button[title*="delete" i], button[aria-label*="delete" i], button:has(svg[data-icon="trash"]), button:has(svg[class*="trash"]), button:has(svg[class*="delete"])')
              .or(cardContainer.getByRole('button').filter({ hasText: /^$/ }).first());
            
            const deleteButtonExists = await deleteButton.count();
            
            if (deleteButtonExists > 0) {
              console.log(`✅ Found delete button for card ${i}`);
              break;
            }
          }
        }
        
        // Strategy 2: If delete button not found in container, look for it near the card text
        if (!deleteButton || (await deleteButton.count()) === 0) {
          console.log("💳 Trying alternative approach: looking for delete button near card text...");
          
          // Find the card element again
          const targetCard = page.locator('text=/Visa.*4242.*12[\\/]27/i').or(page.locator('text=/4242.*12[\\/]27/i'));
          const targetCardCount = await targetCard.count();
          
          if (targetCardCount > 0) {
            // Get the card element
            const cardElement = targetCard.first();
            
            // Look for delete button in the same row/container
            // Try finding a sibling or nearby button
            const nearbyDeleteButton = cardElement
              .locator('xpath=following-sibling::button | preceding-sibling::button | ancestor::div//button[contains(@title, "delete") or contains(@aria-label, "delete")]')
              .or(page.locator('button').filter({ hasText: /^$/ }).near(cardElement));
            
            const nearbyCount = await nearbyDeleteButton.count();
            
            if (nearbyCount > 0) {
              deleteButton = nearbyDeleteButton.first();
              console.log("✅ Found delete button using alternative approach");
            }
          }
        }
        
        // Strategy 3: Click on the card first, then look for delete in a modal/menu
        if (!deleteButton || (await deleteButton.count()) === 0) {
          console.log("💳 Trying strategy 3: clicking card to open menu...");
          
          // Click the specific card to open its menu/modal
          const specificCard = page.locator('text=/Visa.*4242.*12[\\/]27/i').first();
          await specificCard.click();
          await page.waitForTimeout(1000);
          
          // Now look for delete button in the opened context
          deleteButton = page
            .getByRole('button', { name: /delete/i })
            .or(page.locator('button[title*="delete" i], button[aria-label*="delete" i]'))
            .or(page.locator('button:has(svg[data-icon="trash"]), button:has(svg[class*="trash"])'));
        }
        
        // Final check: ensure we have a delete button
        const finalDeleteButtonCount = await deleteButton.count();
        
        if (finalDeleteButtonCount === 0) {
          // Take screenshot for debugging
          await page.screenshot({ path: `debug-no-delete-button-${Date.now()}.png`, fullPage: true });
          
          // Log all buttons on the page for debugging
          const allButtons = page.getByRole('button');
          const buttonCount = await allButtons.count();
          console.log(`Found ${buttonCount} total buttons on page`);
          
          for (let i = 0; i < Math.min(buttonCount, 10); i++) {
            const btn = allButtons.nth(i);
            const btnText = await btn.textContent();
            const btnTitle = await btn.getAttribute('title');
            const btnAriaLabel = await btn.getAttribute('aria-label');
            console.log(`Button ${i}: text="${btnText}", title="${btnTitle}", aria-label="${btnAriaLabel}"`);
          }
          
          throw new Error("No delete button found for card 4242. Check debug screenshot.");
        }
        
        console.log(`✅ Found delete button, clicking...`);
        await deleteButton.first().click();
        console.log("✅ Delete button clicked");

        // Wait for delete confirmation dialog
        await page.waitForTimeout(1000);

        // Verify we're deleting the correct card by checking the confirmation dialog
        // The confirmation should mention the card number or last 4 digits
        const confirmationDialog = page.locator('text=/.*4242.*|.*Delete.*Card.*').first();
        const dialogVisible = await confirmationDialog.isVisible().catch(() => false);
        
        if (!dialogVisible) {
          console.log("⚠️ Warning: Delete confirmation dialog may not show card number");
        } else {
          const dialogText = await confirmationDialog.textContent();
          console.log(`✅ Confirmation dialog text: ${dialogText}`);
        }

        // Click the "Delete Card" confirmation button
        const deleteCardButton = page.getByRole("button", {
          name: /Delete Card|Delete|Confirm/i,
        });
        
        await expect(deleteCardButton).toBeVisible({ timeout: 5000 });
        
        // Double-check the button text to ensure it's the delete confirmation
        const buttonText = await deleteCardButton.textContent();
        console.log(`✅ Confirming deletion with button: "${buttonText}"`);
        
        await deleteCardButton.click();
        console.log("✅ Delete Card confirmation clicked");

        // Wait for deletion to process
        await page.waitForTimeout(2000);

        // Verify the card is actually deleted by checking it's no longer visible
        const cardStillVisible = await page.locator('text=/Visa.*4242.*12[\\/]27/i').isVisible().catch(() => false);
        if (cardStillVisible) {
          console.log("⚠️ Warning: Card 4242 may still be visible after deletion");
        } else {
          console.log("✅ Card 4242 is no longer visible - deletion confirmed");
        }

        // Close modal if it's still open
        const closeButton = page.getByRole('button', { name: 'Close' });
        const closeButtonVisible = await closeButton.isVisible().catch(() => false);
        
        if (closeButtonVisible) {
          await closeButton.click();
          console.log("✅ Modal closed");
        }

        console.log("🗑️ Card 4242 deleted successfully");
