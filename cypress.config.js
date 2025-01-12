const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: [
      'cypress/e2e/**/*.cy.js',
      '__tests__/e2e-tests/**/*.cy.js',
    ],
  },
});
