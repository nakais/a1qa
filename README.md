# Firebase Private Key Error Fix

This repository demonstrates how to fix the common error:
```
TypeError: Cannot read properties of undefined (reading 'replace')
```

This error occurs when `process.env.FIREBASE_PRIVATE_KEY` is undefined and you try to call `.replace()` on it.

## Quick Fix

Replace this:
```javascript
private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
```

With this:
```javascript
private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || ""
```

## Files

- **`firebase-config.js`** - Three different solutions to handle this error
- **`SOLUTION.md`** - Detailed explanation of the problem and solutions
- **`.env.example`** - Template for environment variables
- **`test-config.js`** - Test script to verify the fixes work

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Firebase credentials to `.env`

4. Run tests:
```bash
npm test
```

## Solutions Provided

1. **Optional Chaining** - Quick fix using `?.` operator
2. **Environment Validation** - Validate env vars at startup (recommended for production)
3. **Helper Function** - Reusable type-safe replacement function

See `SOLUTION.md` for detailed explanations and best practices.

## Common Causes

- Environment variable not set in `.env` file
- Forgot to load `.env` file with `dotenv`
- Environment variable not configured in deployment platform
- Typo in environment variable name

## Security Note

⚠️ Never commit your `.env` file or expose Firebase credentials in code!