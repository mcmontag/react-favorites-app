export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: ['<rootDir>/node_modules', 'src'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
