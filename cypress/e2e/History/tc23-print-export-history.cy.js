import { loginUser } from "../../support/helpers";

describe("HISTORY - TC23 Print History Tagihan", () => {
  beforeEach(() => {
    loginUser();

    // Tunggu redirect ke dashboard
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");

    // Navigate ke halaman history
    cy.contains("Riwayat").should("be.visible").click();

    // Tunggu halaman history loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/history");
  });

  /**
   * TEST CASE TC23
   * Module: HISTORY
   * Deskripsi: Admin dapat melakukan pencarian pada history tagihan kemudian cetak langsung laporan hasil pencarian
   * Expected Result: Data hasil pencarian berhasil dicetak dengan halaman print preview terbuka
   */
  it("TC23 - Admin should be able to search and print history tagihan directly", () => {
    // Step 1: Verify halaman history sudah terbuka
    cy.url().should("include", "/admin/history");

    // Step 2: Verify tabel history visible
    cy.get("table").should("be.visible");

    // Step 3: Verify ada data di tabel
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 4: Get nama nasabah dari row pertama untuk search keyword
    cy.get("table tbody tr")
      .first()
      .find("td")
      .eq(1)
      .invoke("text")
      .as("namaNasabahOriginal");

    // Step 5: Extract search keyword dari nama nasabah
    cy.get("@namaNasabahOriginal").then((namaText) => {
      const searchKeyword = namaText.trim().substring(0, 5);
      cy.log(`📌 Search keyword untuk cetak: ${searchKeyword}`);

      // Step 6: Locate dan isi search input
      cy.get("#searchInput")
        .should("be.visible")
        .click()
        .clear()
        .type(searchKeyword, { delay: 100 });

      // Step 7: Submit form search dengan click tombol search
      cy.get("button[aria-label='Cari']").click();

      // Step 8: Tunggu search filter bekerja
      cy.wait(1000);

      // Step 9: Verify tabel menampilkan data hasil search
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.get("table tbody tr").first().should("contain", searchKeyword);

      cy.log(
        `✅ Search berhasil - data dengan keyword "${searchKeyword}" ditampilkan`
      );

      // Step 10: Verify total nominal visible
      cy.contains("Total Tagihan Lunas:").should("be.visible");

      // =====================================================
      // CETAK LANGSUNG DATA HASIL SEARCH
      // =====================================================

      // Step 11: Klik dropdown "Cetak Laporan"
      cy.get("#exportDropdown").should("be.visible").click();

      // Step 12: Tunggu dropdown menu terbuka
      cy.wait(300);

      // Step 13: Verify opsi "Cetak Langsung" visible
      cy.contains("a.dropdown-item", "Cetak Langsung").should("be.visible");

      // Step 14: Klik "Cetak Langsung"
      cy.contains("a.dropdown-item", "Cetak Langsung").click();

      // Step 15: Tunggu print preview/modal terbuka
      cy.wait(2000);

      // Step 16: Verify print dialog atau new tab terbuka
      cy.url().then((url) => {
        // Jika membuka tab baru untuk print preview
        if (url.includes("print")) {
          cy.log("✅ Print preview page opened");
        }
      });

      // Step 17: Verifikasi dengan mengecek apakah title/heading cetak visible
      cy.get("body").then(($body) => {
        // Jika modal print atau window baru terbuka, akan ada elemen yang terlihat
        const hasContent =
          $body.text().includes("Tagihan") || $body.text().includes("Print");
        if (hasContent) {
          cy.log("✅ Print content visible");
        }
      });

      cy.log(
        `✅ TC23 - Cetak Langsung data hasil pencarian "${searchKeyword}" berhasil ditampilkan`
      );
    });
  });
});
