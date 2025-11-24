describe("REMINDER - TC10 Access Pengingat Page", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum mengakses halaman pengingat
    cy.visit("https://notarisdeni.web.id/login");
    cy.get('input[type="text"]').eq(0).type("keuangandn01");
    cy.get('input[type="password"]').type("adminkeuangan@dn1");
    cy.get("button").contains("Login").click();

    // Tunggu redirect ke dashboard
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");

    // Navigate ke halaman pengingat dari menu sidebar
    cy.contains("Pengingat").should("be.visible").click();

    // Tunggu halaman pengingat loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/reminder");
  });

  /**
   * TEST CASE TC10
   * Module: PENGINGAT
   * Deskripsi: Admin dapat mengakses halaman Pengingat
   * Expected Result: Berhasil menampilkan halaman Pengingat
   */
  it("TC10 - Admin should successfully access Pengingat page", () => {
    // Verify: URL berada di halaman pengingat
    cy.url().should("include", "/admin/reminder");

    // Verify: Halaman pengingat terbuka dengan tabel Informasi Tagihan
    cy.contains("Informasi Tagihan").should("be.visible");
  });
});
