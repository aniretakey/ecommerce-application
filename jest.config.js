/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleNameMapper: {
    '^@customTypes/(.*)$': '<rootDir>/src/types/$1',
  },
  collectCoverageFrom: ['src/*/*/*', 'src/*/*', 'src/*'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/tests/*', 'src/types/*'],
};
