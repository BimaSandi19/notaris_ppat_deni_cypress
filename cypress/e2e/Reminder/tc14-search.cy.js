import {
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC14 Search Tagihan", () => {
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
   * TEST CASE TC14
   * Module: PENGINGAT
   * Deskripsi: Admin dapat melakukan pencarian tagihan melalui search box
   * Expected Result: Tabel tagihan berhasil di-filter sesuai kata kunci pencarian
   */
  it("TC14 - Admin should be able to search tagihan using search box", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible
    cy.get("table").should("be.visible");

    // Step 2: Extract nama nasabah dari row pertama (table tbody tr first td eq 1)
    cy.get("table tbody tr")
      .first()
      .find("td")
      .eq(1)
      .invoke("text")
      .as("namaAsli");

    cy.get("@namaAsli").then((namaText) => {
      const searchKeyword = namaText.trim().substring(0, 5);
      cy.log(`📌 Search keyword: ${searchKeyword}`);

      // Step 3: Scroll ke search box
      cy.get("input[placeholder='Cari']").scrollIntoView();
      cy.wait(300);

      // Step 4: Click search box
      cy.get("input[placeholder='Cari']").should("be.visible").click();

      // Step 5: Clear existing text
      cy.get("input[placeholder='Cari']").clear();

      // Step 6: Type search keyword
      cy.get("input[placeholder='Cari']").type(searchKeyword, { delay: 100 });

      // Step 7: Tunggu search filter bekerja
      cy.wait(800);

      // Step 8: Verify tabel masih menampilkan data
      cy.get("table tbody tr").should("have.length.greaterThan", 0);

      // Step 9: Verify baris pertama mengandung keyword pencarian
      cy.get("table tbody tr").first().should("contain", searchKeyword);

      cy.log(
        `✅ Search berhasil! Menemukan data dengan keyword: ${searchKeyword}`
      );

      // Step 10: Clear search box dengan select all
      cy.get("input[placeholder='Cari']").should("be.visible");
      cy.get("input[placeholder='Cari']").clear();

      // Step 11: Tunggu tabel kembali ke kondisi awal
      cy.wait(800);

      // Step 12: Verify semua data kembali ditampilkan
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.log("✅ Search box di-clear dan data kembali normal");
    });
  });
});
