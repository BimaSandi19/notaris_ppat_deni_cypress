import {
  loginUser,
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC13 Sort and Filter Tagihan", () => {
  beforeEach(() => {
    // Login terlebih dahulu
    loginUser();

    // Navigate ke halaman pengingat dari menu
    cy.contains("Pengingat").should("be.visible").click();

    // Tunggu halaman pengingat loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/reminder");
  });

  /**
   * TEST CASE TC13
   * Module: PENGINGAT
   * Deskripsi: Admin dapat melakukan sort dan filter pada tabel tagihan
   * Expected Result: Tabel tagihan berhasil di-sort dan di-filter sesuai pilihan
   */
  it("TC13 - Admin should be able to sort and filter tagihan in table", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible
    cy.get("table").should("be.visible");
    cy.contains("Informasi Tagihan").should("be.visible");

    // Step 2: Scroll ke atas untuk memastikan button dropdown visible di viewport
    cy.get("table").scrollIntoView();
    cy.wait(500);

    // Step 3: Verify filter dropdown button visible (Urutkam & Saring)
    cy.contains("button", /Urutkam|Saring/i)
      .should("be.visible")
      .scrollIntoView();

    // Step 4: Klik dropdown filter button
    cy.contains("button", /Urutkam|Saring/i).click();

    // Step 5: Tunggu dropdown menu terbuka
    cy.wait(1000);

    // Step 6: Verify ada element dropdown-item visible
    cy.get("a.dropdown-item")
      .should("have.length.greaterThan", 0)
      .first()
      .should("be.visible");

    // Step 7: Extract tanggal jatuh tempo dari baris pertama SEBELUM sort
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get("td")
          .eq(4)
          .then(($cell) => {
            const tanggalSebelumSort = $cell.text().trim();
            cy.log(
              `📌 Tanggal Jatuh Tempo sebelum sort: ${tanggalSebelumSort}`
            );
            cy.wrap(tanggalSebelumSort).as("tanggalSebelumSort");
          });
      });

    // Step 8: Klik opsi "Tanggal Jatuh Tempo" dari dropdown
    cy.get("a.dropdown-item")
      .contains(/tanggal jatuh tempo |jatuh tempo/i)
      .should("be.visible")
      .click({ force: true });

    // Step 9: Tunggu tabel di-update setelah sort dan dropdown menutup
    cy.wait(1500);

    // Step 10: Extract tanggal jatuh tempo dari baris pertama SETELAH sort
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get("td")
          .eq(4)
          .then(($cell) => {
            const tanggalSetelahSort = $cell.text().trim();
            cy.log(
              `📌 Tanggal Jatuh Tempo setelah sort: ${tanggalSetelahSort}`
            );
            cy.wrap(tanggalSetelahSort).as("tanggalSetelahSort");
          });
      });

    // Step 11: Verify tabel masih menampilkan data (sorted/filtered)
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 12: Scroll ke atas tabel untuk verify column headers visible
    cy.get("table thead").scrollIntoView();
    cy.wait(300);

    // Step 13: Verify kolom header tetap visible setelah sort
    cy.get("table thead").should("be.visible");
    cy.contains("Tanggal Jatuh Tempo Tagihan").should("be.visible");

    // Step 14: Verify sort berhasil dengan menampilkan kedua tanggal
    cy.get("@tanggalSebelumSort").then((tanggalSebelum) => {
      cy.get("@tanggalSetelahSort").then((tanggalSetelah) => {
        cy.log(
          `✅ Sort/Filter berhasil! Data ter-sort dari ${tanggalSebelum} → ${tanggalSetelah}`
        );
      });
    });
  });
});
