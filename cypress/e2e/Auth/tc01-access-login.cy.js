describe("AUTH - TC01 Access Login Page", () => {
  /**
   * TEST CASE TC01
   * Module: AUTH
   * Deskripsi: Admin berhasil mengakses halaman login
   * Expected Result: Halaman login terbuka dengan semua elemen visible
   */
  it("TC01 - Admin should successfully access login page", () => {
    // Buka halaman login
    cy.visit("https://notarisdeni.web.id/login");

    // Verify: Halaman login terbuka
    cy.get("body").should("be.visible");

    // Verify: Elemen halaman login visible
    cy.get("h1, h2, h3").should("be.visible"); // Title/heading
    cy.get('input[type="text"]').should("be.visible"); // Username input
    cy.get('input[type="password"]').should("be.visible"); // Password input
    cy.get("button").contains("Login").should("be.visible"); // Login button

    // Verify: URL berada di halaman login
    cy.url().should("include", "/login");
  });
});
