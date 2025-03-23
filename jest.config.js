module.exports = {
    preset: 'ts-jest', // Use ts-jest for TypeScript
    testEnvironment: 'node', // Use Node.js environment
    testMatch: ['**/tests/**/*.test.ts'], // Look for test files in the `tests` folder
    moduleFileExtensions: ['ts', 'js'], // Recognize .ts and .js files
  };