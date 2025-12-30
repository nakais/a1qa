import { Page, expect } from '@playwright/test';

/**
 * Test Utilities for Google Review Configuration Tests
 * 
 * This module provides reusable helper functions for Playwright tests.
 * These utilities can be imported and used across multiple test files.
 */

/**
 * Enables or disables a toggle switch with state checking
 * 
 * @param page - Playwright Page object
 * @param switchName - Accessible name of the switch element
 * @param enable - True to enable, false to disable
 * @param shouldLog - Whether to log the action (default: true)
 */
export async function toggleSwitch(
  page: Page, 
  switchName: string, 
  enable: boolean = true,
  shouldLog: boolean = true
): Promise<void> {
  if (shouldLog) {
    console.log(`${enable ? 'Enabling' : 'Disabling'} switch: ${switchName}`);
  }
  
  const switchElement = page.getByRole('switch', { name: switchName });
  
  // Check current state and toggle only if needed
  const isChecked = await switchElement.isChecked().catch(() => false);
  if (isChecked !== enable) {
    await switchElement.click();
    
    // Verify the state changed
    if (enable) {
      await expect(switchElement).toBeChecked();
    } else {
      await expect(switchElement).not.toBeChecked();
    }
  }
  
  if (shouldLog) {
    console.log(`✓ Switch "${switchName}" is now ${enable ? 'enabled' : 'disabled'}`);
  }
}

/**
 * Fills a textbox with a value and optionally verifies it
 * 
 * @param page - Playwright Page object
 * @param label - Accessible name or label of the textbox
 * @param value - Value to fill
 * @param verify - Whether to verify the value was set (default: true)
 * @param shouldLog - Whether to log the action (default: true)
 */
export async function fillTextbox(
  page: Page, 
  label: string, 
  value: string,
  verify: boolean = true,
  shouldLog: boolean = true
): Promise<void> {
  if (shouldLog) {
    const displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
    console.log(`Filling textbox "${label}" with value: ${displayValue}`);
  }
  
  const textbox = page.getByRole('textbox', { name: label });
  await textbox.click();
  await textbox.clear();
  await textbox.fill(value);
  
  if (verify) {
    await expect(textbox).toHaveValue(value);
  }
  
  if (shouldLog) {
    console.log(`✓ Textbox "${label}" filled successfully`);
  }
}

/**
 * Clicks a button and optionally waits for navigation or response
 * 
 * @param page - Playwright Page object
 * @param buttonName - Accessible name of the button
 * @param waitForNavigation - Whether to wait for navigation after click
 * @param shouldLog - Whether to log the action (default: true)
 */
export async function clickButton(
  page: Page,
  buttonName: string,
  waitForNavigation: boolean = false,
  shouldLog: boolean = true
): Promise<void> {
  if (shouldLog) {
    console.log(`Clicking button: ${buttonName}`);
  }
  
  const button = page.getByRole('button', { name: buttonName });
  
  if (waitForNavigation) {
    await Promise.all([
      page.waitForNavigation(),
      button.click()
    ]);
  } else {
    await button.click();
  }
  
  if (shouldLog) {
    console.log(`✓ Button "${buttonName}" clicked`);
  }
}

/**
 * Verifies that a success message appears
 * 
 * @param page - Playwright Page object
 * @param message - Expected success message (default: 'Success')
 * @param timeout - Maximum time to wait for message (default: 5000ms)
 * @param shouldLog - Whether to log the verification (default: true)
 */
export async function verifySuccess(
  page: Page,
  message: string = 'Success',
  timeout: number = 5000,
  shouldLog: boolean = true
): Promise<void> {
  if (shouldLog) {
    console.log(`Verifying success message: "${message}"`);
  }
  
  const successElement = page.getByText(message, { exact: true });
  await expect(successElement).toBeVisible({ timeout });
  
  if (shouldLog) {
    console.log(`✓ Success message "${message}" confirmed`);
  }
}

/**
 * Verifies that an error message appears
 * 
 * @param page - Playwright Page object
 * @param message - Expected error message
 * @param timeout - Maximum time to wait for message (default: 5000ms)
 * @param shouldLog - Whether to log the verification (default: true)
 */
export async function verifyError(
  page: Page,
  message: string,
  timeout: number = 5000,
  shouldLog: boolean = true
): Promise<void> {
  if (shouldLog) {
    console.log(`Verifying error message: "${message}"`);
  }
  
  const errorElement = page.getByText(message, { exact: true });
  await expect(errorElement).toBeVisible({ timeout });
  
  if (shouldLog) {
    console.log(`✓ Error message "${message}" confirmed`);
  }
}

/**
 * Waits for a specific element to be visible
 * 
 * @param page - Playwright Page object
 * @param selector - CSS selector or role selector
 * @param timeout - Maximum time to wait (default: 10000ms)
 * @param shouldLog - Whether to log the action (default: true)
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout: number = 10000,
  shouldLog: boolean = true
): Promise<void> {
  if (shouldLog) {
    console.log(`Waiting for element: ${selector}`);
  }
  
  await page.waitForSelector(selector, { state: 'visible', timeout });
  
  if (shouldLog) {
    console.log(`✓ Element "${selector}" is visible`);
  }
}

/**
 * Takes a screenshot with a descriptive name
 * 
 * @param page - Playwright Page object
 * @param name - Name for the screenshot file
 * @param fullPage - Whether to capture full page (default: false)
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage: boolean = false
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `screenshot-${name}-${timestamp}.png`;
  
  console.log(`Taking screenshot: ${filename}`);
  await page.screenshot({ path: `screenshots/${filename}`, fullPage });
  console.log(`✓ Screenshot saved: ${filename}`);
}

/**
 * Logs a test section header for better console output organization
 * 
 * @param title - Section title
 * @param level - Importance level (1-3, default: 1)
 */
export function logSection(title: string, level: number = 1): void {
  const separators = ['===', '---', '...'];
  const separator = separators[level - 1] || '---';
  console.log(`\n${separator} ${title} ${separator}\n`);
}

/**
 * Logs test step information
 * 
 * @param stepNumber - Step number
 * @param description - Step description
 */
export function logStep(stepNumber: number, description: string): void {
  console.log(`Step ${stepNumber}: ${description}`);
}

/**
 * Logs a success checkmark with message
 * 
 * @param message - Success message
 */
export function logSuccess(message: string): void {
  console.log(`✓ ${message}`);
}

/**
 * Logs an error with X mark
 * 
 * @param message - Error message
 */
export function logError(message: string): void {
  console.log(`✗ ${message}`);
}

/**
 * Configuration object type for test data
 */
export interface TestConfig {
  url: string;
  requestTiming?: string;
  customMessage?: string;
  [key: string]: any;
}

/**
 * Validates that required configuration values are present
 * 
 * @param config - Configuration object
 * @param requiredKeys - Array of required key names
 * @throws Error if any required keys are missing
 */
export function validateConfig(config: TestConfig, requiredKeys: string[]): void {
  const missingKeys = requiredKeys.filter(key => !config[key]);
  
  if (missingKeys.length > 0) {
    throw new Error(`Missing required configuration keys: ${missingKeys.join(', ')}`);
  }
  
  console.log('✓ Configuration validated successfully');
}
