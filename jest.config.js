module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist'],
  collectCoverage: true,
  testTimeout: 500000,
};
