# Cash Payment Test - Setup Fix

## The Error
```
Error: Test suite not set up. Call setup() in test.beforeAll first.
at AuthenticatedTestSuite.getPage
```

## Root Cause
The test is trying to use `adminSuite.getPage()` but `adminSuite.setup()` hasn't been called. This needs to be done in a `test.beforeAll` hook.

## The Fix

### Option 1: If test is standalone (new test suite)
Wrap the test in a `test.describe` block with `beforeAll`:

```javascript
test.describe('Cash Payment Tests', () => {
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test('Cash Payment with inventory item', async () => {
    const page = adminSuite.getPage();
    // ... test code ...
  });
});
```

### Option 2: If test is part of existing suite
Make sure the test is inside a `describe` block that already has a `beforeAll` hook with `adminSuite.setup(browser)`.

## Complete Fixed Code Structure

```javascript
test.describe('Cash Payment Tests', () => {
  // ✅ Setup must be called before any test uses adminSuite.getPage()
  test.beforeAll(async ({ browser }) => {
    await adminSuite.setup(browser);
  });

  test('Cash Payment with inventory item', async () => {
    const page = adminSuite.getPage();  // ✅ Now this will work
    
    try {
      // Part 1: Add Items
      // Part 2: Process Payment
      // Part 3: Handle Receipt
    } catch (error) {
      // Error handling
    }
  });
});
```

## Key Points

1. **`test.beforeAll`** - Runs once before all tests in the suite
2. **`adminSuite.setup(browser)`** - Must be called to initialize the suite
3. **`adminSuite.getPage()`** - Can only be used after setup() is called
4. **Test structure** - Test must be inside the describe block with beforeAll

## If Your Test File Already Has a Describe Block

If your test file already has a describe block with a beforeAll hook (like other tests in the file), you just need to make sure your test is inside that describe block:

```javascript
// Existing structure in pay.spec.js
test.describe('Pay Tests', () => {
  test.describe('Admin User Tests', () => {
    test.beforeAll(async ({ browser }) => {
      await adminSuite.setup(browser);
    });

    // Your test should be here:
    test('Cash Payment with inventory item', async () => {
      const page = adminSuite.getPage();
      // ... test code ...
    });
  });
});
```

## Verification

After applying the fix:
1. ✅ Test should run without "Test suite not set up" error
2. ✅ `adminSuite.getPage()` should work correctly
3. ✅ All test operations should execute properly
