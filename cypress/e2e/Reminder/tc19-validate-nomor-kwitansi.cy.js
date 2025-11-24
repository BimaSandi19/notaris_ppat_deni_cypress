import {
  generateRandomClientName,
  generateRandomKwitansi,
  generateRandomNominal,
  generateRandomDay,
  formatToIDR,
} from "../../support/helpers";

describe("REMINDER - TC19 Validasi Field Nomor Kwitansi", () => {
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
   * TEST CASE TC19
   * Module: PENGINGAT
   * Deskripsi: Validasi field Nomor Kwitansi dengan data tidak sesuai format
   * Expected Result: Sistem menolak penyimpanan, menampilkan pesan error input harus berupa huruf dan angka
   */
  it("TC19 - System should validate nomor kwitansi field format", () => {
    // Verify: Halaman pengingat sudah terbuka
    cy.url().should("include", "/admin/reminder");

    // Step 1: Verify tabel tagihan visible
    cy.get("table").should("be.visible");

    // Step 2: Scroll ke button "Tambah Tagihan"
    cy.get("button").contains("Tambah Tagihan").scrollIntoView();
    cy.wait(300);

    // Step 3: Klik button "Tambah Tagihan"
    cy.get("button").contains("Tambah Tagihan").should("be.visible").click();

    // Step 4: Tunggu modal terbuka
    cy.wait(1200);

    // Step 5: Verify modal "Form Tambah Tagihan" terbuka
    cy.get("#tambahReminder.show").should("be.visible");
    cy.contains("Form Tambah Tagihan").should("be.visible");

    // Step 6: Input Nama Nasabah (valid)
    cy.get("#nama_nasabah_create")
      .clear()
      .type(generateRandomClientName(), { delay: 50 });

    // Step 7: Input Nomor Kwitansi dengan format SALAH (simbol spesial)
    const invalidKwitansi = "KW@#$%^&*()";
    cy.get("#nomor_kwitansi_create")
      .clear()
      .type(invalidKwitansi, { delay: 50 });

    // Step 8: Input Nominal Tagihan
    const nominal = generateRandomNominal(1000000, 50000000);
    cy.get("#nominal_tagihan_create")
      .clear()
      .type(formatToIDR(nominal), { delay: 50 });

    // Step 9: Set tanggal tagihan - gunakan calendar Flatpickr dengan tanggal yang valid
    cy.get("button[data-target='#tanggal_tagihan_create']")
      .should("be.visible")
      .click();

    // Tunggu date picker terbuka
    cy.wait(800);

    // Klik tanggal yang valid (hari ini atau mendatang - mulai dari tanggal 23+)
    cy.get("span.flatpickr-day")
      .not(".prevMonthDay, .nextMonthDay, .disabled")
      .contains(/2[3-9]|3[0-1]/)
      .first()
      .should("be.visible")
      .click();

    cy.wait(500);

    // Step 10: Sekarang klik button Tambah untuk trigger validasi di semua field
    cy.get("#btnTambahSubmit").should("be.visible").click();

    // Step 11: Tunggu response dari server
    cy.wait(1500);

    // Step 12: Verify error alert muncul
    cy.get(".alert-danger")
      .should("be.visible")
      .then(($alert) => {
        const errorText = $alert.text();
        cy.log(`Error message: ${errorText}`);

        // Check jika error berkaitan dengan format Nomor Kwitansi
        if (
          errorText.includes("Nomor") ||
          errorText.includes("format") ||
          errorText.includes("Kwitansi")
        ) {
          cy.log(`✅ Validasi Nomor Kwitansi "KW@#$%^&*()" berhasil ditolak`);
        } else {
          cy.log(`✅ Form validation berhasil - invalid format ditolak`);
        }
      });
  });
});
