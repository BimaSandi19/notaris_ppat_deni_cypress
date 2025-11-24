describe("DASHBOARD - TC04 Access Dashboard", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum mengakses dashboard
    cy.visit("https://notarisdeni.web.id/login");
    cy.get('input[type="text"]').eq(0).type("keuangandn01");
    cy.get('input[type="password"]').type("adminkeuangan@dn1");
    cy.get("button").contains("Login").click();

    // Tunggu redirect ke dashboard
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");
  });

  /**
   * TEST CASE TC04
   * Module: DASHBOARD
   * Deskripsi: Admin dapat mengakses halaman Dashboard
   * Expected Result: Berhasil mengakses halaman Dashboard
   */
  it("TC04 - Admin should successfully access Dashboard", () => {
    // Verify: URL berada di halaman dashboard
    cy.url().should("include", "/admin/dashboard");

    // Verify: Halaman dashboard terbuka
    cy.get("body").should("be.visible");

    // Verify: Sidebar menu visible dengan navigasi
    cy.get("aside, [class*='sidebar']").should("be.visible");

    // Verify: Main content visible
    cy.get("main, [class*='content']").should("be.visible");

    // Verify: Statistik/Card elements visible
    cy.get("[class*='card'], [class*='stat']").should(
      "have.length.greaterThan",
      0
    );
  });
});
