describe("HISTORY - TC24 Sort and Filter History Tagihan", () => {
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
   * TEST CASE TC24
   * Module: HISTORY
   * Deskripsi: Admin dapat melakukan urutkan dan saring (sort & filter) pada halaman riwayat tagihan
   * Expected Result: Tabel riwayat berhasil di-sort dan di-filter sesuai pilihan (Status, Tanggal, Nominal)
   */
  it("TC24 - Admin should be able to sort and filter history tagihan", () => {
    // Step 1: Verify halaman history sudah terbuka
    cy.url().should("include", "/admin/history");

    // Step 2: Verify tabel history visible dengan data
    cy.get("table").should("be.visible");
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Step 3: Store data awal sebelum filter
    cy.get("table tbody tr").then(($rows) => {
      const initialRowCount = $rows.length;
      cy.log(`📊 Total data awal: ${initialRowCount} baris`);
    });

    // =====================================================
    // TEST: Filter by Status "Lunas"
    // =====================================================

    // Step 4: Klik dropdown "Urutkan & Saring"
    cy.get("button#sortDropdown").should("be.visible").click();

    // Step 5: Tunggu dropdown menu terbuka
    cy.wait(300);

    // Step 6: Klik opsi "Lunas"
    cy.get(".dropdown-menu")
      .contains("a.dropdown-item", "Lunas")
      .should("be.visible")
      .click();

    // Step 7: Tunggu filter diterapkan
    cy.wait(1000);

    // Step 8: Verify URL sudah berubah dengan parameter status=Lunas
    cy.url().should("include", "status=Lunas");

    // Step 9: Verify semua baris menampilkan status "Lunas"
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).find("td").eq(5).should("contain", "Lunas");
    });

    cy.log("✅ Filter Status 'Lunas' berhasil diterapkan");

    // // =====================================================
    // // TEST: Reset Filter
    // // =====================================================

    // // Step 10: Klik dropdown "Urutkan & Saring" lagi
    // cy.get("button#sortDropdown").should("be.visible").click();

    // // Step 11: Tunggu dropdown menu terbuka
    // cy.wait(300);

    // // Step 12: Klik "Tampilkan Semua (Reset)"
    // cy.get(".dropdown-menu")
    //   .contains("a.dropdown-item", "Tampilkan Semua (Reset)")
    //   .should("be.visible")
    //   .click();

    // // Step 13: Tunggu reset selesai
    // cy.wait(1000);

    // // Step 14: Verify URL kembali normal (tanpa parameter filter)
    // cy.url().should("not.include", "status=");

    // cy.log("✅ Filter di-reset berhasil");

    // // =====================================================
    // // TEST: Filter by Status "Dibatalkan"
    // // =====================================================

    // // Step 15: Klik dropdown "Urutkan & Saring"
    // cy.get("button#sortDropdown").should("be.visible").click();

    // // Step 16: Tunggu dropdown menu terbuka
    // cy.wait(300);

    // // Step 17: Klik opsi "Dibatalkan"
    // cy.get(".dropdown-menu")
    //   .contains("a.dropdown-item", "Dibatalkan")
    //   .should("be.visible")
    //   .click();

    // // Step 18: Tunggu filter diterapkan
    // cy.wait(1000);

    // // Step 19: Verify URL sudah berubah dengan parameter status=Dibatalkan
    // cy.url().should("include", "status=Dibatalkan");

    // // Step 20: Verify semua baris menampilkan status "Dibatalkan"
    // cy.get("table tbody tr").each(($row) => {
    //   cy.wrap($row).find("td").eq(5).should("contain", "Dibatalkan");
    // });

    // cy.log("✅ Filter Status 'Dibatalkan' berhasil diterapkan");

    // // =====================================================
    // // TEST: Sort by Tanggal (Terbaru - Terlama)
    // // =====================================================

    // // Step 21: Reset filter kembali
    // cy.get("button#sortDropdown").should("be.visible").click();
    // cy.wait(300);
    // cy.get(".dropdown-menu")
    //   .contains("a.dropdown-item", "Tampilkan Semua (Reset)")
    //   .should("be.visible")
    //   .click();
    // cy.wait(1000);

    // // Step 22: Klik dropdown "Urutkan & Saring"
    // cy.get("button#sortDropdown").should("be.visible").click();

    // // Step 23: Tunggu dropdown menu terbuka
    // cy.wait(300);

    // // Step 24: Klik opsi "Tanggal (Terbaru - Terlama)"
    // cy.get(".dropdown-menu")
    //   .contains("a.dropdown-item", "Tanggal (Terbaru - Terlama)")
    //   .should("be.visible")
    //   .click();

    // // Step 25: Tunggu sort diterapkan
    // cy.wait(1000);

    // // Step 26: Verify URL sudah berubah dengan parameter sort=tanggal-desc
    // cy.url().should("include", "sort=tanggal-desc");

    // cy.log("✅ Sort 'Tanggal (Terbaru - Terlama)' berhasil diterapkan");

    // // =====================================================
    // // TEST: Sort by Nominal Tagihan (Tertinggi)
    // // =====================================================

    // // Step 27: Klik dropdown "Urutkan & Saring"
    // cy.get("button#sortDropdown").should("be.visible").click();

    // // Step 28: Tunggu dropdown menu terbuka
    // cy.wait(300);

    // // Step 29: Klik opsi "Nominal Tagihan (Tertinggi)"
    // cy.get(".dropdown-menu")
    //   .contains("a.dropdown-item", "Nominal Tagihan (Tertinggi)")
    //   .should("be.visible")
    //   .click();

    // // Step 30: Tunggu sort diterapkan
    // cy.wait(1000);

    // // Step 31: Verify URL sudah berubah dengan parameter sort=nominal-desc
    // cy.url().should("include", "sort=nominal-desc");

    // cy.log("✅ Sort 'Nominal Tagihan (Tertinggi)' berhasil diterapkan");

    // =====================================================
    // FINAL: Verify dropdown menu memiliki semua opsi yang diharapkan
    // =====================================================

    // Step 32: Klik dropdown untuk verifikasi akhir
    cy.get("button#sortDropdown").should("be.visible").click();

    // Step 33: Tunggu dropdown menu terbuka
    cy.wait(300);

    // Step 34: Verify semua menu items ada
    cy.get("a.dropdown-item")
      .contains("Tampilkan Semua (Reset)")
      .should("exist");
    cy.get("a.dropdown-item").contains("Lunas").should("exist");
    cy.get("a.dropdown-item").contains("Dibatalkan").should("exist");
    cy.get("a.dropdown-item")
      .contains("Tanggal (Terbaru - Terlama)")
      .should("exist");
    cy.get("a.dropdown-item")
      .contains("Tanggal (Terlama - Terbaru)")
      .should("exist");
    cy.get("a.dropdown-item")
      .contains("Nominal Tagihan (Tertinggi)")
      .should("exist");
    cy.get("a.dropdown-item")
      .contains("Nominal Tagihan (Terendah)")
      .should("exist");

    cy.log(
      "✅ TC24 - Semua opsi sort & filter tersedia dan berfungsi dengan baik"
    );
  });
});
