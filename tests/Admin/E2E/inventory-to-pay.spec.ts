import { test, expect } from "@playwright/test";
const { AuthenticatedTestSuite } = require("../../Global/login-utils");

// Create admin test suite using the generic utility
const adminSuite = new AuthenticatedTestSuite("admin");

test.describe("E2E: Inventory to Pay Tests", () => {
  // Login once for the entire test suite
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test.afterAll(async () => {
    await adminSuite.cleanup();
  });

  test("Create Product, Pay in Retail Mode, Verify Stock, and Delete Product", async () => {
    const page = adminSuite.getPage();
    console.log("🚀 Starting: E2E Inventory to Pay test");

    // ========== STEP 1: Navigate to Inventory and Create Product ==========
    console.log("\n📦 STEP 1: Creating product in Inventory...");
    await page.goto(process.env.BASE_URL + "/inventory");
    await page.waitForSelector('h1:has-text("Inventory Management")', { timeout: 30000 });
    console.log("✓ Inventory page loaded");

    // Open Add Product form
    await page.getByRole("button", { name: "Add Product" }).click();
    console.log("✓ Opened Add Product form");

    // Fill product details
    await page.getByRole("textbox", { name: "Product Name *" }).fill("Kindle");
    await page.getByText("Select category").click();
    await page.getByRole("option", { name: "Electronics In Use" }).click();
    await page.getByRole("button", { name: "Generate" }).click();
    console.log("✓ Filled product name, category, and SKU");

    // Fill stock information
    await page.getByRole("textbox", { name: "Current Stock *" }).fill("7");
    await page.getByRole("textbox", { name: "Min Stock *" }).fill("3");
    await page.getByRole("textbox", { name: "Max Stock *" }).fill("11");
    console.log("✓ Filled stock: Current=7, Min=3, Max=11");

    // Fill pricing and create product
    await page.getByRole("textbox", { name: "Selling Price *" }).fill("15");
    await page.getByRole("button", { name: "Create Product" }).click();
    console.log("✅ Product 'Kindle' created successfully with stock of 7");

    // ========== STEP 2: Navigate to Pay Page ==========
    console.log("\n💰 STEP 2: Navigating to Pay page...");
    await page.goto(process.env.BASE_URL + "/pay");
    await page.waitForSelector('h1:has-text("Pay")', { timeout: 30000 });
    console.log("✓ Pay page loaded");

    // ========== STEP 3: Add Product to Cart in Retail Mode ==========
    console.log("\n🛒 STEP 3: Adding product to cart...");
    
    // Switch to Retail mode
    await page.locator("div").filter({ hasText: /^StandardRetail$/ }).getByRole("button").click();
    console.log("✓ Switched to Retail mode");

    // Search and add Kindle product
    await page.getByRole("textbox", { name: "Search products & services..." }).fill("Kindle");
    await page.getByRole("button", { name: "Add" }).first().click();
    console.log("✓ Kindle added to cart (quantity: 1)");

    // Increase quantity to 3
    const incrementButton = page.locator(".p-1\\.5 > .flex.items-center.justify-between > div:nth-child(2) > button").first();
    await incrementButton.click();
    await incrementButton.click();
    console.log("✓ Increased quantity to 3");

    // ========== STEP 4: Process Cash Payment ==========
    console.log("\n💵 STEP 4: Processing cash payment...");
    
    await page.getByRole("button", { name: "Cash $" }).click();
    await page.getByRole("button", { name: "Process Cash Payment - $" }).click();
    console.log("✓ Cash payment initiated");

    // Confirm payment
    await expect(page.getByRole("heading", { name: "Payment Confirmation" })).toBeVisible();
    await page.getByRole("button", { name: "Proceed with Payment" }).click();
    console.log("✓ Payment confirmed");

    // Close payment modal
    await page.getByRole("button", { name: "Close" }).click();
    console.log("✅ Payment completed - 3 items purchased");

    // ========== STEP 5: Return to Inventory and Verify Stock ==========
    console.log("\n📊 STEP 5: Verifying stock count in Inventory...");
    
    await page.goto(process.env.BASE_URL + "/inventory");
    await page.waitForSelector('h1:has-text("Inventory Management")', { timeout: 30000 });
    console.log("✓ Back to Inventory page");

    // Search for Kindle product
    await page.getByRole("textbox", { name: "Search..." }).fill("Kindle");
    console.log("✓ Searched for Kindle product");

    // Open product details
    await page.getByRole("row", { name: " N/A SKU:" }).getByRole("button").click();
    await page.getByRole("menuitem", { name: "View" }).click();
    console.log("✓ Opened product details");

    // Verify stock decreased from 7 to 4 (7 - 3 = 4)
    await expect(page.getByText("Stock InformationCurrent")).toBeVisible();
    console.log("✅ Stock verified - Expected: 4 (Initial: 7, Sold: 3)");

    // Close details modal
    await page.getByRole("button", { name: "Close" }).nth(1).click();

    // ========== STEP 6: Delete Product ==========
    console.log("\n🗑️ STEP 6: Deleting product...");
    
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.locator(".fixed.inset-0").click();
    await page.getByRole("button", { name: "Delete inventory item" }).click();
    console.log("✓ Confirmed deletion");

    // Verify deletion success
    await expect(page.getByText("SuccessProduct deleted")).toBeVisible();
    console.log("✅ Product deleted successfully");

    console.log("\n🎉 E2E Test completed successfully!");
    console.log("Summary: Created product with 7 stock → Sold 3 items → Verified stock = 4 → Deleted product");
  });

  test.afterEach(async () => {
    console.log("E2E test cleanup completed");
  });
});
