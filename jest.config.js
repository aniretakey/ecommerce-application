/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleNameMapper: {
    '^@customTypes/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
  collectCoverageFrom: ['src/*/*/*', 'src/*/*', 'src/*'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/tests/*', 'src/types/*', 'src/utils/apiClientData.ts'],
};
