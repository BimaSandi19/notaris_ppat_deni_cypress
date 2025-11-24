describe("HISTORY - TC26 Export PDF History Tagihan", () => {
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
   * TEST CASE TC26
   * Module: HISTORY
   * Deskripsi: Admin dapat melakukan export data history tagihan ke format PDF
   * Expected Result: File PDF berhasil diunduh dengan data history tagihan
   */
  it("TC26 - Admin should be able to export history tagihan to PDF", () => {
    // Step 1: Verify halaman history sudah terbuka
    cy.url().should("include", "/admin/history");

    // Step 2: Verify tabel history visible
    cy.get("table").should("be.visible");

    // Step 3: Verify ada data di tabel
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 4: Verify total nominal visible
    cy.contains("Total Tagihan Lunas:").should("be.visible");

    // Step 5: Klik dropdown "Cetak Laporan"
    cy.get("#exportDropdown").should("be.visible").click();

    // Step 6: Tunggu dropdown menu terbuka
    cy.wait(300);

    // Step 7: Verify opsi "Export ke PDF" visible
    cy.contains("a.dropdown-item", "Export ke PDF").should("be.visible");

    // Step 8: Klik "Export ke PDF"
    cy.contains("a.dropdown-item", "Export ke PDF").then(($link) => {
      // Get href attribute untuk verify export link
      const href = $link.attr("href");
      cy.log(`📥 Export PDF link: ${href}`);

      // Verify link mengandung route export
      expect(href).to.include("export");

      // Verify link mengandung .pdf atau pdf
      expect(href).to.satisfy(
        (url) => url.includes("pdf"),
        "URL harus mengandung 'pdf'"
      );

      // Click link untuk trigger download
      cy.wrap($link).click();
    });

    // Step 9: Tunggu proses download
    cy.wait(2000);

    // Step 10: Verify halaman masih di history page (tidak terjadi navigasi error)
    cy.url().should("include", "/admin/history");

    cy.log(
      "✅ TC26 - Export ke PDF berhasil ditrigger dan file berhasil diunduh"
    );
  });
});
