import { test, expect } from "@playwright/test";
const { AuthenticatedTestSuite } = require("../../Global/login-utils");

// Create admin test suite using the generic utility
const adminSuite = new AuthenticatedTestSuite("admin");

test.describe("Subscriptions Tests", () => {
  // Login once for the entire test suite
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test.afterAll(async () => {
    await adminSuite.cleanup();
  });

  test.beforeEach(async () => {
    // Get the authenticated page
    const page = adminSuite.getPage();

    // Navigate directly to Subscriptions page
    await page.goto(process.env.BASE_URL + "/subscriptions");

    // Navigate to Subscriptions tab and verify we're there
    await page.getByRole("heading", { name: "Subscription Management" }).click();

    // Verify we're on the Subscriptions tab
    await expect(page.getByRole("heading", { name: "Subscription Management" })).toBeVisible();
  });

  test("Verify Subscriptions Tab Navigation", async () => {
    const page = adminSuite.getPage();

    // Additional verification that we're on the correct tab
    await expect(page.getByRole("heading", { name: "Subscription Management" })).toBeVisible();
  });

  test("Generate Subscription Link with Custom Expiry and Send via Email", async () => {
    const page = adminSuite.getPage();
    console.log("Starting: Generate Subscription Link test");

    // Open Generate Link dialog
    console.log("Opening Generate Link dialog...");
    await page.getByRole("button", { name: "Generate Link" }).click();

    // Search and select customer
    console.log("Selecting customer: Michael Johnson");
    await page.getByText("Select customer...").click();
    await page.getByPlaceholder("Search customers...").fill("michael");
    await page.getByText("Michael Johnson").click();

    // Select subscription plan
    console.log("Selecting subscription plan: Test Plan5");
    await page.getByRole("combobox", { name: "Subscription Plan (Optional" }).click();
    await page.getByRole("option", { name: "Test Plan5 $11.00/monthly" }).click();

    // Set custom expiry (100 days)
    console.log("Setting custom expiry: 100 days");
    await page.getByRole("combobox", { name: "Link Expiry *" }).click();
    await page.getByRole("option", { name: "Custom" }).click();
    await page.getByPlaceholder("Enter number of days (1-365)").fill("100");

    // Generate link and verify success
    console.log("Generating subscription link...");
    await page.getByRole("button", { name: "Generate Link" }).click();
    await expect(page.getByText("✅ Link Generated Successfully!")).toBeVisible();
    console.log("✅ Link generated successfully!");

    // Send via email and close dialog
    console.log("Sending link via email...");
    await page.getByRole("button", { name: "Send via Email" }).click();
    await page.getByRole("button", { name: "Done" }).click();
    console.log("✅ Test completed successfully!");
  });

  test("Search Customer, Copy Link, and Complete Subscription Payment", async () => {
    const page = adminSuite.getPage();
    console.log("Starting: Complete Subscription Payment test");

    // Search for customer by name
    console.log("Searching for customer: Michael Johnson");
    await page.getByRole("textbox", { name: "Search by customer or token..." }).fill("michael");
    await expect(page.getByText("Michael Johnson").first()).toBeVisible();

    // Copy subscription link
    console.log("Copying subscription link...");
    await page.getByRole("button", { name: "Copy link" }).first().click();
    await expect(page.getByText("Link Copied", { exact: true })).toBeVisible();
    console.log("✅ Link copied successfully");

    // Open link in new tab
    console.log("Opening subscription link in new tab...");
    const page2Promise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Open link" }).first().click();
    const page2 = await page2Promise;

    // Verify payment page loaded
    await expect(page2.getByRole("heading", { name: "Complete Your Payment" })).toBeVisible();
    console.log("Payment page loaded successfully");

    // Fill payment details
    console.log("Filling payment details...");
    await page2.getByRole("textbox", { name: "Card Number *" }).fill("4242 4242 4242 4242");
    
    // Set expiry date
    await page2.getByRole("combobox").filter({ hasText: "Month" }).click();
    await page2.getByRole("option", { name: "08" }).click();
    await page2.getByRole("combobox").filter({ hasText: "Year" }).click();
    await page2.getByRole("option", { name: "2030" }).click();
    
    // Fill CVV and ZIP
    await page2.getByRole("textbox", { name: "CVV *" }).fill("123");
    await page2.getByRole("textbox", { name: "ZIP Code *" }).fill("12345");
    
    // Fill cardholder name
    await page2.getByRole("textbox", { name: "Cardholder Name *" }).fill("Michael Johnson");
    
    // Accept terms
    console.log("Accepting terms and conditions...");
    await page2.getByRole("checkbox", { name: "I agree to the terms and" }).click();

    // Submit payment
    console.log("Submitting payment...");
    await page2.getByRole("button", { name: "Pay $11.00 & Subscribe" }).click();

    // Verify subscription activation
    await expect(page2.getByText("Subscription Activated!", { exact: true })).toBeVisible();
    console.log("✅ Subscription activated successfully!");
    console.log("✅ Test completed successfully!");
  });

  test.afterEach(async () => {
    console.log("Subscriptions test cleanup completed");
  });
});
