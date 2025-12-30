# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies

```bash
npm install
npx playwright install
```

### Step 2: Run Your First Test

```bash
# Run all tests
npm test

# Or run with visible browser
npm run test:headed
```

### Step 3: View Results

```bash
# See the test report
npm run test:report
```

That's it! 🎉

---

## 📁 What Was Created

Your codegen test has been transformed into a complete test suite:

### Core Test Files

| File | Purpose |
|------|---------|
| `google-review-config.spec.ts` | Main test suite with 4 comprehensive tests |
| `google-review-config-with-utils.spec.ts` | Alternative version using utilities |
| `test-utils.ts` | Reusable helper functions library |

### Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Playwright configuration (browsers, reports, etc.) |
| `package.json` | Dependencies and npm scripts |
| `.gitignore` | Git ignore rules for test artifacts |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation and usage guide |
| `IMPROVEMENTS.md` | Detailed explanation of improvements made |
| `QUICKSTART.md` | This file - get started quickly |

### CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/playwright-tests.yml` | GitHub Actions workflow |

---

## 🎯 Key Improvements Made

Your original codegen test (~200 lines) has been:

✅ **Simplified**: Removed 80+ redundant actions  
✅ **Organized**: Split into 4 focused test cases  
✅ **Enhanced**: Added comprehensive logging  
✅ **Made Reusable**: Created 10+ helper functions  
✅ **Documented**: Added comments and guides  
✅ **Made Dynamic**: Centralized configuration  

---

## 📝 Available Test Scripts

```bash
# Run all tests
npm test

# Run with visible browser (headed mode)
npm run test:headed

# Debug tests step-by-step
npm run test:debug

# Interactive UI mode
npm run test:ui

# View last test report
npm run test:report
```

---

## 🧪 What the Tests Do

### Test 1: Complete Configuration Flow
Tests the entire workflow from start to finish:
1. Enable Google Review Requests
2. Set request timing
3. Enable SMS notifications
4. Customize message template
5. Save changes
6. Reset to defaults

### Test 2: Toggle Functionality
Verifies toggle switches work correctly:
- Can enable features
- Can disable features
- States persist correctly

### Test 3: Request Timing Validation
Tests input field accepts various values:
- 1 day
- 7 days (1 week)
- 15 days
- 30 days (1 month)

### Test 4: SMS Template Customization
Verifies custom message templates:
- Can enable SMS notifications
- Can customize message
- Can save custom template

---

## 🎨 Example: Add a New Test

Adding a new test is easy with the helper functions:

```typescript
test('should handle invalid input gracefully', async ({ page }) => {
  console.log('\n=== Testing Invalid Input Handling ===\n');
  
  await page.goto(TEST_CONFIG.url);
  
  // Try to set invalid timing
  await fillTextbox(page, 'Request Timing', 'invalid');
  await clickButton(page, 'Save Changes');
  
  // Verify error message appears
  await verifyError(page, 'Please enter a valid number');
  
  console.log('✓ Error handling validated\n');
});
```

---

## 🔍 Debugging Failed Tests

When a test fails, you have multiple tools:

### 1. Console Logs
All actions are logged, showing exactly where the test failed:
```
Step 1: Navigating to https://sandbox.useharp.com/google-review
✓ Page loaded successfully

Step 2: Enabling Google Review Requests
✗ Failed to enable switch
```

### 2. Screenshots
Screenshots are automatically captured on failure:
```bash
# Find them in:
test-results/
```

### 3. Videos
Videos are recorded for failed tests:
```bash
# Find them in:
test-results/
```

### 4. Traces
Detailed traces show every action:
```bash
npx playwright show-trace trace.zip
```

---

## 🌐 Multi-Browser Testing

Tests run on multiple browsers automatically:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

Run specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## 🔧 Configuration

### Change Test URL
Edit `TEST_CONFIG` in the test file:
```typescript
const TEST_CONFIG = {
  url: 'https://your-environment.com/google-review',
  // ...
};
```

### Change Browser
Edit `playwright.config.ts`:
```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
],
```

### Add Environment Variables
Create `.env` file:
```bash
TEST_URL=https://staging.useharp.com/google-review
REQUEST_TIMING=30
```

---

## 📊 CI/CD Integration

Tests are ready for CI/CD with GitHub Actions:

### Automatic Test Runs
- ✅ On every push to `main`
- ✅ On every pull request
- ✅ On manual trigger

### Test Reports
- 📸 Screenshots on failure
- 🎥 Videos on failure
- 📝 HTML reports
- 💾 JSON results

---

## 🆘 Common Issues

### Issue: Browser not installed
```bash
# Solution:
npx playwright install chromium
```

### Issue: Tests timeout
```typescript
// Solution: Increase timeout in playwright.config.ts
use: {
  actionTimeout: 30000, // 30 seconds
}
```

### Issue: Element not found
```typescript
// Solution: Use waiting helpers
await waitForElement(page, '[data-testid="element"]');
```

---

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Improvements Guide**: See `IMPROVEMENTS.md`
- **Playwright Docs**: https://playwright.dev/

---

## 💡 Pro Tips

1. **Run tests in parallel**: 
   ```bash
   npx playwright test --workers=4
   ```

2. **Run specific test**:
   ```bash
   npx playwright test -g "toggle"
   ```

3. **Update snapshots**:
   ```bash
   npx playwright test --update-snapshots
   ```

4. **Use Playwright Inspector**:
   ```bash
   npm run test:debug
   ```

5. **Generate new tests**:
   ```bash
   npx playwright codegen https://your-site.com
   ```

---

## ✨ Next Steps

1. ✅ Run the tests to see them in action
2. ✅ Check out the test reports
3. ✅ Read through the test code
4. ✅ Try modifying a test
5. ✅ Add your own test case
6. ✅ Integrate with CI/CD

---

Happy Testing! 🎭✨
