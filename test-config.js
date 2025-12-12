// Test file to demonstrate the fix
require('dotenv').config();

const { firebaseConfig1, getFirebaseConfig, firebaseConfig3, safeReplace } = require('./firebase-config');

console.log('Testing Firebase Configuration Fixes\n');
console.log('=====================================\n');

// Test 1: Optional chaining approach
console.log('Test 1: Optional Chaining Approach');
console.log('-----------------------------------');
try {
  console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
  console.log('Config created successfully:', !!firebaseConfig1);
  console.log('Private key length:', firebaseConfig1.credential.private_key.length);
  console.log('✅ Test 1 passed\n');
} catch (error) {
  console.error('❌ Test 1 failed:', error.message, '\n');
}

// Test 2: Validation approach
console.log('Test 2: Validation Approach');
console.log('---------------------------');
try {
  const config = getFirebaseConfig();
  console.log('Config created successfully:', !!config);
  console.log('✅ Test 2 passed\n');
} catch (error) {
  console.error('❌ Test 2 failed:', error.message);
  console.error('This is expected if environment variables are not set.\n');
}

// Test 3: Helper function approach
console.log('Test 3: Helper Function Approach');
console.log('---------------------------------');
try {
  console.log('Testing safeReplace with undefined:', safeReplace(undefined, /\\n/g, '\n'));
  console.log('Testing safeReplace with null:', safeReplace(null, /\\n/g, '\n'));
  console.log('Testing safeReplace with valid string:', safeReplace('Hello\\nWorld', /\\n/g, '\n'));
  console.log('Config created successfully:', !!firebaseConfig3);
  console.log('✅ Test 3 passed\n');
} catch (error) {
  console.error('❌ Test 3 failed:', error.message, '\n');
}

console.log('=====================================');
console.log('\nSummary:');
console.log('--------');
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.log('⚠️  FIREBASE_PRIVATE_KEY is not set');
  console.log('   To fully test, create a .env file based on .env.example');
} else {
  console.log('✅ FIREBASE_PRIVATE_KEY is set and working');
}
