
Cypress.Commands.add('loginUI', (username, password) => {
  cy.visit('/');
  cy.get('[data-test="username"]').should('be.visible').type(username);
  cy.get('[data-test="password"]').should('be.visible').type(password);
  cy.get('#login-button').click();
});

Cypress.Commands.add('resetAppState', () => {
  cy.get('.bm-burger-button').click();
  cy.get('#reset_sidebar_link').click();
});   


