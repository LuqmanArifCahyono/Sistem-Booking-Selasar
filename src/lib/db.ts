/**
 * Klien Prisma tunggal untuk seluruh aplikasi.
 *
 * Prisma 7 mewajibkan driver adapter. Adapter dipilih otomatis dari bentuk
 * DATABASE_URL, jadi pindah dari SQLite lokal ke Supabase Postgres cukup
 * mengganti satu baris di .env — tidak ada kode yang berubah.
 */

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildClient(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL belum di-set. Salin .env.example menjadi .env lalu jalankan npm run db:migrate.",
    );
  }

  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  }

  if (url.startsWith("mysql://") || url.startsWith("mariadb://")) {
    return new PrismaClient({ adapter: new PrismaMariaDb(url) });
  }

  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

export const prisma = globalForPrisma.prisma ?? buildClient();

// Cegah kebocoran koneksi saat hot reload di mode development.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
