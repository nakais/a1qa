// SIMPLE FIX: Replace lines 492-494 with this improved version:

        await page.getByRole('textbox', { name: '0.00' }).fill('15');
        
        // Wait for saved cards to load after filling amount
        await page.waitForTimeout(2000);
        
        // Use a more flexible locator with regex to match the card text
        // The original locator was too strict - this handles variations in spacing/formatting
        const card = page.locator('text=/Visa.*4242.*12[\\/]27/i');
        
        // Wait for card to be visible with a reasonable timeout
        await expect(card).toBeVisible({ timeout: 10000 });
        console.log("💳Card 4242... visible");
