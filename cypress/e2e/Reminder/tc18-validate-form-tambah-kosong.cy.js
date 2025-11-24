import {
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC18 Validasi Form Tambah Tagihan Kosong", () => {
  beforeEach(() => {
    // Login terlebih dahulu
    cy.visit("https://notarisdeni.web.id/login");
    cy.get('input[type="text"]').eq(0).type("keuangandn01");
    cy.get('input[type="password"]').type("adminkeuangan@dn1");
    cy.get("button").contains("Login").click();

    // Tunggu redirect ke dashboard
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");

    // Navigate ke halaman pengingat dari menu
    cy.contains("Pengingat").should("be.visible").click();

    // Tunggu halaman pengingat loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/reminder");
  });

  /**
   * TEST CASE TC18
   * Module: PENGINGAT
   * Deskripsi: Validasi form tambah tagihan ketika semua field kosong
   * Expected Result: Sistem menolak penyimpanan, menampilkan pesan error field wajib diisi
   */
  it("TC18 - System should validate empty form when adding tagihan", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible
    cy.get("table").should("be.visible");

    // Step 2: Scroll ke button "Tambah Tagihan"
    cy.get("button").contains("Tambah Tagihan").scrollIntoView();
    cy.wait(300);

    // Step 3: Klik button "Tambah Tagihan"
    cy.get("button").contains("Tambah Tagihan").should("be.visible").click();

    // Step 4: Tunggu modal terbuka
    cy.wait(1200);

    // Step 5: Verify modal "Form Tambah Tagihan" terbuka dan visible
    cy.get("#tambahReminder.show").should("be.visible");
    cy.contains("Form Tambah Tagihan").should("be.visible");

    // Step 6: Verify semua field kosong (default state)
    cy.get("#nama_nasabah_create").should("have.value", "");
    cy.get("#nomor_kwitansi_create").should("have.value", "");
    cy.get("#nominal_tagihan_create").should("have.value", "");

    // Step 7: Click field pertama (Nama Nasabah) untuk trigger focus
    cy.get("#nama_nasabah_create").click();

    // Step 8: Click field kedua (Nomor Kwitansi) untuk trigger blur dan validation di field pertama
    cy.get("#nomor_kwitansi_create").click();

    // Step 9: Check HTML5 validation message di Nama Nasabah field
    cy.get("#nama_nasabah_create").then(($input) => {
      // Cek validationMessage atau gunakan checkValidity()
      const validationMessage = $input[0].validationMessage;
      cy.log(`Validation message: ${validationMessage}`);

      // Verify ada pesan validasi (HTML5 validation)
      expect(validationMessage).to.not.be.empty;
      cy.log(`✅ Field Nama Nasabah - Validation: "${validationMessage}"`);
    });

    // Step 10: Click button Tambah untuk trigger validation di semua field
    cy.get("#btnTambahSubmit").click({ force: true });

    // Step 11: Tunggu sebentar untuk validation berjalan
    cy.wait(300);

    // Step 12: Check validasi di Nomor Kwitansi
    cy.get("#nomor_kwitansi_create").then(($input) => {
      const validationMessage = $input[0].validationMessage;
      cy.log(`✅ Field Nomor Kwitansi - Validation: "${validationMessage}"`);
      expect(validationMessage).to.not.be.empty;
    });

    // Step 13: Check validasi di Nominal Tagihan
    cy.get("#nominal_tagihan_create").then(($input) => {
      const validationMessage = $input[0].validationMessage;
      cy.log(`✅ Field Nominal Tagihan - Validation: "${validationMessage}"`);
      expect(validationMessage).to.not.be.empty;
    });

    // Step 14: Log hasil
    cy.log("✅ Validasi form kosong berhasil - HTML5 validation ditampilkan");
  });
});
