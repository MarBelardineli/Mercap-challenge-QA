const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',   
  reporterOptions: {
    reportDir: 'cypress/reports', 
    overwrite: false,
    html: false, 
    json: true
  },

  e2e: {
    baseUrl: 'https://www.saucedemo.com/v1',
    setupNodeEvents(on, config) {
      
    },
  },
});
