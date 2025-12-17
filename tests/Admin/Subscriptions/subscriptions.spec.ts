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

  test("Generate Subscription Link with Custom Expiry", async () => {
    const page = adminSuite.getPage();

    // Step 1: Open Generate Link dialog
    console.log("Step 1: Opening Generate Link dialog");
    await page.getByRole("button", { name: "Generate Link" }).click();

    // Step 2: Select customer
    console.log("Step 2: Searching and selecting customer");
    await page.getByText("Select customer...").click();
    await page.getByPlaceholder("Search customers...").fill("michael");
    await page.getByText("Michael Johnson").click();

    // Step 3: Select subscription plan
    console.log("Step 3: Selecting subscription plan");
    await page.getByRole("combobox", { name: "Subscription Plan (Optional" }).click();
    await page.getByRole("option", { name: "Test Plan5 $11.00/monthly" }).click();

    // Step 4: Set custom expiry
    console.log("Step 4: Setting custom expiry (100 days)");
    await page.getByRole("combobox", { name: "Link Expiry *" }).click();
    await page.getByRole("option", { name: "Custom" }).click();
    await page.getByPlaceholder("Enter number of days (1-365)").fill("100");

    // Step 5: Generate link
    console.log("Step 5: Generating link");
    await page.getByRole("button", { name: "Generate Link" }).click();
    await expect(page.getByText("✅ Link Generated Successfully!")).toBeVisible();
    console.log("✅ Link generated successfully");

    // Step 6: Send via email and close
    console.log("Step 6: Sending via email and closing dialog");
    await page.getByRole("button", { name: "Send via Email" }).click();
    await page.getByRole("button", { name: "Done" }).click();
    console.log("✅ Test completed successfully");
  });

  test.afterEach(async () => {
    console.log("Subscriptions test cleanup completed");
  });
});
