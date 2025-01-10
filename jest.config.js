module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
    testMatch: [
      '**/__tests__/unit-tests/**/*.{js,ts,jsx,tsx}',
      '**/__tests__/functionnal-tests/**/*.{js,ts,jsx,tsx}'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest']
    },
    testPathIgnorePatterns: ['/node_modules/'],
    verbose: true
};