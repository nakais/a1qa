import { test, expect } from "@playwright/test";
const { AuthenticatedTestSuite } = require("../../Global/login-utils");

// Create admin test suite using the generic utility
const adminSuite = new AuthenticatedTestSuite("admin");

test.describe("E2E: Send Document to Customer Tests", () => {
  // Login once for the entire test suite
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test.afterAll(async () => {
    await adminSuite.cleanup();
  });

  test("Send document, verify in customer profile, and send another document", async () => {
    const page = adminSuite.getPage();
    console.log("🚀 Starting: E2E Send Document to Customer test");

    // ========== STEP 1: Search and Send Document ==========
    console.log("\n📄 STEP 1: Searching and sending document...");
    await page.goto(process.env.BASE_URL + "/digital-documents");
    await page.waitForSelector('h1', { timeout: 30000 });
    console.log("✓ Digital Documents page loaded");

    // Search for E2E Customer Form
    await page.getByRole("textbox", { name: "Search documents by name..." }).fill("e2e customer form");
    await expect(page.getByText("E2E Customer Form")).toBeVisible();
    console.log("✓ Found document: E2E Customer Form");

    // Initiate send
    await page.getByRole("button", { name: "Send" }).click();
    console.log("✓ Clicked Send button");

    // Search for customer Michael Johnson
    await page.getByRole("textbox", { name: "Search customers by name," }).fill("michael johnson");
    await expect(page.getByText("Michael Johnson")).toBeVisible();
    console.log("✓ Found customer: Michael Johnson");

    // Select customer and send
    await page.getByRole("row", { name: "M Michael Johnson naz+test@" }).getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send Document" }).click();
    await expect(page.getByText("Success", { exact: true })).toBeVisible();
    console.log("✅ Document sent successfully to Michael Johnson");

    // ========== STEP 2: Navigate to Customer Profile ==========
    console.log("\n👤 STEP 2: Navigating to customer profile...");
    await page.goto(process.env.BASE_URL + "/customers");
    await page.waitForSelector('h1', { timeout: 30000 });
    console.log("✓ Customers page loaded");

    // Search for Michael Johnson
    await page.getByRole("textbox", { name: "Search customers..." }).fill("michael johnson");
    await expect(page.getByText("Michael Johnson", { exact: true })).toBeVisible();
    console.log("✓ Found customer: Michael Johnson");

    // Open customer profile
    await page.getByText("MJMichael Johnson100%Customer").click();
    console.log("✓ Opened customer profile");

    // ========== STEP 3: Verify Sent Document in Profile ==========
    console.log("\n✅ STEP 3: Verifying sent document in profile...");
    
    // Navigate to Digital Documents tab
    await page.getByRole("combobox").click();
    await page.getByLabel("Digital Documents").getByText("Digital Documents").click();
    console.log("✓ Opened Digital Documents tab");

    // Verify E2E Customer Form appears in sent documents
    await expect(page.getByText(/E2E Customer Form.*Pending.*Sent:/)).toBeVisible();
    console.log("✅ Verified: E2E Customer Form appears in sent documents list");

    // Check completed documents tab
    await page.getByRole("tab", { name: /Completed Documents \(\d+\)/ }).click();
    console.log("✓ Checked Completed Documents tab");

    // Return to sent documents tab
    await page.getByRole("tab", { name: /Sent Documents \(\d+\)/ }).click();
    console.log("✓ Returned to Sent Documents tab");

    // ========== STEP 4: Send Another Document from Customer Profile ==========
    console.log("\n📤 STEP 4: Sending another document from customer profile...");
    
    // Open send documents dialog
    await page.getByRole("button", { name: "Send Documents" }).click();
    console.log("✓ Opened Send Documents dialog");

    // Search for Customer Inventory Buying List
    await page.getByRole("textbox", { name: "Search documents..." }).fill("customer inventory buying list");
    await page.waitForTimeout(1000); // Wait for search results to load
    console.log("✓ Searched for: Customer Inventory Buying List");

    // Select first search result
    const firstCheckbox = page.getByRole("checkbox").first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.check();
    console.log("✓ Selected first search result");

    // Send document
    await page.getByRole("button", { name: /Send \(\d+\)/ }).click();
    await expect(page.getByText("Success")).toBeVisible();
    console.log("✅ Document sent successfully");

    // Close dialog
    await page.getByRole("button", { name: "Close" }).click();
    console.log("✓ Closed send documents dialog");

    console.log("\n🎉 E2E Test completed successfully!");
    console.log("Summary: Sent E2E Customer Form → Verified in customer profile → Sent Customer Inventory Buying List");
  });

  test.afterEach(async () => {
    console.log("E2E test cleanup completed");
  });
});
