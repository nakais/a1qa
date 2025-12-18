import { test, expect } from "@playwright/test";
const { AuthenticatedTestSuite } = require("../../Global/login-utils");

// Create admin test suite using the generic utility
const adminSuite = new AuthenticatedTestSuite("admin");

test.describe("E2E: Digital Document Sending Tests", () => {
  // Login once for the entire test suite
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test.afterAll(async () => {
    await adminSuite.cleanup();
  });

  test("Send Digital Document to Customer and Verify in Customer Profile", async () => {
    const page = adminSuite.getPage();
    console.log("🚀 Starting: E2E Digital Document Sending test");

    // Test data
    const documentName = "E2E Customer Form";
    const customerName = "Michael Johnson";
    const secondDocumentName = "Customer Inventory Buying List";



    // ========== STEP 1: Navigate to Digital Documents and Search for Document ==========

    console.log("\n📄 STEP 1: Searching for document to send...");
    await page.goto(process.env.BASE_URL + "/digital-documents");
    console.log("✓ Digital Documents page loaded");

    // Search for document
    await page.getByRole("textbox", { name: "Search documents by name..." }).click();
    await page.getByRole("textbox", { name: "Search documents by name..." }).fill(documentName.toLowerCase());
    await expect(page.getByText(documentName)).toBeVisible();
    console.log(`✓ Found document: ${documentName}`);



    // ========== STEP 2: Select Customer to Send Document ==========

    console.log("\n👤 STEP 2: Selecting customer recipient...");
    await page.getByRole("button", { name: "Send" }).click();
    console.log("✓ Opened customer selection dialog");

    // Search for customer
    await page.getByRole("textbox", { name: "Search customers by name," }).click();
    await page.getByRole("textbox", { name: "Search customers by name," }).fill(customerName.toLowerCase());
    await expect(page.getByText(customerName)).toBeVisible();
    console.log(`✓ Found customer: ${customerName}`);

    // Select customer checkbox
    await page.getByRole("row", { name: new RegExp(customerName, "i") }).getByRole("checkbox").check();
    console.log(`✓ Selected customer: ${customerName}`);



    // ========== STEP 3: Send Document and Verify Success ==========

    console.log("\n📤 STEP 3: Sending document...");
    await page.getByRole("button", { name: "Send Document" }).click();
    await expect(page.getByText("Success", { exact: true })).toBeVisible();
    console.log(`✅ Document "${documentName}" sent successfully to ${customerName}`);



    // ========== STEP 4: Navigate to Customers Page and Find Customer ==========

    console.log("\n🔍 STEP 4: Navigating to customer profile...");
    await page.getByRole("link", { name: "Customers" }).click();
    console.log("✓ Customers page loaded");

    // Search for customer
    await page.getByRole("textbox", { name: "Search customers..." }).click();
    await page.getByRole("textbox", { name: "Search customers..." }).fill(customerName.toLowerCase());
    await expect(page.getByText(customerName, { exact: true })).toBeVisible();
    console.log(`✓ Found customer: ${customerName}`);

    // Open customer profile
    await page.getByText(new RegExp(customerName, "i")).first().click();
    console.log("✓ Opened customer profile");



    // ========== STEP 5: Verify Sent Document in Customer Profile ==========

    console.log("\n✅ STEP 5: Verifying sent document in customer profile...");

    // Navigate to Digital Documents tab
    await page.getByRole("combobox").click();
    await page.getByLabel("Digital Documents").getByText("Digital Documents").click();
    console.log("✓ Opened Digital Documents tab");

    // Verify document appears in Sent Documents (with dynamic count)
    await expect(page.getByText(new RegExp(documentName, "i"))).toBeVisible();
    console.log(`✓ Verified document "${documentName}" appears in Sent Documents`);

    // Check tab navigation (with dynamic counts)
    await page.getByRole("tab", { name: /Completed Documents \(\d+\)/ }).click();
    console.log("✓ Navigated to Completed Documents tab");

    await page.getByRole("tab", { name: /Sent Documents \(\d+\)/ }).click();
    console.log("✓ Returned to Sent Documents tab");



    // ========== STEP 6: Send Additional Document from Customer Profile ==========

    console.log("\n📨 STEP 6: Sending additional document from customer profile...");

    // Open send documents dialog
    await page.getByRole("button", { name: "Send Documents" }).click();
    console.log("✓ Opened Send Documents dialog");

    // Search for second document
    await page.getByRole("textbox", { name: "Search documents..." }).click();
    await page.getByRole("textbox", { name: "Search documents..." }).fill(secondDocumentName.toLowerCase());

    // Verify document is visible
    await expect(
      page.locator("label").filter({ hasText: new RegExp(secondDocumentName, "i") }).getByRole("heading")
    ).toBeVisible();
    console.log(`✓ Found document: ${secondDocumentName}`);

    // Select and send document
    await page.getByRole("checkbox", { name: new RegExp(secondDocumentName, "i") }).check();
    await page.getByRole("button", { name: "Send (1)" }).click();
    await expect(page.getByText("Success")).toBeVisible();
    console.log(`✅ Document "${secondDocumentName}" sent successfully`);

    // Close dialog
    await page.getByRole("button", { name: "Close" }).click();
    console.log("✓ Closed send documents dialog");


    console.log("\n🎉 E2E Test completed successfully!");
    console.log(`Summary: Sent "${documentName}" to ${customerName} → Verified in profile → Sent "${secondDocumentName}"`);
  });

  test.afterEach(async () => {
    console.log("E2E test cleanup completed");
  });
});
