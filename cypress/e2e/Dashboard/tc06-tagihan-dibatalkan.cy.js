describe("DASHBOARD - TC06 Tagihan Dibatalkan Card", () => {
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
   * TEST CASE TC06
   * Module: DASHBOARD
   * Deskripsi: Admin dapat mengklik dan melihat isi dari card Tagihan Dibatalkan
   * Expected Result: Berhasil menampilkan modal tagihan dibatalkan terbaru
   */
  it("TC06 - Admin should be able to click and view Tagihan Dibatalkan card", () => {
    // Verify: Dashboard sudah terbuka
    cy.url().should("include", "/admin/dashboard");

    // Step 1: Cari dan klik card "Tagihan Dibatalkan"
    cy.contains("Tagihan Dibatalkan")
      .should("be.visible")
      .click({ force: true });

    // Step 2: Tunggu modal/dialog terbuka dengan wait
    cy.wait(1000);

    // Step 3: Verify modal terbuka dengan cek elemen di dalamnya
    cy.contains("Tagihan Dibatalkan").should("be.visible");

    // Step 4: Verify: Modal menampilkan data tagihan - cek header tabel
    cy.contains("Nama Nasabah").should("be.visible");
    cy.contains("No. Kwitansi").should("be.visible");
    cy.contains("Nominal").should("be.visible");
    cy.contains("Tanggal").should("be.visible");

    // Step 5: Verify: Ada data di dalam tabel
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 6: Verify: Ada button "Tutup" dan klik
    cy.get("button").contains("Tutup").should("be.visible").click();
  });
});
