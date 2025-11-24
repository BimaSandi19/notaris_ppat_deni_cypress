import {
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC11 Add Tagihan via Pengingat Form", () => {
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
   * TEST CASE TC11
   * Module: PENGINGAT
   * Deskripsi: Admin dapat menambahkan tagihan baru dengan data random
   * Expected Result: Berhasil menampilkan modal tagihan baru dan masuk ke dalam tabel tagihan
   */
  it("TC11 - Admin should be able to add new reminder/tagihan", () => {
    // Generate random test data untuk setiap run
    const clientName = generateRandomClientName();
    const noKwitansi = generateRandomKwitansi();
    const nominal = generateRandomNominal(1000000, 50000000);
    const nominalFormatted = formatToIDR(nominal);
    const randomDay = generateRandomDay(1, 28);

    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Klik button "Tambah Tagihan"
    cy.get("button").contains("Tambah Tagihan").should("be.visible").click();

    // Step 2: Tunggu modal form terbuka dan animasi selesai
    cy.wait(1500);

    // Step 3: Verify modal "Form Tambah Tagihan" terbuka dengan h5 element
    cy.get("h5").contains("Form Tambah Tagihan").should("be.visible");

    // Step 4: Isi form dengan data random
    // Input Nama Nasabah (wajib)
    cy.get("input[id='nama_nasabah_create']")
      .should("be.visible")
      .clear()
      .type(clientName);

    // Input Nomor Kwitansi (wajib)
    cy.get("input[id='nomor_kwitansi_create']")
      .should("be.visible")
      .clear()
      .type(noKwitansi);

    // Input Nominal Tagihan (wajib)
    cy.get("input[id='nominal_tagihan_create']")
      .should("be.visible")
      .clear()
      .type(nominal.toString());

    // Input Tanggal Jatuh Tempo (wajib) - menggunakan Flatpickr date picker
    // Klik button calendar untuk buka date picker
    cy.get("button[data-target='#tanggal_tagihan_create']")
      .should("be.visible")
      .click();

    // Tunggu date picker terbuka dan calendar visible
    cy.wait(800);

    // Klik tanggal yang valid (hari ini atau mendatang - mulai dari tanggal 23+)
    // Coba klik tanggal 25, 26, 27, atau 28 (yang available)
    cy.get("span.flatpickr-day")
      .not(".prevMonthDay, .nextMonthDay, .disabled")
      .contains(/2[5-9]|3[0-1]/)
      .first()
      .should("be.visible")
      .click();

    // Step 5: Tunggu date picker tertutup
    cy.wait(500);

    // Step 6: Verify buttons visible
    cy.get("button").contains("Batal").should("be.visible");
    cy.get("button").contains("Tambah").should("be.visible");

    // Step 7: Klik button "Tambah" untuk submit form
    cy.get("button").contains("Tambah").should("be.visible").click();

    // Step 8: Tunggu tagihan ditambahkan ke tabel
    cy.wait(2000);

    // Step 9: Verify tagihan berhasil masuk ke tabel dengan data yang sama
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(clientName).should("be.visible");
        cy.contains(noKwitansi).should("be.visible");
      });

    // Optional: Log test data untuk reference
    cy.log(`Test Data - Client: ${clientName}`);
    cy.log(`Test Data - Kwitansi: ${noKwitansi}`);
  });
});
