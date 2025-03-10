/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  testTimeout: 15000,
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  moduleFileExtensions: ['js', 'json', 'node']
}; 