import { loginUser } from "../../support/helpers";

describe("DASHBOARD - TC07 Tagihan Belum Lunas Card", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum mengakses dashboard
    loginUser();
    cy.get("body").should("be.visible");
    cy.wait(500);
  });

  /**
   * TEST CASE TC07
   * Module: DASHBOARD
   * Deskripsi: Admin dapat mengklik dan melihat isi dari card Tagihan Belum Lunas
   * Expected Result: Berhasil menampilkan modal tagihan belum lunas terbaru
   */
  it("TC07 - Admin should be able to click and view Tagihan Belum Lunas card", () => {
    // Verify: Dashboard sudah terbuka
    cy.url().should("include", "/admin/dashboard");

    // Step 1: Cari dan klik card "Tagihan Belum Lunas"
    cy.contains("Tagihan Belum Lunas")
      .should("be.visible")
      .click({ force: true });

    // Step 2: Tunggu modal/dialog terbuka dengan wait
    cy.wait(1000);

    // Step 3: Verify modal terbuka dengan cek elemen di dalamnya
    cy.contains("Tagihan Belum Lunas").should("be.visible");

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
