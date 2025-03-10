/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.mjs$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      'node_modules/(?!axios)',
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  };
  
  export default config;