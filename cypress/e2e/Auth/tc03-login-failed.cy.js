describe("AUTH - TC03 Login Failed", () => {
  /**
   * TEST CASE TC03
   * Module: AUTH
   * Deskripsi: Login gagal dengan username/password salah
   * Expected Result: Muncul notifikasi 'Username atau Password salah.'
   */
  it("TC03 - Should show error message with invalid credentials", () => {
    cy.visit("https://notarisdeni.web.id/login");

    // Step 1: Input username valid
    cy.get('input[type="text"]')
      .eq(0)
      .should("be.visible")
      .type(Cypress.env("TEST_USERNAME"));

    // Step 2: Input password salah
    cy.get('input[type="password"]')
      .should("be.visible")
      .type("passwordngasal123");

    // Step 3: Klik tombol Login
    cy.get("button").contains("Login").should("be.visible").click();

    // Verify: Muncul error message
    cy.get('.error-message, [class*="error"], [class*="alert"]', {
      timeout: 5000,
    })
      .should("be.visible")
      .and("contain", "Username atau Password salah.");

    // Verify: Masih di halaman login
    cy.url().should("include", "/login");
  });
});
