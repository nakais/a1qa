import { test, expect } from '@playwright/test';

test("Customer subscriptions - view and verify", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing customer subscriptions functionality...");
  
  // Search for customer
  await page.getByRole('textbox', { name: 'Search customers...' }).fill('michael johnson');
  await page.getByText('MJMichael Johnson100%Customer').click();
  console.log("✓ Opened Michael Johnson's profile");

  // Navigate to Subscriptions tab
  await page.getByRole('combobox').click();
  await page.getByLabel('Subscriptions').getByText('Subscriptions').click();
  console.log("✓ Opened Subscriptions tab");

  // Verify subscriptions are showing (count > 0)
  try {
    const subscriptionText = await page.getByText(/Subscriptions \((\d+)\)/).first().textContent();
    
    if (!subscriptionText) {
      console.log("❌ ERROR: Subscriptions count not found");
      throw new Error("Subscriptions count element not found");
    }
    
    // Extract number from "Subscriptions (9)"
    const match = subscriptionText.match(/Subscriptions \((\d+)\)/);
    const count = match ? parseInt(match[1]) : 0;
    
    if (count > 0) {
      console.log(`✅ Subscriptions are showing successfully (${count} subscription${count > 1 ? 's' : ''} found)`);
      
      // Click to view subscriptions
      await page.getByText(/Subscriptions \(\d+\)/).click();
      console.log("✓ Opened subscriptions list");
    } else {
      console.log("❌ ERROR: No subscriptions found (count is 0)");
      throw new Error("No subscriptions available");
    }
  } catch (error) {
    console.log("❌ ERROR: Failed to verify subscriptions");
    throw error;
  }

  // Close dialog
  await page.getByRole('button', { name: 'Close' }).click();
  console.log("✓ Closed subscriptions dialog");

  console.log("✅ Customer subscriptions test PASSED");
});
