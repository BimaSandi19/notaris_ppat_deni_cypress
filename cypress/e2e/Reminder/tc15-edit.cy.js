import {
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC15 Edit Tagihan", () => {
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
   * TEST CASE TC15
   * Module: PENGINGAT
   * Deskripsi: Admin dapat mengedit tagihan yang sudah ada melalui button edit di kolom aksi
   * Expected Result: Form edit tagihan terbuka dan perubahan data dapat disimpan
   */
  it("TC15 - Admin should be able to edit existing tagihan", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible dengan data
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 2: Generate nama baru untuk edit
    const updatedClientName = generateRandomClientName();

    // Step 3: Klik button edit (icon pensil biru) pada row pertama
    cy.get("table tbody tr")
      .first()
      .within(() => {
        // Cari button edit di kolom Aksi (biasanya button pertama/biru)
        cy.get("button.btn-primary, button[title*='Edit']")
          .first()
          .should("be.visible")
          .click();
      });

    // Step 4: Tunggu modal edit terbuka
    cy.wait(1500);

    // Step 5: Verify modal form edit terbuka dengan heading "Form Edit Tagihan"
    cy.get("#editReminder").should("be.visible");
    cy.contains("Form Edit Tagihan").should("be.visible");

    // Step 6: Update nama nasabah menggunakan ID yang tepat: nama_nasabah_edit
    cy.get("#nama_nasabah_edit")
      .should("be.visible")
      .clear()
      .type(updatedClientName, { delay: 50 });

    cy.wait(300);

    // Step 7: Klik button simpan perubahan
    cy.get("#editReminder")
      .find("button[type='submit']")
      .contains(/simpan|simpan perubahan/i)
      .should("be.visible")
      .click();

    // Step 8: Tunggu modal tertutup dan data ter-update di tabel
    cy.wait(2000);

    // Step 9: Verify modal sudah tertutup
    cy.get("#editReminder").should("not.be.visible");

    // Step 10: Verify tabel visible kembali
    cy.get("table tbody").should("be.visible");

    // Step 11: Verify nama di row pertama sudah berubah ke nama baru
    cy.get("table tbody tr").first().should("contain", updatedClientName);

    cy.log(`✅ Edit tagihan berhasil! Nama diubah ke: ${updatedClientName}`);
  });
});
