/**
 * Error Comparison: Before and After
 * 
 * This file demonstrates the exact error you encountered
 * and shows how each solution prevents it.
 */

// Simulate the error condition
const mockEnv = {
  FIREBASE_PROJECT_ID: undefined,
  FIREBASE_PRIVATE_KEY: undefined,
  FIREBASE_CLIENT_EMAIL: undefined,
};

console.log('================================');
console.log('ERROR REPRODUCTION');
console.log('================================\n');

// ❌ ORIGINAL CODE (causes the error)
console.log('❌ ORIGINAL CODE (will crash):');
console.log('private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, "\\n")\n');

try {
  const config = {
    private_key: mockEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
  console.log('✓ Success:', config);
} catch (error) {
  console.log('💥 ERROR THROWN:');
  console.log(`   ${error.name}: ${error.message}\n`);
}

console.log('================================');
console.log('SOLUTIONS');
console.log('================================\n');

// ✅ SOLUTION 1: Optional Chaining
console.log('✅ SOLUTION 1: Optional Chaining');
console.log('private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, "\\n") || ""\n');

try {
  const config = {
    private_key: mockEnv.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  };
  console.log('✓ Success! Config created:', JSON.stringify(config, null, 2));
  console.log('✓ No error thrown, safely handles undefined\n');
} catch (error) {
  console.log('✗ Error:', error.message, '\n');
}

// ✅ SOLUTION 2: Logical OR with type check
console.log('✅ SOLUTION 2: Logical OR');
console.log('private_key: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\\\n/g, "\\n")\n');

try {
  const config = {
    private_key: (mockEnv.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  };
  console.log('✓ Success! Config created:', JSON.stringify(config, null, 2));
  console.log('✓ No error thrown, provides default empty string\n');
} catch (error) {
  console.log('✗ Error:', error.message, '\n');
}

// ✅ SOLUTION 3: Nullish Coalescing
console.log('✅ SOLUTION 3: Nullish Coalescing');
console.log('private_key: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\\\n/g, "\\n")\n');

try {
  const config = {
    private_key: (mockEnv.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  };
  console.log('✓ Success! Config created:', JSON.stringify(config, null, 2));
  console.log('✓ No error thrown, uses nullish coalescing\n');
} catch (error) {
  console.log('✗ Error:', error.message, '\n');
}

// ✅ SOLUTION 4: Validation before use
console.log('✅ SOLUTION 4: Validation Before Use');
console.log('if (!process.env.FIREBASE_PRIVATE_KEY) throw new Error(...)\n');

try {
  if (!mockEnv.FIREBASE_PRIVATE_KEY) {
    throw new Error('FIREBASE_PRIVATE_KEY environment variable is required');
  }
  const config = {
    private_key: mockEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
  console.log('✓ Success! Config created:', config, '\n');
} catch (error) {
  console.log('✓ Validation caught the issue early:');
  console.log(`   ${error.message}`);
  console.log('✓ This is better because it gives a clear error message\n');
}

console.log('================================');
console.log('COMPARISON SUMMARY');
console.log('================================\n');

console.log('Solution                 | Pros                              | Cons');
console.log('-------------------------|-----------------------------------|----------------------------------');
console.log('Optional Chaining        | • Concise                         | • Silently fails');
console.log('(?.)                     | • No extra code                   | • May cause issues later');
console.log('                         | • Prevents crash                  |');
console.log('-------------------------|-----------------------------------|----------------------------------');
console.log('Logical OR (||)          | • Simple                          | • Treats "" as falsy');
console.log('                         | • Wide browser support            | • Less precise than ??');
console.log('                         | • Provides default                |');
console.log('-------------------------|-----------------------------------|----------------------------------');
console.log('Nullish Coalescing (??)  | • Only null/undefined             | • Newer syntax');
console.log('                         | • More precise than ||            | • May need transpilation');
console.log('                         | • Provides default                |');
console.log('-------------------------|-----------------------------------|----------------------------------');
console.log('Validation               | • Fails fast                      | • More code');
console.log('                         | • Clear error messages            | • Requires setup');
console.log('                         | • Best for production             |');
console.log('');
console.log('RECOMMENDATION: Use validation in production, optional chaining for quick fixes.\n');
