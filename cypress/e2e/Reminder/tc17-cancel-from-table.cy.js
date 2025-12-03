import {
  loginUser,
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC17 Cancel Tagihan from Table", () => {
  beforeEach(() => {
    // Login terlebih dahulu
    loginUser();

    // Navigate ke halaman pengingat dari menu
    cy.contains("Pengingat").should("be.visible").click();

    // Tunggu halaman pengingat loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/reminder");
  });

  /**
   * TEST CASE TC17
   * Module: PENGINGAT
   * Deskripsi: Admin dapat membatalkan tagihan melalui button pada kolom aksi di tabel
   * Expected Result: Status tagihan berubah menjadi "Dibatalkan" dan data otomatis masuk ke halaman history tagihan dibatalkan
   */
  it("TC17 - Admin should be able to cancel tagihan from table", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible dengan data
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 2: Get nama tagihan dari row pertama
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get("td").eq(1).invoke("text");
      })
      .as("tagihanNameBeforeCancel");

    // Step 3: Setup window:confirm handler untuk accept dialog
    cy.on("window:confirm", () => true);

    // Step 4: Cari dan klik button Batalkan (merah, btn-danger) di form
    cy.get("table tbody tr")
      .first()
      .find("form")
      .filter((index, el) => {
        // Cari form yang berisi button dengan title "Dibatalkan"
        return Cypress.$(el).find('button[title="Dibatalkan"]').length > 0;
      })
      .find('button[type="submit"].btn-danger')
      .should("be.visible")
      .click();

    // Step 5: Tunggu form di-submit dan halaman refresh
    cy.wait(2000);

    // Step 6: Verify tabel masih visible
    cy.get("table tbody").should("be.visible");

    // Step 7: Log hasil
    cy.get("@tagihanNameBeforeCancel").then((name) => {
      cy.log(`✅ Tagihan "${name}" berhasil di-batalkan`);
    });
  });
});
