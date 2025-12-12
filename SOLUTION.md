# Fix for TypeError: Cannot read properties of undefined (reading 'replace')

## Problem
The error occurs when trying to call `.replace()` on `process.env.FIREBASE_PRIVATE_KEY` when it's undefined:

```javascript
private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
```

**Error:** `TypeError: Cannot read properties of undefined (reading 'replace')`

## Root Cause
The environment variable `FIREBASE_PRIVATE_KEY` is not set or is undefined, causing the `.replace()` method call to fail.

## Solutions

### Option 1: Optional Chaining (Recommended for Quick Fix)
Use optional chaining (`?.`) to safely access the `replace()` method:

```javascript
private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || ""
```

**Pros:**
- Quick one-line fix
- Prevents runtime errors
- Provides empty string fallback

**Cons:**
- Silently fails if environment variable is missing
- May cause issues later if Firebase requires a valid key

### Option 2: Environment Variable Validation (Recommended for Production)
Validate all required environment variables at startup:

```javascript
function validateEnvVars() {
  const required = ['FIREBASE_PRIVATE_KEY', 'FIREBASE_PROJECT_ID', ...];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

validateEnvVars();

// Now safe to use
private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
```

**Pros:**
- Fails fast with clear error message
- Prevents running with invalid configuration
- Better for production environments

**Cons:**
- Requires upfront validation setup
- Application won't start if env vars are missing

### Option 3: Helper Function
Create a reusable helper function:

```javascript
function safeReplace(str, pattern, replacement) {
  return typeof str === 'string' ? str.replace(pattern, replacement) : '';
}

private_key: safeReplace(process.env.FIREBASE_PRIVATE_KEY, /\\n/g, "\n")
```

**Pros:**
- Reusable across codebase
- Type-safe
- Can add logging/debugging

**Cons:**
- Adds extra function call
- Still silently fails

## How to Set Environment Variables

### Using .env file (with dotenv package)
1. Install dotenv: `npm install dotenv`
2. Create a `.env` file in your project root
3. Add your Firebase credentials:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nKey\nHere\n-----END PRIVATE KEY-----\n"
```
4. Load it in your app:
```javascript
require('dotenv').config();
```

### Using System Environment Variables
```bash
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

### In Cloud Platforms
- **Vercel/Netlify**: Add in dashboard under Environment Variables
- **Heroku**: `heroku config:set FIREBASE_PRIVATE_KEY="..."`
- **AWS/GCP**: Use secrets manager or environment configuration

## Best Practices

1. **Never commit credentials** - Always add `.env` to `.gitignore`
2. **Use .env.example** - Provide a template with dummy values
3. **Validate early** - Check environment variables at application startup
4. **Use secrets managers** - For production, use proper secret management (AWS Secrets Manager, Google Secret Manager, etc.)
5. **Document requirements** - List all required environment variables in README

## Testing Your Fix

1. Create a `.env` file with your Firebase credentials
2. Run your application
3. Verify Firebase initializes correctly
4. Test with missing env var to ensure error handling works

## Common Pitfalls

- **Forgetting to restart** - After changing `.env`, restart your application
- **String quotes** - Ensure private key is properly quoted in `.env`
- **Escaped newlines** - Private key should have `\n` (backslash-n), not actual newlines
- **Platform differences** - Environment variable syntax differs between platforms
