import { test, expect } from "@playwright/test";
const { AuthenticatedTestSuite } = require("../../Global/login-utils");

// Create admin test suite using the generic utility
const adminSuite = new AuthenticatedTestSuite("admin");

test.describe("Subscription Management Tests", () => {
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

    // Navigate directly to Subscription Management page
    await page.goto(process.env.BASE_URL + "/subscription-management");

    // Navigate to Subscription Management tab and verify we're there
    await page.getByRole("heading", { name: "Subscription Management" }).click();

    // Verify we're on the Subscription Management tab
    await expect(page.getByRole("heading", { name: "Subscription Management" })).toBeVisible();
  });

  test("Verify Subscription Management Tab Navigation", async () => {
    const page = adminSuite.getPage();

    // Additional verification that we're on the correct tab
    await expect(page.getByRole("heading", { name: "Subscription Management" })).toBeVisible();

    // You can add more specific checks here based on what should be visible on the Subscription Management tab
    // For example:
    // await expect(page.locator('[data-testid="subscription-container"]')).toBeVisible();
    // await expect(page.getByText("No subscriptions")).toBeVisible(); // if there are no subscriptions initially
  });

  test.afterEach(async () => {
    console.log("Subscription Management test cleanup completed");
  });
});
