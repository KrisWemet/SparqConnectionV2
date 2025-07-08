module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/**/*.test.js',
    '<rootDir>/**/*.spec.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/setup/jest.setup.js'],
  
  // Timeout for tests (e2e tests can be slow)
  testTimeout: 60000,
  
  // Coverage configuration
  collectCoverage: false, // Don't collect coverage for e2e tests
  
  
  // Global variables
  globals: {
    'TEST_BASE_URL': 'http://localhost:3000',
    'TEST_TIMEOUT': 30000,
    'HEADLESS': process.env.CI === 'true',
    'SLOW_MO': process.env.CI === 'true' ? 0 : 50
  },
  
  // Test groups
  testPathIgnorePatterns: [
    '<rootDir>/../node_modules/',
    '<rootDir>/../.next/',
    '<rootDir>/fixtures/',
    '<rootDir>/utils/',
    '<rootDir>/screenshots/',
    '<rootDir>/logs/',
    '<rootDir>/reports/'
  ],
  
  // Custom reporters
  reporters: [
    'default',
    ['<rootDir>/reporters/evidence-reporter.js', {
      outputDir: '<rootDir>/reports',
      includeScreenshots: true,
      includeLogs: true,
      includeStateCaptures: true
    }]
  ],
  
  // Verbose output for debugging
  verbose: true,
  
  // Maximum concurrent tests (e2e tests should run sequentially)
  maxConcurrency: 1,
  
  // Bail on first failure in CI
  bail: process.env.CI === 'true' ? 1 : 0,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Error on deprecated features
  errorOnDeprecated: true
};