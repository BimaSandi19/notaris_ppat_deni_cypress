describe("AUTH - TC02 Login Success", () => {
  /**
   * TEST CASE TC02
   * Module: AUTH
   * Deskripsi: Login berhasil dengan username & password benar
   * Expected Result: Login berhasil dan redirect ke dashboard admin
   */
  it("TC02 - Should successfully login with valid credentials", () => {
    cy.visit("https://notarisdeni.web.id/login");

    // Step 1: Input username valid
    cy.get('input[type="text"]')
      .eq(0)
      .should("be.visible")
      .type("keuangandn01");

    // Step 2: Input password valid
    cy.get('input[type="password"]')
      .should("be.visible")
      .type("adminkeuangan@dn1");

    // Step 3: Klik tombol Login
    cy.get("button").contains("Login").should("be.visible").click();

    // Verify: Login berhasil (tunggu redirect atau success message)
    cy.url({ timeout: 10000 }).should("not.include", "/login");
  });
});
