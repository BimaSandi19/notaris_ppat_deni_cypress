describe("DASHBOARD - TC08 Total Nominal Tagihan Belum Lunas Card", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum mengakses dashboard
    cy.visit("https://notarisdeni.web.id/login");
    cy.get('input[type="text"]').eq(0).type("keuangandn01");
    cy.get('input[type="password"]').type("adminkeuangan@dn1");
    cy.get("button").contains("Login").click();

    // Tunggu redirect ke dashboard dan verify halaman loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");
    cy.get("body").should("be.visible");
    cy.wait(500);
  });

  /**
   * TEST CASE TC08
   * Module: DASHBOARD
   * Deskripsi: Admin dapat mengklik dan melihat isi dari card Total Nominal Tagihan Belum Lunas
   * Expected Result: Berhasil menampilkan modal total nominal tagihan belum lunas terbaru
   */
  it("TC08 - Admin should be able to click and view Total Nominal Tagihan Belum Lunas card", () => {
    // Verify: Dashboard sudah terbuka
    cy.url().should("include", "/admin/dashboard");

    // Step 1: Cari dan klik card "Total Nominal Tagihan Belum Lunas"
    cy.contains("Total Nominal Tagihan Belum Lunas")
      .should("be.visible")
      .click({ force: true });

    // Step 2: Tunggu modal/dialog terbuka dengan wait
    cy.wait(1000);

    // Step 3: Verify modal terbuka dengan cek elemen di dalamnya
    cy.contains("Total Nominal Tagihan Belum Lunas").should("be.visible");

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
