describe("AUTH - TC09 Logout", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum test logout
    cy.visit("https://notarisdeni.web.id/login");
    cy.get('input[type="text"]').eq(0).type("keuangandn01");
    cy.get('input[type="password"]').type("adminkeuangan@dn1");
    cy.get("button").contains("Login").click();

    // Tunggu redirect ke dashboard
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");
  });

  /**
   * TEST CASE TC04
   * Module: AUTH
   * Deskripsi: Admin dapat melakukan logout dari sistem
   * Expected Result: Berhasil logout dan redirect ke halaman login
   */
  it("TC04 - Admin should successfully logout from system", () => {
    // Verify: Sudah login dan berada di dashboard
    cy.url().should("include", "/admin/dashboard");
    cy.get("body").should("be.visible");

    // Step 1: Cari dan klik button "Log Out" di sidebar kiri bawah
    cy.contains("Log Out").should("be.visible").click();

    // Step 2: Tunggu proses logout
    cy.wait(2000);

    // Step 3: Verify: Redirect ke halaman login
    cy.url({ timeout: 10000 }).should("include", "/login");
    cy.url().should("not.include", "/admin/dashboard");

    // Step 4: Verify: Halaman login terbuka dengan form login
    cy.get("body").should("be.visible");
    cy.get('input[type="text"]').should("be.visible"); // Username input
    cy.get('input[type="password"]').should("be.visible"); // Password input
    cy.get("button").contains("Login").should("be.visible"); // Login button

    // Step 5: Verify: Session sudah ter-clear (tidak bisa akses dashboard tanpa login)
    cy.visit("https://notarisdeni.web.id/admin/dashboard");
    cy.url({ timeout: 5000 }).should("include", "/login"); // Redirect ke login jika tidak authenticated
  });
});
