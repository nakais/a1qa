import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test("Create provider - add new doctor profile", async () => {
  const page = adminSuite.getPage();
  console.log("🧪 Testing create provider functionality...");
  
  // Generate fake American doctor data
  const doctorData = {
    prefix: faker.person.prefix(), // Dr., Mrs., etc.
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number('##########'), // 10 digits
    specialty: faker.helpers.arrayElement(['Cardiology', 'Pediatrics', 'ENT', 'Orthopedics', 'Dermatology']),
    hourlyRate: faker.number.float({ min: 50, max: 200, multipleOf: 0.01 }).toFixed(2),
    workDays: faker.helpers.arrayElements(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], { min: 2, max: 4 }),
    startTime: faker.helpers.arrayElement(['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM']),
    endTime: faker.helpers.arrayElement(['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'])
  };
  
  console.log("📋 Generated doctor profile:", {
    name: `${doctorData.prefix} ${doctorData.firstName} ${doctorData.middleName} ${doctorData.lastName}`,
    email: doctorData.email,
    phone: doctorData.phone,
    specialty: doctorData.specialty,
    rate: `$${doctorData.hourlyRate}/hr`,
    schedule: `${doctorData.workDays.join(', ')} (${doctorData.startTime} - ${doctorData.endTime})`
  });
  
  // Navigate to appointments page
  await page.goto('https://sandbox.useharp.com/appointments');
  console.log("✓ Navigated to appointments page");
  
  // Click Add List button to open provider form
  await page.getByRole('button', { name: 'Add List' }).click();
  console.log("✓ Opened create provider form");
  
  // Fill basic information
  await page.getByRole('textbox', { name: 'First Name *' }).fill(doctorData.prefix);
  await page.getByRole('textbox', { name: 'Middle Name' }).fill(doctorData.middleName);
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(doctorData.lastName);
  console.log("✓ Filled name fields");
  
  // Fill contact information
  await page.getByRole('textbox', { name: 'Email *' }).fill(doctorData.email);
  await page.getByRole('textbox', { name: 'Phone *' }).fill(doctorData.phone);
  console.log("✓ Filled contact information");
  
  // Fill specialty and rate
  await page.getByRole('textbox', { name: 'Specialty *' }).fill(doctorData.specialty);
  await page.getByRole('spinbutton', { name: 'Hourly Rate (Optional)' }).fill(doctorData.hourlyRate);
  console.log(`✓ Set specialty: ${doctorData.specialty}, Rate: $${doctorData.hourlyRate}/hr`);
  
  // Select work days
  for (const day of doctorData.workDays) {
    await page.getByRole('checkbox', { name: day }).click();
  }
  console.log(`✓ Selected work days: ${doctorData.workDays.join(', ')}`);
  
  // Set work hours - start time
  await page.getByRole('combobox').filter({ hasText: ':00 AM' }).nth(3).click();
  await page.getByRole('option', { name: doctorData.startTime }).click();
  console.log(`✓ Set start time: ${doctorData.startTime}`);
  
  // Set work hours - end time
  await page.getByRole('combobox').filter({ hasText: ':00 PM' }).nth(3).click();
  await page.getByRole('option', { name: doctorData.endTime }).click();
  console.log(`✓ Set end time: ${doctorData.endTime}`);
  
  // Create provider
  await page.getByRole('button', { name: 'Create Provider' }).click();
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  console.log("✅ Provider created successfully");
  
  console.log("✅ Create provider test PASSED");
});
