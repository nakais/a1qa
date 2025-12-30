/**
 * Type definitions for Google Review Configuration Tests
 * 
 * This file contains TypeScript interfaces and types used across
 * the test suite for better type safety and code completion.
 */

/**
 * Configuration object for test data
 */
export interface TestConfig {
  /** Base URL for the application */
  url: string;
  
  /** Number of days for request timing */
  requestTiming?: string;
  
  /** Custom message template for SMS notifications */
  customMessage?: string;
  
  /** Additional dynamic properties */
  [key: string]: any;
}

/**
 * Toggle switch states
 */
export type ToggleState = 'enabled' | 'disabled';

/**
 * Test result status
 */
export type TestStatus = 'passed' | 'failed' | 'skipped';

/**
 * Browser types supported by Playwright
 */
export type BrowserType = 'chromium' | 'firefox' | 'webkit';

/**
 * Environment types
 */
export type Environment = 'local' | 'development' | 'staging' | 'sandbox' | 'production';

/**
 * Google Review Settings interface
 */
export interface GoogleReviewSettings {
  /** Whether Google Review Requests are enabled */
  enabled: boolean;
  
  /** Number of days after appointment to send request */
  requestTiming: number;
  
  /** SMS notification settings */
  smsNotifications: {
    /** Whether SMS notifications are enabled */
    enabled: boolean;
    
    /** Custom message template */
    messageTemplate: string;
  };
}

/**
 * Test step information
 */
export interface TestStep {
  /** Step number */
  number: number;
  
  /** Step description */
  description: string;
  
  /** Whether the step is optional */
  optional?: boolean;
  
  /** Expected outcome */
  expectedOutcome?: string;
}

/**
 * Test case metadata
 */
export interface TestCaseMetadata {
  /** Test name */
  name: string;
  
  /** Test description */
  description: string;
  
  /** Test category */
  category: 'smoke' | 'regression' | 'integration' | 'e2e';
  
  /** Test priority */
  priority: 'high' | 'medium' | 'low';
  
  /** Estimated duration in seconds */
  estimatedDuration?: number;
  
  /** Test tags */
  tags?: string[];
}

/**
 * Selector strategies
 */
export interface SelectorStrategy {
  /** CSS selector */
  css?: string;
  
  /** XPath selector */
  xpath?: string;
  
  /** Test ID selector */
  testId?: string;
  
  /** Role-based selector */
  role?: {
    type: string;
    name?: string;
  };
  
  /** Text content selector */
  text?: string;
}

/**
 * Wait options for elements
 */
export interface WaitOptions {
  /** Maximum time to wait in milliseconds */
  timeout?: number;
  
  /** Element state to wait for */
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
  
  /** Whether to throw on timeout */
  strict?: boolean;
}

/**
 * Screenshot options
 */
export interface ScreenshotOptions {
  /** Path to save screenshot */
  path?: string;
  
  /** Whether to capture full page */
  fullPage?: boolean;
  
  /** Image quality (0-100) */
  quality?: number;
  
  /** Screenshot type */
  type?: 'png' | 'jpeg';
}

/**
 * Test execution context
 */
export interface TestContext {
  /** Current test name */
  testName: string;
  
  /** Browser being used */
  browser: BrowserType;
  
  /** Environment being tested */
  environment: Environment;
  
  /** Test start time */
  startTime: Date;
  
  /** Test configuration */
  config: TestConfig;
}

/**
 * Assertion result
 */
export interface AssertionResult {
  /** Whether assertion passed */
  passed: boolean;
  
  /** Assertion description */
  description: string;
  
  /** Expected value */
  expected: any;
  
  /** Actual value */
  actual?: any;
  
  /** Error message if failed */
  error?: string;
}

/**
 * Helper function options
 */
export interface HelperOptions {
  /** Whether to log the action */
  shouldLog?: boolean;
  
  /** Custom timeout for the action */
  timeout?: number;
  
  /** Whether to verify the action */
  verify?: boolean;
  
  /** Whether to take screenshot after action */
  screenshot?: boolean;
}

/**
 * Toggle switch options
 */
export interface ToggleSwitchOptions extends HelperOptions {
  /** Target state */
  enable: boolean;
  
  /** Switch name/label */
  switchName: string;
}

/**
 * Fill textbox options
 */
export interface FillTextboxOptions extends HelperOptions {
  /** Textbox label */
  label: string;
  
  /** Value to fill */
  value: string;
  
  /** Whether to clear before filling */
  clear?: boolean;
}

/**
 * Button click options
 */
export interface ButtonClickOptions extends HelperOptions {
  /** Button name/label */
  buttonName: string;
  
  /** Whether to wait for navigation */
  waitForNavigation?: boolean;
  
  /** Whether to wait for response */
  waitForResponse?: string;
}

/**
 * Verification options
 */
export interface VerificationOptions {
  /** Expected message */
  message: string;
  
  /** Maximum wait time */
  timeout?: number;
  
  /** Whether message must be exact */
  exact?: boolean;
  
  /** Whether to log verification */
  shouldLog?: boolean;
}

/**
 * API response mock
 */
export interface ApiResponseMock {
  /** Endpoint to mock */
  endpoint: string;
  
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  /** Response status code */
  status: number;
  
  /** Response body */
  body: any;
  
  /** Response headers */
  headers?: Record<string, string>;
  
  /** Response delay in milliseconds */
  delay?: number;
}

/**
 * Form data interface
 */
export interface FormData {
  /** Field name */
  field: string;
  
  /** Field value */
  value: string | boolean | number;
  
  /** Field type */
  type: 'text' | 'checkbox' | 'radio' | 'select' | 'textarea';
}

/**
 * Navigation options
 */
export interface NavigationOptions {
  /** URL to navigate to */
  url: string;
  
  /** Wait until condition */
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  
  /** Navigation timeout */
  timeout?: number;
  
  /** Whether to log navigation */
  shouldLog?: boolean;
}

/**
 * Test data generator function type
 */
export type TestDataGenerator<T> = () => T;

/**
 * Test cleanup function type
 */
export type CleanupFunction = () => Promise<void> | void;

/**
 * Custom matcher function type
 */
export type CustomMatcher<T> = (received: T, expected: T) => AssertionResult;

/**
 * Test configuration validator
 */
export interface ConfigValidator {
  /** Validates configuration */
  validate(config: TestConfig): boolean;
  
  /** Returns validation errors */
  getErrors(): string[];
}

/**
 * Logger interface
 */
export interface Logger {
  /** Log info message */
  info(message: string): void;
  
  /** Log success message */
  success(message: string): void;
  
  /** Log warning message */
  warn(message: string): void;
  
  /** Log error message */
  error(message: string): void;
  
  /** Log debug message */
  debug(message: string): void;
}

/**
 * Test reporter interface
 */
export interface TestReporter {
  /** Called when test starts */
  onTestStart(testName: string): void;
  
  /** Called when test passes */
  onTestPass(testName: string, duration: number): void;
  
  /** Called when test fails */
  onTestFail(testName: string, error: Error): void;
  
  /** Called when test is skipped */
  onTestSkip(testName: string, reason: string): void;
  
  /** Called when all tests complete */
  onComplete(summary: TestSummary): void;
}

/**
 * Test execution summary
 */
export interface TestSummary {
  /** Total tests */
  total: number;
  
  /** Passed tests */
  passed: number;
  
  /** Failed tests */
  failed: number;
  
  /** Skipped tests */
  skipped: number;
  
  /** Total duration in seconds */
  duration: number;
  
  /** Test results */
  results: TestResult[];
}

/**
 * Individual test result
 */
export interface TestResult {
  /** Test name */
  name: string;
  
  /** Test status */
  status: TestStatus;
  
  /** Test duration in milliseconds */
  duration: number;
  
  /** Error if failed */
  error?: Error;
  
  /** Screenshot path if captured */
  screenshot?: string;
  
  /** Video path if recorded */
  video?: string;
}

/**
 * Retry options
 */
export interface RetryOptions {
  /** Maximum number of retries */
  maxRetries: number;
  
  /** Delay between retries in milliseconds */
  retryDelay?: number;
  
  /** Whether to exponentially increase delay */
  exponentialBackoff?: boolean;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Page load time in milliseconds */
  pageLoadTime: number;
  
  /** Time to first byte in milliseconds */
  timeToFirstByte: number;
  
  /** Time to interactive in milliseconds */
  timeToInteractive: number;
  
  /** DOM content loaded time in milliseconds */
  domContentLoaded: number;
}
