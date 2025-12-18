# Digital Document Sending Test Suite

## 📁 Project Structure

```
/workspace/
├── tests/
│   ├── Global/
│   │   └── login-utils.js                           # Authentication utility
│   └── e2e/
│       └── digital-documents/
│           └── digital-document-sending.spec.js     # Main test (146 lines)
├── playwright.config.js                             # Playwright configuration
├── package.json                                     # Dependencies & scripts
├── .env.example                                     # Environment template
├── .gitignore                                       # Git ignore rules
└── README.md                                        # Documentation
```

## ✅ Test Structure (6 Steps)

### STEP 1: Navigate to Digital Documents and Search for Document
- Navigate to `/digital-documents`
- Search for "E2E Customer Form"
- Verify document is visible

### STEP 2: Select Customer to Send Document
- Click "Send" button
- Search for "Michael Johnson"
- Select customer checkbox

### STEP 3: Send Document and Verify Success
- Click "Send Document"
- Verify success message appears

### STEP 4: Navigate to Customers Page and Find Customer
- Click "Customers" link
- Search for customer
- Open customer profile

### STEP 5: Verify Sent Document in Customer Profile
- Open Digital Documents tab
- Verify sent document appears
- Test tab navigation (Completed/Sent with dynamic counts)

### STEP 6: Send Additional Document from Customer Profile
- Open Send Documents dialog
- Search for "Customer Inventory Buying List"
- Select and send document
- Close dialog

## 🎯 Key Features

✅ Minimal code - No redundant actions
✅ Console logging - Progress tracking at each step
✅ Dynamic selectors - Regex patterns for flexible matching
✅ Environment URLs - Uses process.env.BASE_URL
✅ Comments - Clear explanations where needed
✅ Authentication - Uses AuthenticatedTestSuite utility

## 🚀 NPM Scripts

```bash
npm test                 # Run all tests
npm run test:ui          # Interactive UI mode
npm run test:headed      # Show browser window
npm run test:debug       # Debug mode
npm run test:digital-docs # Run only digital docs tests
npm run report           # View test report
```

## 📝 Setup

1. Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit with your actual credentials
   ```

2. Run the test:
   ```bash
   npm run test:digital-docs
   ```
