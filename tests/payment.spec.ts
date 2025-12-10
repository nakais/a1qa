import { test, expect } from '@playwright/test';
import { PaymentPage } from './page-objects/PaymentPage';

test.describe('Payment Flow', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);
    await paymentPage.goto();
    await paymentPage.selectCreditCardKeyed();
  });

  test.describe('Form Validation', () => {
    test('should show error when required fields are missing', async ({ page }) => {
      await paymentPage.fillPaymentDetails('15', '5');
      await paymentPage.fillCardDetails('1212 1212 1122 1122', '', '', '');
      await paymentPage.processPayment();

      await expect(page.getByText('Make sure all the fields are')).toBeVisible();
    });

    test('should show error for invalid card number', async ({ page }) => {
      await paymentPage.fillPaymentDetails('15', '5');
      await paymentPage.fillCardDetails('1212 1212 1122 1122', '12/29', '123', '12323');
      await paymentPage.processPayment();

      await expect(page.getByText('Please enter a valid card')).toBeVisible();
    });
  });

  test.describe('Successful Payment Flow', () => {
    test('should complete payment with valid card details', async ({ page }) => {
      // Fill payment amount and tip
      await paymentPage.fillPaymentDetails('15', '5');

      // Fill card details with invalid card first to test validation
      await paymentPage.fillCardDetails('1212 1212 1122 1122', '12/29', '123', '12323');
      await paymentPage.processPayment();
      await expect(page.getByText('Please enter a valid card')).toBeVisible();

      // Update with valid card number
      await paymentPage.fillCardDetails('4242 4242 4242 4242', '12/29', '123', '12323');
      await paymentPage.processPayment();
      await paymentPage.proceedWithPayment();

      // Verify payment was processed
      await expect(paymentPage.printReceiptButton).toBeVisible();
    });

    test('should handle receipt printing and email sending', async ({ page }) => {
      // Complete payment flow
      await paymentPage.fillPaymentDetails('15', '5');
      await paymentPage.fillCardDetails('4242 4242 4242 4242', '12/29', '123', '12323');
      await paymentPage.processPayment();
      await paymentPage.proceedWithPayment();

      // Print receipt
      await paymentPage.printReceipt();

      // Send receipt via email
      await paymentPage.sendReceipt('naz+test@labthree.org');

      // Close the receipt dialog
      await paymentPage.close();
    });
  });

  test.describe('End-to-End Payment Flow', () => {
    test('should complete full payment flow from start to finish', async ({ page }) => {
      // Step 1: Fill payment details
      await paymentPage.fillPaymentDetails('15', '5');

      // Step 2: Fill card details
      await paymentPage.fillCardDetails('4242 4242 4242 4242', '12/29', '123', '12323');

      // Step 3: Process payment
      await paymentPage.processPayment();
      await paymentPage.proceedWithPayment();

      // Step 4: Handle receipt
      await paymentPage.printReceipt();
      await paymentPage.sendReceipt('naz+test@labthree.org');
      await paymentPage.close();
    });
  });
});
