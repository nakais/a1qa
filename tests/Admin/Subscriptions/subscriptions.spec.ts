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

    // You can add more specific checks here based on what should be visible on the Subscriptions tab
    // For example:
    // await expect(page.locator('[data-testid="subscriptions-container"]')).toBeVisible();
    // await expect(page.getByText("No subscriptions")).toBeVisible(); // if there are no subscriptions initially
  });

  test.afterEach(async () => {
    console.log("Subscriptions test cleanup completed");
  });
});
