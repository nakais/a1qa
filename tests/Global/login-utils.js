require("dotenv").config();

/**
 * Generic authenticated test suite utility
 * Handles login and session management for different user types
 */
class AuthenticatedTestSuite {
  constructor(userType) {
    this.userType = userType;
    this.page = null;
    this.context = null;
  }

  /**
   * Setup authentication for the test suite
   * @param {Browser} browser - Playwright browser instance
   */
  async setup(browser) {
    console.log(`🔐 Setting up ${this.userType} authentication...`);
    
    // Create new browser context
    this.context = await browser.newContext();
    this.page = await this.context.newPage();

    // Navigate to login page
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    await this.page.goto(`${baseUrl}/login`);

    // Get credentials based on user type
    const email = process.env[`${this.userType.toUpperCase()}_EMAIL`];
    const password = process.env[`${this.userType.toUpperCase()}_PASSWORD`];

    if (!email || !password) {
      throw new Error(
        `Missing credentials for ${this.userType}. Please set ${this.userType.toUpperCase()}_EMAIL and ${this.userType.toUpperCase()}_PASSWORD in .env file`
      );
    }

    // Perform login
    await this.page.getByRole("textbox", { name: /email/i }).fill(email);
    await this.page.getByRole("textbox", { name: /password/i }).fill(password);
    await this.page.getByRole("button", { name: /login|sign in/i }).click();

    // Wait for navigation after login
    await this.page.waitForURL(/dashboard|home/i, { timeout: 10000 });
    
    console.log(`✅ ${this.userType} authenticated successfully`);
  }

  /**
   * Get the authenticated page instance
   * @returns {Page} Playwright page instance
   */
  getPage() {
    if (!this.page) {
      throw new Error("Page not initialized. Call setup() first.");
    }
    return this.page;
  }

  /**
   * Cleanup resources after tests
   */
  async cleanup() {
    console.log(`🧹 Cleaning up ${this.userType} session...`);
    if (this.context) {
      await this.context.close();
    }
    console.log(`✅ ${this.userType} session cleaned up`);
  }
}

module.exports = { AuthenticatedTestSuite };
