# Test Case Script - Digital Document Sending

## Test Suite Information

**Test Suite**: E2E Digital Document Sending Tests  
**Module**: Digital Documents  
**Priority**: High  
**Test Type**: End-to-End (E2E)  
**Automation Tool**: Playwright  
**Author**: QA Team  
**Last Updated**: December 18, 2025

---

## Test Case ID: TC_DD_001

### Test Case Title
**Send Digital Document to Customer and Verify in Customer Profile**

### Objective
Verify that admin users can successfully send digital documents to customers from the Digital Documents page and that the sent documents appear correctly in the customer's profile.

### Pre-conditions
1. Admin user is logged into the system
2. Document "E2E Customer Form" exists in the digital documents library
3. Customer "Michael Johnson" exists in the system
4. Document "Customer Inventory Buying List" exists in the digital documents library

### Test Data

| Field | Value |
|-------|-------|
| Base URL | `https://sprightly-travesseiro-0bd724.netlify.app` |
| Document 1 | E2E Customer Form |
| Document 2 | Customer Inventory Buying List |
| Customer Name | Michael Johnson |
| User Role | Admin |

---

## Test Steps

### STEP 1: Navigate to Digital Documents and Search for Document

| Step | Action | Expected Result |
|------|--------|----------------|
| 1.1 | Navigate to `/digital-documents` | Digital Documents page loads successfully |
| 1.2 | Click on search textbox "Search documents by name..." | Search field is focused and active |
| 1.3 | Enter "e2e customer form" in search field | Search query is entered |
| 1.4 | Verify document appears in results | "E2E Customer Form" is visible in search results |

**Expected Outcome**: Document is found and displayed in search results

---

### STEP 2: Select Customer to Send Document

| Step | Action | Expected Result |
|------|--------|----------------|
| 2.1 | Click "Send" button | Customer selection dialog opens |
| 2.2 | Click on customer search textbox "Search customers by name," | Customer search field is focused |
| 2.3 | Enter "michael johnson" in customer search field | Search query is entered |
| 2.4 | Verify customer appears in results | "Michael Johnson" is visible in search results |
| 2.5 | Click checkbox for "Michael Johnson" row | Customer is selected (checkbox is checked) |

**Expected Outcome**: Customer is successfully selected for document sending

---

### STEP 3: Send Document and Verify Success

| Step | Action | Expected Result |
|------|--------|----------------|
| 3.1 | Click "Send Document" button | Document sending process initiates |
| 3.2 | Wait for success message | "Success" message appears on screen |

**Expected Outcome**: Document is sent successfully and confirmation message is displayed

---

### STEP 4: Navigate to Customer Profile

| Step | Action | Expected Result |
|------|--------|----------------|
| 4.1 | Click "Customers" navigation link | Customers page loads |
| 4.2 | Click on search textbox "Search customers..." | Customer search field is focused |
| 4.3 | Enter "michael johnson" in search field | Search query is entered |
| 4.4 | Verify customer appears in results | "Michael Johnson" is visible in search results |
| 4.5 | Click on "Michael Johnson" customer card/row | Customer profile page opens |

**Expected Outcome**: Customer profile for Michael Johnson is successfully opened

---

### STEP 5: Verify Sent Document in Customer Profile

| Step | Action | Expected Result |
|------|--------|----------------|
| 5.1 | Click on profile section combobox/dropdown | Dropdown menu opens |
| 5.2 | Select "Digital Documents" option | Digital Documents tab is displayed |
| 5.3 | Verify sent document appears in list | "E2E Customer Form" with status "Pending" and sent date is visible |
| 5.4 | Click "Completed Documents" tab | Completed Documents tab content is displayed |
| 5.5 | Click "Sent Documents" tab | Returns to Sent Documents tab content |

**Expected Outcome**: Sent document appears in customer's digital documents list with correct status

**Note**: Document counts in tabs (e.g., "Sent Documents (8)") are dynamic and may vary

---

### STEP 6: Send Additional Document from Customer Profile

| Step | Action | Expected Result |
|------|--------|----------------|
| 6.1 | Click "Send Documents" button | Send documents dialog opens |
| 6.2 | Click on search textbox "Search documents..." | Document search field is focused |
| 6.3 | Enter "customer inventory buying list" in search | Search query is entered |
| 6.4 | Verify document appears with heading | "Customer Inventory Buying List" heading is visible |
| 6.5 | Click checkbox for "Customer Inventory Buying List" | Document is selected (checkbox is checked) |
| 6.6 | Click "Send (1)" button | Document sending process initiates |
| 6.7 | Wait for success message | "Success" message appears |
| 6.8 | Click "Close" button | Dialog closes |

**Expected Outcome**: Second document is sent successfully from customer profile

---

## Expected Final Result

✅ First document "E2E Customer Form" is successfully sent to customer "Michael Johnson"  
✅ Sent document appears in customer's Digital Documents tab with "Pending" status  
✅ Tab navigation works correctly (Sent/Completed documents)  
✅ Second document "Customer Inventory Buying List" is successfully sent from customer profile  
✅ Success confirmations are displayed for both document sends  

---

## Post-conditions

1. Customer "Michael Johnson" has received both documents
2. Documents appear in customer's Digital Documents section
3. Document status is "Pending" until customer completes them
4. System maintains accurate count of sent and completed documents

---

## Test Execution Results

### Execution Log Template

| Execution Date | Tester | Environment | Status | Notes |
|----------------|--------|-------------|--------|-------|
| YYYY-MM-DD | Name | Staging/Prod | Pass/Fail | Any issues or observations |

---

## Known Issues / Notes

1. **Dynamic Counts**: Document counts in tabs may vary based on system state
2. **Search Performance**: Search may take 1-2 seconds to populate results
3. **Date Format**: Sent dates display in format MM/DD/YYYY
4. **Document Size**: Document size and sections count may vary

---

## Test Case Maintenance

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-18 | QA Team | Initial test case creation |

---

## Related Test Cases

- TC_DD_002: Bulk Send Documents to Multiple Customers
- TC_DD_003: Document Send Failure Scenarios
- TC_DD_004: Document Status Updates (Pending → Completed)
- TC_DD_005: Document Send Permissions by Role

---

## Tags

`#e2e` `#digital-documents` `#customer-management` `#document-sending` `#high-priority`
