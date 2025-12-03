import { loginUser } from "../../support/helpers";

describe("HISTORY - TC22 Search History Tagihan", () => {
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
   * TEST CASE TC22
   * Module: HISTORY
   * Deskripsi: Admin dapat melakukan pencarian pada halaman history riwayat tagihan
   * Expected Result: Tabel history berhasil di-filter sesuai kata kunci pencarian
   */
  it("TC22 - Admin should be able to search history tagihan", () => {
    // Step 1: Verify halaman history sudah terbuka
    cy.url().should("include", "/admin/history");

    // Step 2: Verify tabel history visible
    cy.get("table").should("be.visible");

    // Step 3: Get nama nasabah dari row pertama untuk search keyword
    cy.get("table tbody tr")
      .first()
      .find("td")
      .eq(1)
      .invoke("text")
      .as("namaNasabahOriginal");

    // Step 4: Extract search keyword dari nama nasabah
    cy.get("@namaNasabahOriginal").then((namaText) => {
      const searchKeyword = namaText.trim().substring(0, 5);
      cy.log(`📌 Search keyword: ${searchKeyword}`);

      // Step 5: Locate dan isi search input
      cy.get("#searchInput")
        .should("be.visible")
        .click()
        .clear()
        .type(searchKeyword, { delay: 100 });

      // Step 6: Submit form search dengan click tombol search
      cy.get("button[aria-label='Cari']").click();

      // Step 7: Tunggu search filter bekerja
      cy.wait(1000);

      // Step 8: Verify tabel masih menampilkan data
      cy.get("table tbody tr").should("have.length.greaterThan", 0);

      // Step 9: Verify baris pertama mengandung keyword pencarian
      cy.get("table tbody tr").first().should("contain", searchKeyword);

      cy.log(
        `✅ Search berhasil - data dengan keyword "${searchKeyword}" ditampilkan`
      );

      // Step 10: Clear search box dengan click tombol close (X)
      cy.get("a[title='Hapus pencarian']").click();

      // Step 11: Tunggu data kembali normal
      cy.wait(1000);

      // Step 12: Verify tabel kembali menampilkan semua data
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.log("✅ Search box di-clear dan data kembali normal");
    });
  });
});
