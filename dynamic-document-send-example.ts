// Example of making document selection dynamic

// Option 1: Dynamic customer name and flexible document selection
await expect(page.getByLabel(/Send Documents to/)).toContainText('Full Form');
await page.locator("label").filter({ hasText: /Full Form/ }).first().click();

// Option 2: If you know the customer name from a variable
const customerName = 'Sarah'; // or get it dynamically
await expect(page.getByLabel(`Send Documents to ${customerName}`)).toContainText('Full Form');
await page.locator("label").filter({ hasText: /Full Form/ }).first().click();

// Option 3: Using checkbox with regex (may not work with custom checkboxes)
await page.getByRole('checkbox', { name: /Full Form/ }).check();

// RECOMMENDED: Click label instead of checkbox (works with custom styled checkboxes)
await page.locator("label").filter({ hasText: /Full Form/ }).first().click();

// Verify checkbox is checked
await expect(page.getByRole("checkbox").first()).toBeChecked();
