import { Page, Locator } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly creditCardKeyedButton: Locator;
  readonly amountInput: Locator;
  readonly tipInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;
  readonly zipCodeInput: Locator;
  readonly processPaymentButton: Locator;
  readonly proceedWithPaymentButton: Locator;
  readonly printReceiptButton: Locator;
  readonly sendReceiptButton: Locator;
  readonly emailInput: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.creditCardKeyedButton = page.getByRole('button', { name: 'Credit Card Keyed' });
    this.amountInput = page.getByRole('textbox', { name: '0.00' });
    this.tipInput = page.getByPlaceholder('0.00').nth(1);
    this.cardNumberInput = page.getByRole('textbox', { name: '5678 9012 3456' });
    this.expiryInput = page.getByRole('textbox', { name: 'MM/YY' });
    this.cvvInput = page.getByRole('textbox', { name: '123', exact: true });
    this.zipCodeInput = page.getByRole('textbox', { name: '12345' });
    this.processPaymentButton = page.getByRole('button', { name: /Process Card Payment/ });
    this.proceedWithPaymentButton = page.getByRole('button', { name: /Proceed with Payment/ });
    this.printReceiptButton = page.getByRole('button', { name: 'Print Receipt' });
    this.sendReceiptButton = page.getByRole('button', { name: 'Send Receipt' });
    this.emailInput = page.getByRole('textbox', { name: 'Primary email address' });
    this.closeButton = page.getByRole('button', { name: 'Close' });
  }

  async goto() {
    await this.page.goto('https://sprightly-travesseiro-0bd724.netlify.app/pay');
  }

  async selectCreditCardKeyed() {
    await this.creditCardKeyedButton.click();
  }

  async fillPaymentDetails(amount: string, tip: string) {
    await this.amountInput.click();
    await this.amountInput.fill(amount);
    await this.tipInput.click();
    await this.tipInput.fill(tip);
  }

  async fillCardDetails(cardNumber: string, expiry: string, cvv: string, zipCode: string) {
    await this.cardNumberInput.click();
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryInput.click();
    await this.expiryInput.fill(expiry);
    await this.cvvInput.click();
    await this.cvvInput.fill(cvv);
    await this.zipCodeInput.click();
    await this.zipCodeInput.fill(zipCode);
  }

  async processPayment() {
    await this.processPaymentButton.click();
  }

  async proceedWithPayment() {
    await this.proceedWithPaymentButton.click();
  }

  async printReceipt() {
    await this.printReceiptButton.click();
  }

  async sendReceipt(email: string) {
    await this.sendReceiptButton.click();
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.sendReceiptButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}
