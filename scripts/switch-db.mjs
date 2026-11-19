#!/usr/bin/env node
/**
 * Mengganti target database antara SQLite dan MySQL.
 *
 * Prisma menetapkan `provider` langsung di schema, bukan lewat env, jadi
 * perpindahan butuh dua perubahan yang harus selalu bersama:
 *   1. provider di prisma/schema.prisma
 *   2. DATABASE_URL di .env
 * Skrip ini menjaga keduanya tidak pernah berbeda.
 *
 * Pakai:
 *   npm run db:use-mysql     # pindah ke MySQL (XAMPP/phpMyAdmin)
 *   npm run db:use-sqlite    # kembali ke SQLite lokal
 *
 * Setelah berpindah, jalankan: npm run db:migrate && npm run db:seed
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(root, "prisma", "schema.prisma");
const envPath = join(root, ".env");

const TARGETS = {
  mysql: {
    provider: "mysql",
    url: "mysql://root:@127.0.0.1:3306/selasarspace",
    label: "MySQL (XAMPP / phpMyAdmin)",
  },
  sqlite: {
    provider: "sqlite",
    url: "file:./prisma/dev.db",
    label: "SQLite lokal",
  },
};

const target = process.argv[2];
if (!target || !TARGETS[target]) {
  console.error("Pakai: node scripts/switch-db.mjs <mysql|sqlite>");
  process.exit(1);
}

const config = TARGETS[target];

// --- schema.prisma ---------------------------------------------------------
let schema = readFileSync(schemaPath, "utf8");
const providerPattern = /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"(sqlite|mysql|postgresql)"/;
if (!providerPattern.test(schema)) {
  console.error("Tidak menemukan blok datasource di prisma/schema.prisma");
  process.exit(1);
}
schema = schema.replace(providerPattern, `$1"${config.provider}"`);
writeFileSync(schemaPath, schema, "utf8");

// --- .env ------------------------------------------------------------------
if (!existsSync(envPath)) {
  console.error(".env belum ada. Salin .env.example menjadi .env lebih dulu.");
  process.exit(1);
}

let env = readFileSync(envPath, "utf8");
if (/^DATABASE_URL=.*$/m.test(env)) {
  env = env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${config.url}"`);
} else {
  env += `\nDATABASE_URL="${config.url}"\n`;
}
writeFileSync(envPath, env, "utf8");

console.log(`Target database: ${config.label}`);
console.log(`  provider : ${config.provider}`);
console.log(`  URL      : ${config.url}`);
console.log("");
console.log("Langkah berikutnya:");
console.log("  npm run db:generate");
console.log("  npm run db:migrate");
console.log("  npm run db:seed");
