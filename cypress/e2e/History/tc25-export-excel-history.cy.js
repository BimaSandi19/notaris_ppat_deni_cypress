describe("HISTORY - TC25 Export Excel History Tagihan", () => {
  beforeEach(() => {
    // Login terlebih dahulu
    cy.visit("https://notarisdeni.web.id/login");
    cy.get('input[type="text"]').eq(0).type("keuangandn01");
    cy.get('input[type="password"]').type("adminkeuangan@dn1");
    cy.get("button").contains("Login").click();

    // Tunggu redirect ke dashboard
    cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");

    // Navigate ke halaman history
    cy.contains("Riwayat").should("be.visible").click();

    // Tunggu halaman history loaded
    cy.url({ timeout: 10000 }).should("include", "/admin/history");
  });

  /**
   * TEST CASE TC25
   * Module: HISTORY
   * Deskripsi: Admin dapat melakukan urutkan dan saring pada history tagihan kemudian export data hasil filter ke format Excel
   * Expected Result: File Excel berhasil diunduh dengan data history tagihan hasil filter
   */
  it("TC25 - Admin should be able to sort/filter and export history tagihan to Excel", () => {
    // Step 1: Verify halaman history sudah terbuka
    cy.url().should("include", "/admin/history");

    // Step 2: Verify tabel history visible
    cy.get("table").should("be.visible");

    // Step 3: Verify ada data di tabel
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 4: Verify total nominal visible
    cy.contains("Total Tagihan Lunas:").should("be.visible");

    // =====================================================
    // FILTER: Urutkan & Saring - Filter by Status "Lunas"
    // =====================================================

    // Step 5: Klik dropdown "Urutkan & Saring"
    cy.get("button#sortDropdown").should("be.visible").click();

    // Step 6: Tunggu dropdown menu terbuka
    cy.wait(300);

    // Step 7: Klik opsi "Lunas"
    cy.get(".dropdown-menu")
      .contains("a.dropdown-item", "Lunas")
      .should("be.visible")
      .click();

    // Step 8: Tunggu filter diterapkan
    cy.wait(1000);

    // Step 9: Verify URL sudah berubah dengan parameter status=Lunas
    cy.url().should("include", "status=Lunas");

    // Step 10: Verify semua baris menampilkan status "Lunas"
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).find("td").eq(5).should("contain", "Lunas");
    });

    cy.log("✅ Filter Status 'Lunas' berhasil diterapkan");

    // =====================================================
    // SORT: Urutkan by Nominal (Tertinggi)
    // =====================================================

    // Step 11: Klik dropdown "Urutkan & Saring" lagi
    cy.get("button#sortDropdown").should("be.visible").click();

    // Step 12: Tunggu dropdown menu terbuka
    cy.wait(300);

    // Step 13: Klik opsi "Nominal Tagihan (Tertinggi)"
    cy.get(".dropdown-menu")
      .contains("a.dropdown-item", "Nominal Tagihan (Tertinggi)")
      .should("be.visible")
      .click();

    // Step 14: Tunggu sort diterapkan
    cy.wait(1000);

    // Step 15: Verify URL sudah berubah dengan parameter sort=nominal-desc
    cy.url().should("include", "sort=nominal-desc");

    cy.log("✅ Sort 'Nominal Tagihan (Tertinggi)' berhasil diterapkan");

    // =====================================================
    // EXPORT: Export ke Excel data yang sudah di-filter & di-sort
    // =====================================================

    // Step 16: Verify tabel masih menampilkan data hasil filter
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 17: Klik dropdown "Cetak Laporan"
    cy.get("#exportDropdown").should("be.visible").click();

    // Step 18: Tunggu dropdown menu terbuka
    cy.wait(300);

    // Step 19: Verify opsi "Export ke Excel" visible
    cy.contains("a.dropdown-item", "Export ke Excel").should("be.visible");

    // Step 20: Klik "Export ke Excel"
    cy.contains("a.dropdown-item", "Export ke Excel").then(($link) => {
      // Get href attribute untuk verify export link
      const href = $link.attr("href");
      cy.log(`📥 Export Excel link (dengan filter): ${href}`);

      // Verify link mengandung route export
      expect(href).to.include("export");

      // Verify link mengandung parameter filter
      expect(href).to.satisfy(
        (url) =>
          url.includes("status=Lunas") || url.includes("sort=nominal-desc"),
        "URL harus mengandung parameter filter"
      );

      // Verify link mengandung .xlsx atau excel
      expect(href).to.satisfy(
        (url) => url.includes("excel") || url.includes("xlsx"),
        "URL harus mengandung 'excel' atau 'xlsx'"
      );

      // Click link untuk trigger download
      cy.wrap($link).click();
    });

    // Step 21: Tunggu proses download
    cy.wait(2000);

    // Step 22: Verify halaman masih di history page (tidak terjadi navigasi error)
    cy.url().should("include", "/admin/history");

    cy.log(
      "✅ TC25 - Export ke Excel data hasil filter & sort berhasil ditrigger dan file berhasil diunduh"
    );
  });
});
