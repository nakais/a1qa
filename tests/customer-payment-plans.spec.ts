import { test, expect } from '@playwright/test';

test("Customer payment plans - create and edit", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing customer payment plans functionality...");
  
  // Search for customer
  await page.getByRole('textbox', { name: 'Search customers...' }).fill('michael johnson');
  await page.getByText('MJMichael Johnson100%Customer').click();
  console.log("✓ Opened Michael Johnson's profile");

  // Navigate to Payment Plans tab
  await page.getByRole('combobox').click();
  await page.getByLabel('Payment Plans').getByText('Payment Plans').click();
  console.log("✓ Opened Payment Plans tab");

  // Create first payment plan: Biweekly with existing card
  await page.getByRole('button', { name: 'Create Payment Plan' }).click();
  console.log("Creating first payment plan (Biweekly)...");
  
  await page.getByPlaceholder('0.00').fill('3');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Biweekly' }).click();
  console.log("✓ Set $3 amount and Biweekly frequency");
  
  // Set payment count using slider
  await page.getByRole('slider').click();
  await page.locator('.relative.h-1\\.5').click();
  console.log("✓ Configured payment count");
  
  // Select existing card
  await page.locator('.rounded-xl.border.bg-card.text-card-foreground.shadow.cursor-pointer > .p-4').first().click();
  await page.getByRole('radio').nth(2).click();
  console.log("✓ Selected existing card");
  
  await page.getByRole('button', { name: 'Create Payment Plan' }).click();
  await expect(page.getByText('Success')).toBeVisible();
  console.log("✅ First payment plan created successfully");

  // Create second payment plan: Weekly with new card
  await page.getByRole('button', { name: 'Create Payment Plan' }).click();
  console.log("Creating second payment plan (Weekly)...");
  
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Weekly', exact: true }).click();
  console.log("✓ Set Weekly frequency");
  
  // Set payment count using slider
  await page.getByRole('slider').click();
  await page.locator('.relative.h-1\\.5').click();
  console.log("✓ Configured payment count");
  
  // Enter new card details
  await page.getByRole('radio', { name: 'Enter New Card' }).click();
  await page.getByRole('textbox', { name: 'Card Number' }).fill('4242 4242 4242 4242');
  await page.getByRole('textbox', { name: 'Expiry Date' }).fill('03/30');
  await page.getByRole('textbox', { name: '? CVV' }).fill('143');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('43423');
  console.log("✓ Entered new card details");
  
  await page.getByPlaceholder('0.00').fill('4');
  console.log("✓ Set $4 amount");
  
  await page.getByRole('button', { name: 'Create Payment Plan' }).click();
  await expect(page.getByText('Success')).toBeVisible();
  console.log("✅ Second payment plan created successfully");

  // Edit first scheduled payment
  console.log("🔍 Finding first scheduled payment...");

  let paymentFound = false;
  const maxPayments = 7;

  for (let i = 1; i <= maxPayments; i++) {
    const paymentText = `Payment ${i} of ${maxPayments}`;
    const paidLocator = page.getByText(`${paymentText}Paid`).first();
    const scheduledLocator = page.getByText(`${paymentText}ScheduledEdit`).first();
    
    const isPaid = await paidLocator.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isPaid) {
      console.log(`✓ Payment ${i} is already paid, checking next...`);
      continue;
    }
    
    const isScheduled = await scheduledLocator.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isScheduled) {
      console.log(`✅ Found unpaid Payment ${i}, editing now...`);
      
      // Edit payment date
      await page.getByRole('button', { name: 'Edit Date' }).first().click();
      await page.getByRole('textbox').fill('2026-05-22');
      await page.getByRole('button', { name: 'Save' }).click();
      console.log(`✓ Updated date for Payment ${i}`);
      
      // Edit payment amount
      await page.getByRole('button', { name: 'Edit Amount' }).first().click();
      await page.getByPlaceholder('0.00').fill('2.3');
      await page.getByRole('button', { name: 'Save' }).click();
      console.log(`✓ Updated amount for Payment ${i}`);
      
      // Verify success
      await expect(page.getByText('Success', { exact: true })).toBeVisible();
      console.log(`✅ Payment ${i} edited successfully`);
      
      paymentFound = true;
      break;
    }
  }

  if (!paymentFound) {
    console.log("❌ ERROR: No unpaid scheduled payments found");
    throw new Error('No unpaid scheduled payments found');
  }
 
  // Close dialog
  await page.getByRole("button", { name: "Close" }).click();
  console.log("✓ Closed payment plan dialog");

  console.log("✅ Customer payment plans test PASSED");
});
