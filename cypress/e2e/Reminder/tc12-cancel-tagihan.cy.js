describe("REMINDER - TC12 Cancel Tagihan via Pengingat Form", () => {
  beforeEach(() => {
    // Login terlebih dahulu sebelum mengakses halaman pengingat
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
   * TEST CASE TC12
   * Module: PENGINGAT
   * Deskripsi: Admin dapat membatalkan penambahan tagihan baru
   * Expected Result: Tagihan baru tidak ditambahkan ke dalam tabel tagihan
   */
  it("TC12 - Admin should be able to cancel adding new reminder/tagihan", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Klik button "Tambah Tagihan"
    cy.get("button").contains("Tambah Tagihan").should("be.visible").click();

    // Step 2: Tunggu modal form terbuka dan animasi selesai
    cy.wait(1500);

    // Step 3: Verify modal "Form Tambah Tagihan" terbuka dengan h5 element
    cy.get("h5").contains("Form Tambah Tagihan").should("be.visible");

    // Step 4: Isi form dengan data dummy
    // Input Nama Nasabah (wajib)
    cy.get("input[id='nama_nasabah_create']")
      .should("be.visible")
      .clear()
      .type("Cancel Test Client");

    // Input Nomor Kwitansi (wajib)
    cy.get("input[id='nomor_kwitansi_create']")
      .should("be.visible")
      .clear()
      .type("KW20251122000");

    // Input Nominal Tagihan (wajib)
    cy.get("input[id='nominal_tagihan_create']")
      .should("be.visible")
      .clear()
      .type("3000000");

    // Input Tanggal Jatuh Tempo (wajib) - menggunakan Flatpickr date picker
    // Klik button calendar untuk buka date picker
    cy.get("button[data-target='#tanggal_tagihan_create']")
      .should("be.visible")
      .click();

    // Tunggu date picker terbuka dan calendar visible
    cy.wait(800);

    // Klik tanggal 28 di calendar Flatpickr
    cy.get("span.flatpickr-day").contains("28").should("be.visible").click();

    // Step 5: Tunggu date picker tertutup
    cy.wait(500);

    // Step 6: Verify buttons visible
    cy.get("button").contains("Batal").should("be.visible");
    cy.get("button").contains("Tambah").should("be.visible");

    // Step 7: Klik button "Batal" untuk cancel form (tidak submit)
    cy.get("button").contains("Batal").should("be.visible").click();

    // Step 8: Tunggu modal tertutup
    cy.wait(1000);

    // Step 9: Verify tagihan tidak masuk ke tabel (tidak ada data "Cancel Test Client")
    cy.get("table tbody").within(() => {
      cy.contains("Cancel Test Client").should("not.exist");
    });
  });
});
