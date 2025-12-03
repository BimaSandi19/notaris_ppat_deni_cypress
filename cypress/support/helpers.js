/**
 * Helper functions untuk Cypress tests
 */

/**
 * Login dengan credentials dari environment variables
 * @param {string} username - optional: override username dari env
 * @param {string} password - optional: override password dari env
 */
export const loginUser = (username = null, password = null) => {
  const user = username || Cypress.env("TEST_USERNAME");
  const pass = password || Cypress.env("TEST_PASSWORD");

  cy.visit("https://notarisdeni.web.id/login");
  cy.get('input[type="text"]').eq(0).type(user);
  cy.get('input[type="password"]').type(pass);
  cy.get("button").contains("Login").click();

  // Tunggu redirect ke dashboard
  cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");
};

/**
 * Generate random string dengan prefix
 * @param {string} prefix - prefix untuk string
 * @param {number} length - panjang random part
 * @returns {string}
 */
export const generateRandomString = (prefix = "", length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random nomor kwitansi dengan format KW + timestamp + random
 * @returns {string} - format: KW20251121XXXXX
 */
export const generateRandomKwitansi = () => {
  const date = new Date();
  const dateStr = date
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "");
  const randomPart = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `KW${dateStr}${randomPart}`;
};

/**
 * Generate random client name
 * @returns {string}
 */
export const generateRandomClientName = () => {
  const firstNames = [
    "PT",
    "CV",
    "UD",
    "Perusahaan",
    "Toko",
    "Bengkel",
    "Klinik",
  ];
  const lastNames = [
    "Jaya",
    "Maju",
    "Sukses",
    "Sentosa",
    "Abadi",
    "Makmur",
    "Sejahtera",
  ];
  const types = [
    "Elektronik",
    "Furniture",
    "Fashion",
    "Otomotif",
    "Kesehatan",
    "Properti",
    "Teknologi",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const type = types[Math.floor(Math.random() * types.length)];

  return `${firstName} ${lastName} ${type}`;
};

/**
 * Generate random nominal dengan range
 * @param {number} min - nilai minimum
 * @param {number} max - nilai maximum
 * @returns {number}
 */
export const generateRandomNominal = (min = 1000000, max = 99999999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Format nominal to IDR currency format
 * @param {number} nominal - nominal value
 * @returns {string} - format: Rp. X.XXX.XXX
 */
export const formatToIDR = (nominal) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(nominal);
};

/**
 * Generate random date between range
 * @param {Date} start - start date
 * @param {Date} end - end date
 * @returns {number} - day of month (1-28)
 */
export const generateRandomDay = (start = 1, end = 28) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};
