import { Page } from '@playwright/test';

/**
 * Helper functions for batch cadence tests
 */

export class BatchCadenceHelper {
  constructor(private page: Page) {}

  /**
   * Navigate to Batch Cadence tab
   */
  async navigateToBatchCadence() {
    console.log('Navigating to Batch Cadence tab');
    await this.page.getByRole('tab', { name: 'Batch Cadence' }).click();
  }

  /**
   * Select a batch from dropdown
   */
  async selectBatch(batchName: string) {
    console.log(`Selecting batch: ${batchName}`);
    await this.page.getByRole('combobox').filter({ hasText: 'All Batches (24)' }).click();
    await this.page.getByRole('option', { name: batchName }).click();
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    console.log('Clearing filters');
    await this.page.getByRole('button', { name: 'Clear Filters' }).click();
  }

  /**
   * Send reminder and verify success
   */
  async sendReminder() {
    console.log('Sending reminder');
    await this.page.getByRole('button', { name: 'Send Reminder' }).click();
  }

  /**
   * Open reminder history
   */
  async openReminderHistory() {
    console.log('Opening Reminder History');
    await this.page.getByRole('button', { name: 'Reminder History' }).click();
  }

  /**
   * Open invoices
   */
  async openInvoices() {
    console.log('Opening Invoices');
    await this.page.getByRole('button', { name: 'Invoices' }).click();
  }
}
