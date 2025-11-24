/**
 * Custom Cypress Commands
 * Commands ini bisa digunakan di semua test files
 */

/**
 * Login dengan username dan password
 * Usage: cy.login('username', 'password')
 */
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login");
  cy.get('input[type="text"]').eq(0).type(username);
  cy.get('input[type="password"]').type(password);
  cy.get("button").contains("Login").click();
});

/**
 * Clear input field dan type text
 * Usage: cy.clearAndType('selector', 'text')
 */
Cypress.Commands.add("clearAndType", (selector, text) => {
  cy.get(selector).clear().type(text);
});

/**
 * Wait untuk element muncul dan klik
 * Usage: cy.clickElement('button', 'Login')
 */
Cypress.Commands.add("clickElement", (selector, text) => {
  cy.get(selector).contains(text).should("be.visible").click();
});
