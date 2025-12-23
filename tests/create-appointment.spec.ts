import { test, expect } from '@playwright/test';

test("Create appointment - select patient and doctor", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing create appointment functionality...");
  
  // Open appointment creation form
  await page.getByRole('button', { name: 'Add Calendar' }).click();
  console.log("✓ Opened appointment creation form");
  
  // Search and select patient
  await page.getByRole('textbox', { name: 'Search by name, email, or' }).fill('michael');
  await expect(page.getByRole('button', { name: 'Michael Johnson naz+' })).toBeVisible();
  await page.getByRole('button', { name: 'Michael Johnson naz+' }).click();
  console.log("✓ Selected patient: Michael Johnson");
  
  // Search and select provider
  await page.getByRole('textbox', { name: 'Search by name or specialty...' }).fill('Dr. peyton');
  await expect(page.getByRole('button', { name: 'Dr. peyton ENT' })).toBeVisible();
  await page.getByRole('button', { name: 'Dr. peyton ENT' }).click();
  console.log("✓ Selected provider: Dr. peyton (ENT)");
  
  // Select date - find an available day (dynamic selection)
  // Dr. peyton works: Monday, Wednesday, Friday, Sunday
  const availableDays = [1, 3, 5, 0]; // Monday=1, Wednesday=3, Friday=5, Sunday=0
  const today = new Date();
  let selectedDate = null;
  let attempts = 0;
  const maxAttempts = 14; // Check up to 2 weeks ahead
  
  console.log("🔍 Finding available appointment date...");
  
  for (let i = 0; i < maxAttempts; i++) {
    const testDate = new Date(today);
    testDate.setDate(today.getDate() + i);
    const dayOfWeek = testDate.getDay();
    
    // Check if this day matches provider's schedule
    if (availableDays.includes(dayOfWeek)) {
      const dateString = testDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Try this date
      await page.getByRole('textbox', { name: 'Date *' }).fill(dateString);
      
      // Check if error appears (provider not available)
      const errorVisible = await page.getByText('⚠️ List is not available on').isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!errorVisible) {
        selectedDate = dateString;
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        console.log(`✅ Found available date: ${dateString} (${dayNames[dayOfWeek]})`);
        break;
      } else {
        console.log(`✗ ${dateString} not available, trying next...`);
        attempts++;
      }
    }
  }
  
  if (!selectedDate) {
    console.log("❌ ERROR: No available dates found in the next 2 weeks");
    throw new Error("No available appointment dates found");
  }
  
  // Select appointment duration
  await page.getByRole('combobox').filter({ hasText: 'minutes' }).click();
  await page.getByRole('option', { name: '15 minutes' }).click();
  console.log("✓ Set duration: 15 minutes");
  
  // Select time slot - dynamically pick time within working hours
  // Dr. peyton typical hours: 9:00 AM - 5:00 PM (or 8:30 AM - 3:00 PM on Sunday)
  const selectedDay = new Date(selectedDate).getDay();
  let timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];
  
  if (selectedDay === 0) { // Sunday
    timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];
  }
  
  await page.getByRole('combobox').filter({ hasText: 'Select time' }).click();
  
  // Try to select first available time slot
  let timeSelected = false;
  for (const timeSlot of timeOptions) {
    const timeOption = page.getByRole('option', { name: timeSlot });
    const isVisible = await timeOption.isVisible().catch(() => false);
    
    if (isVisible) {
      await timeOption.click();
      console.log(`✓ Selected time: ${timeSlot}`);
      timeSelected = true;
      break;
    }
  }
  
  if (!timeSelected) {
    console.log("⚠️ Using default time selection");
    await page.getByRole('option').first().click();
  }
  
  // Fill appointment type
  await page.getByRole('textbox', { name: 'Appointment Type' }).fill('Follow-up');
  console.log("✓ Set appointment type: Follow-up");
  
  // Create appointment
  await page.getByRole('button', { name: 'Create Appointment' }).click();
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  console.log("✅ Appointment created successfully");
  
  console.log("✅ Create appointment test PASSED");
});
