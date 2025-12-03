import { loginUser } from "../../support/helpers";

describe("DASHBOARD - TC05 Tagihan Lunas Card", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum mengakses dashboard
    loginUser();
  });

  /**
   * TEST CASE TC05
   * Module: DASHBOARD
   * Deskripsi: Admin dapat mengklik dan melihat isi dari card Tagihan Lunas
   * Expected Result: Berhasil menampilkan modal tagihan lunas terbaru
   */
  it("TC05 - Admin should be able to click and view Tagihan Lunas card", () => {
    // Verify: Dashboard sudah terbuka
    cy.url().should("include", "/admin/dashboard");

    // Step 1: Cari dan klik card "Tagihan Lunas"
    cy.contains("Tagihan Lunas").should("be.visible").click({ force: true });

    // Step 2: Tunggu modal/dialog terbuka dengan wait
    cy.wait(1000); // Wait 1 detik untuk modal animasi

    // Step 3: Verify modal terbuka dengan cek elemen di dalamnya
    cy.contains("Tagihan Lunas Terbaru").should("be.visible");

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
