# Fix for Saved Card Visibility Test Failure

## Problem
The test fails at line 494 when trying to find the saved card with locator `locator('text=Visa •••• 4242 Exp: 12/27')`. The element is not found within the 15-second timeout.

## Root Causes
1. **Timing Issue**: Saved cards may load asynchronously after filling the amount field
2. **Strict Locator**: The exact text match might not account for:
   - Different spacing
   - Different bullet character encoding (• vs other characters)
   - Text formatting variations
3. **UI State**: The saved card might only appear after a specific interaction (e.g., clicking a dropdown)

## Recommended Fix

Replace lines **490-496** in your test file with this improved version:

```javascript
        // VERIFY CARD SAVED & DELETE 
        await page.getByRole('textbox', { name: 'Search by name, email, phone' }).fill('michael johnson');
        await page.locator('.flex.items-center.justify-between.p-3').click();

        await page.getByRole('button', { name: 'Credit Card Keyed' }).click();
        
        // Wait for payment form to be ready
        await page.waitForTimeout(1000);
        
        await page.getByRole('textbox', { name: '0.00' }).fill('15');
        
        // Wait for saved cards to load (they may appear asynchronously)
        await page.waitForTimeout(2000);
        
        // Use flexible regex locator to handle text variations
        const card = page.locator('text=/Visa.*4242.*12[\\/]27/i');
        
        // Wait for card with reasonable timeout
        await expect(card).toBeVisible({ timeout: 10000 });
        console.log("💳Card 4242... visible");
```

## Key Changes
1. ✅ Added `waitForTimeout(1000)` after clicking "Credit Card Keyed" to ensure form is ready
2. ✅ Added `waitForTimeout(2000)` after filling amount to allow saved cards to load
3. ✅ Changed locator from exact text match to regex: `text=/Visa.*4242.*12[\\/]27/i`
   - Uses regex for flexible matching
   - Case-insensitive (`i` flag)
   - Handles variations in spacing and formatting
   - Escapes the `/` in the date

## Alternative: More Robust Solution
If the simple fix doesn't work, use the robust solution in `pay.spec.robust-fix.js` which:
- Checks for "Use saved card" buttons/dropdowns
- Tries multiple locator strategies
- Provides better debugging output
- Takes screenshots when card is not found

## Testing
After applying the fix:
1. Run the test and verify the card is found
2. If it still fails, check the debug screenshot
3. Adjust the wait times if needed based on your application's load time
4. Consider using `waitForSelector` or `waitForLoadState` instead of `waitForTimeout` for more reliable waits
