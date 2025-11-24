import {
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC20 Validasi Edit Tagihan dengan Data Kosong", () => {
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
   * TEST CASE TC20
   * Module: PENGINGAT
   * Deskripsi: Validasi edit reminder dengan data kosong
   * Expected Result: Sistem menolak perubahan, menampilkan pesan error bahwa field wajib diisi
   */
  it("TC20 - System should validate edit reminder when clearing required fields", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible dengan data
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 2: Klik button edit pada row pertama
    cy.get("table tbody tr")
      .first()
      .find("button.btn-primary")
      .first()
      .should("be.visible")
      .click();

    // Step 3: Tunggu modal edit terbuka
    cy.wait(1500);

    // Step 4: Verify modal "Form Edit Tagihan" terbuka
    cy.get("#editReminder.show").should("be.visible");
    cy.contains("Form Edit Tagihan").should("be.visible");

    // Step 5: Get current value dari field nama
    cy.get("#nama_nasabah_edit")
      .should("be.visible")
      .invoke("val")
      .as("currentName");

    // Step 6: Clear field Nama Nasabah (kosongkan)
    cy.get("#nama_nasabah_edit").clear();

    // Step 7: Verify field Nama Nasabah sekarang kosong
    cy.get("#nama_nasabah_edit").should("have.value", "");

    // Step 8: Klik button "Simpan Perubahan" tanpa mengisi Nama
    cy.get("#editReminder")
      .find("button[type='submit']")
      .contains(/simpan/i)
      .click({ force: true });

    // Step 9: Tunggu proses submit dan server response
    cy.wait(1500);

    // Step 10: Check error - bisa berupa alert-danger atau validasi HTML5
    cy.get("#nama_nasabah_edit").then(($input) => {
      const validationMessage = $input[0].validationMessage;

      if (validationMessage) {
        // Ada HTML5 validation
        cy.log(
          `✅ Validasi HTML5 - Field Nama Nasabah: "${validationMessage}"`
        );
      } else {
        // Cek alert error dari server
        cy.get(".alert-danger").should("be.visible");
        cy.get(".alert-danger").should("contain.text", "Nama");
        cy.log("✅ Validasi server-side - Field Nama wajib diisi");
      }
    });
  });
});
