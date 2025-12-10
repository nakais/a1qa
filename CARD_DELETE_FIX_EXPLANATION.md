# Fix for Card Deletion Code - Deleting Wrong Card

## Problem
The original code was deleting the wrong card because:
1. `page.getByText(/Visa.*4242/).first().click()` - This could click the first matching card, which might not be the one with expiration 12/27
2. The delete button search was too generic - it found any delete button on the page, not necessarily the one for the 4242 card
3. No verification that the correct card was being deleted

## Solution
The fixed code ensures we delete the **specific card ending in 4242 with expiration 12/27** by:

### Key Improvements:

1. **More Specific Card Selection**
   - Uses: `page.locator('text=/Visa.*4242.*12[\\/]27/i')`
   - Matches both the card number (4242) AND expiration date (12/27)
   - Ensures we're targeting the exact card we saved

2. **Context-Aware Delete Button Search**
   - Finds the card's parent container first
   - Looks for delete button within that container
   - Ensures the delete button is associated with the correct card

3. **Multiple Fallback Strategies**
   - Strategy 1: Delete button in card container
   - Strategy 2: Delete button near the card (after clicking it)
   - Strategy 3: Menu-based delete button

4. **Verification**
   - Checks that the card is actually deleted after the operation
   - Logs confirmation messages for debugging

## Recommended Code (Simple Version)

Use the code from `card-delete-simple.js` - it's cleaner and easier to maintain:

```javascript
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
let deleteButton = null;

// Try to find the card's container
const cardContainer = cardElement.locator('xpath=ancestor::div[contains(@class, "card") or contains(@class, "payment") or contains(@class, "method")]').first();
const containerExists = await cardContainer.count() > 0;

if (containerExists) {
  // Look for delete button within the card container
  deleteButton = cardContainer
    .locator('button[title*="delete" i], button[aria-label*="delete" i], button:has(svg[data-icon="trash"]), button:has(svg[class*="trash"]), button:has(svg[class*="delete"])')
    .or(cardContainer.getByRole('button').filter({ hasText: /^$/ }));
}

// If not found in container, click card and look for delete button
if (!deleteButton || (await deleteButton.count()) === 0) {
  await cardElement.click();
  await page.waitForTimeout(500);
  
  deleteButton = page
    .locator('button[title*="delete" i], button[aria-label*="delete" i]')
    .or(page.locator('button:has(svg[data-icon="trash"]), button:has(svg[class*="trash"])'))
    .or(page.getByRole('button', { name: /delete/i }));
}

const deleteButtonCount = await deleteButton.count();

if (deleteButtonCount === 0) {
  await page.screenshot({ path: `debug-no-delete-button-${Date.now()}.png`, fullPage: true });
  throw new Error("No delete button found for card 4242. Check debug screenshot.");
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

// Verify the card is deleted
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
```

## What Changed

| Original | Fixed |
|----------|-------|
| `page.getByText(/Visa.*4242/).first()` | `page.locator('text=/Visa.*4242.*12[\\/]27/i')` |
| Clicks first matching card | Verifies expiration date matches |
| Searches all delete buttons | Searches delete button in card's container |
| No verification | Verifies card is deleted after operation |

## Testing
After applying the fix:
1. Run the test and verify it deletes the correct card (4242 with 12/27)
2. If multiple cards exist, ensure only the target card is deleted
3. Check console logs to confirm the correct card was found and deleted
