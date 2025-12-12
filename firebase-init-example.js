// Example: How to initialize Firebase Admin SDK with proper error handling
require('dotenv').config();

/**
 * BEFORE (causes error):
 * 
 * const admin = require('firebase-admin');
 * admin.initializeApp({
 *   credential: admin.credential.cert({
 *     projectId: process.env.FIREBASE_PROJECT_ID,
 *     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
 *     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // ❌ Error if undefined!
 *   })
 * });
 */

/**
 * AFTER (fixed):
 */

// Option 1: Quick fix with optional chaining
function initializeFirebaseQuickFix() {
  const admin = require('firebase-admin');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // ✅ Safe: won't crash if FIREBASE_PRIVATE_KEY is undefined
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    })
  });
  
  return admin;
}

// Option 2: Best practice with validation (recommended)
function initializeFirebaseWithValidation() {
  // Validate environment variables first
  const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Cannot initialize Firebase Admin SDK. Missing environment variables:\n` +
      `  ${missingVars.join('\n  ')}\n\n` +
      `Please ensure these are set in your .env file or environment configuration.\n` +
      `See .env.example for the required format.`
    );
  }

  // Now safe to initialize
  const admin = require('firebase-admin');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    })
  });

  console.log('✅ Firebase Admin SDK initialized successfully');
  return admin;
}

// Option 3: With detailed logging
function initializeFirebaseWithLogging() {
  console.log('Initializing Firebase Admin SDK...');
  
  // Check each variable individually for better debugging
  const envVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  };

  // Log what we have (without exposing sensitive data)
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      const displayValue = key === 'FIREBASE_PRIVATE_KEY' 
        ? `[SET - ${value.length} characters]` 
        : value;
      console.log(`  ✓ ${key}: ${displayValue}`);
    } else {
      console.error(`  ✗ ${key}: NOT SET`);
    }
  });

  // Check if all are set
  const allSet = Object.values(envVars).every(value => value);
  
  if (!allSet) {
    throw new Error('Cannot initialize Firebase: Missing required environment variables');
  }

  // Initialize
  const admin = require('firebase-admin');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: envVars.FIREBASE_PROJECT_ID,
      clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
      privateKey: envVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    })
  });

  console.log('✅ Firebase initialized successfully\n');
  return admin;
}

// Export the functions
module.exports = {
  initializeFirebaseQuickFix,
  initializeFirebaseWithValidation,
  initializeFirebaseWithLogging,
};

// If running directly, demonstrate the validation
if (require.main === module) {
  console.log('Firebase Initialization Example\n');
  console.log('================================\n');
  
  try {
    initializeFirebaseWithLogging();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 To fix this:');
    console.log('   1. Copy .env.example to .env');
    console.log('   2. Fill in your Firebase credentials');
    console.log('   3. Make sure to include the quotes around FIREBASE_PRIVATE_KEY');
    console.log('   4. Restart your application\n');
  }
}
