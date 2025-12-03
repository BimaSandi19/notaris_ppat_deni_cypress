import { loginUser } from "../../support/helpers";

describe("HISTORY - TC21 Access History Page", () => {
  beforeEach(() => {
    // Login terlebih dahulu
    loginUser();
  });

  /**
   * TEST CASE TC21
   * Module: HISTORY
   * Deskripsi: Admin dapat mengakses halaman history/riwayat tagihan dari dashboard
   * Expected Result: Halaman history terbuka menampilkan daftar riwayat tagihan dengan total nominal
   */
  it("TC21 - Admin should be able to access history page from dashboard", () => {
    // Step 1: Verify dashboard sudah terbuka
    cy.url().should("include", "/admin/dashboard");

    // Step 2: Klik menu "Riwayat" di sidebar
    cy.contains("Riwayat").should("be.visible").click();

    // Step 3: Tunggu halaman history loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/history");

    // Step 4: Verify halaman history terbuka dengan heading "Riwayat Tagihan"
    cy.get("h2").contains("Riwayat Tagihan").should("be.visible");

    // Step 5: Verify total nominal visible
    cy.contains("Total Tagihan Lunas:").should("be.visible");
    cy.contains("Rp.").should("be.visible");

    // Step 6: Verify tabel history visible dengan kolom-kolom
    cy.get("table").should("be.visible");
    cy.get("thead").contains("Nama Nasabah").should("be.visible");
    cy.get("thead").contains("Nomor Kwitansi").should("be.visible");
    cy.get("thead").contains("Nominal Tagihan").should("be.visible");
    cy.get("thead").contains("Status Pembayaran").should("be.visible");

    // Step 7: Verify ada data di tabel
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 8: Log berhasil
    cy.log("✅ TC21 - History page accessible dan menampilkan data");
  });
});
