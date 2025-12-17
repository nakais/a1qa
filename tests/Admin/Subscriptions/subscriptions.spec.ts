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

  test.afterEach(async () => {
    console.log("Subscriptions test cleanup completed");
  });
});
