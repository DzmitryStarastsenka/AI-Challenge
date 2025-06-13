export default {
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'schema.js',
    '!demo.js',
    '!**/node_modules/**'
  ],
  testMatch: [
    '**/*.test.js'
  ],
  verbose: true
}; 