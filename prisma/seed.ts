/**
 * Seed SelasarSpace — data awal untuk pengembangan lokal.
 *
 * Jalankan: npm run db:seed   (atau npm run db:reset untuk mulai dari nol)
 *
 * Dua hal yang sengaja dibuat eksplisit di sini:
 * 1. Daftar organisasi masih PROVISIONAL. Ganti isi ORGANIZATIONS begitu
 *    daftar resmi himpunan FIK & FISIP sudah ditetapkan.
 * 2. Semua akun admin dibuat dengan sandi yang mudah ditebak (sesuai permintaan),
 *    jadi mustChangePassword = true: wajib ganti sandi saat login pertama.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

const SALT_ROUNDS = 10;

interface SeedOrganization {
  name: string;
  slug: string;
  shortName: string;
  faculty: "FIK" | "FISIP";
  studyProgram: string | null;
  colorHex: string;
  /** Kode untuk pola email/sandi akun admin. */
  accountCode: string;
}

// PROVISIONAL — menunggu daftar resmi dari pemilik produk.
const ORGANIZATIONS: SeedOrganization[] = [
  {
    name: "Himasifo",
    slug: "himasifo",
    shortName: "Himasifo",
    faculty: "FIK",
    studyProgram: "Sistem Informasi",
    colorHex: "#2563EB",
    accountCode: "asifo",
  },
  {
    name: "Himatifa",
    slug: "himatifa",
    shortName: "Himatifa",
    faculty: "FIK",
    studyProgram: "Informatika",
    colorHex: "#7C3AED",
    accountCode: "atifa",
  },
  {
    name: "Himakom",
    slug: "himakom",
    shortName: "Himakom",
    faculty: "FIK",
    studyProgram: "Ilmu Komputer",
    colorHex: "#059669",
    accountCode: "akom",
  },
  {
    name: "BEM FISIP",
    slug: "bem-fisip",
    shortName: "BEM FISIP",
    faculty: "FISIP",
    studyProgram: null,
    colorHex: "#DB2777",
    accountCode: "fisip",
  },
  {
    name: "Hima Bisnis Digital",
    slug: "hima-bisnis-digital",
    shortName: "Himabisdig",
    faculty: "FISIP",
    studyProgram: "Bisnis Digital",
    colorHex: "#D97706",
    accountCode: "bisdig",
  },
  {
    name: "Hima Administrasi Publik",
    slug: "hima-administrasi-publik",
    shortName: "Himaadpub",
    faculty: "FISIP",
    studyProgram: "Administrasi Publik",
    colorHex: "#0891B2",
    accountCode: "adpub",
  },
];

const SUPER_ADMIN = {
  email: "superadmin@selasarspace.id",
  name: "Super Admin SelasarSpace",
  password: "superadmin2026",
};

const POSITION_ACCOUNTS = [
  { position: "KETUA", prefix: "kahim", label: "Ketua Himpunan" },
  { position: "SEKRETARIS", prefix: "sekre", label: "Sekretaris" },
  { position: "BENDAHARA", prefix: "bendahara", label: "Bendahara" },
] as const;

/** Tanggal ISO lokal (bukan UTC) supaya tidak bergeser satu hari. */
function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function main() {
  console.log("Membersihkan data lama...");
  await prisma.auditLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slotLock.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.room.deleteMany();

  // -------------------------------------------------------------------------
  // Ruang: satu selasar sesuai keputusan produk
  // -------------------------------------------------------------------------
  const room = await prisma.room.create({
    data: {
      name: "Selasar Utama",
      slug: "selasar-utama",
      openTime: "08:00",
      closeTime: "21:00",
    },
  });
  console.log(`Ruang dibuat: ${room.name} (${room.openTime}-${room.closeTime})`);

  // -------------------------------------------------------------------------
  // Super admin
  // -------------------------------------------------------------------------
  const superAdmin = await prisma.user.create({
    data: {
      email: SUPER_ADMIN.email,
      name: SUPER_ADMIN.name,
      passwordHash: await bcrypt.hash(SUPER_ADMIN.password, SALT_ROUNDS),
      role: "SUPER_ADMIN",
      mustChangePassword: true,
    },
  });

  // -------------------------------------------------------------------------
  // Organisasi + 3 akun admin per himpunan
  // -------------------------------------------------------------------------
  const credentials: string[] = [
    `SUPER_ADMIN  ${SUPER_ADMIN.email.padEnd(38)} ${SUPER_ADMIN.password}`,
  ];

  const orgRecords = [];
  const ketuaByOrg = new Map<string, string>();

  for (const org of ORGANIZATIONS) {
    const created = await prisma.organization.create({
      data: {
        name: org.name,
        slug: org.slug,
        shortName: org.shortName,
        faculty: org.faculty,
        studyProgram: org.studyProgram,
        colorHex: org.colorHex,
      },
    });
    orgRecords.push(created);

    for (const account of POSITION_ACCOUNTS) {
      const email = `${account.prefix}${org.accountCode}@gmail.com`;
      const password = `${account.prefix}${org.accountCode}2026`;
      const user = await prisma.user.create({
        data: {
          email,
          name: `${account.label} ${org.name}`,
          passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
          role: "ADMIN",
          position: account.position,
          organizationId: created.id,
          mustChangePassword: true,
        },
      });
      if (account.position === "KETUA") ketuaByOrg.set(created.id, user.id);
      credentials.push(
        `${account.position.padEnd(12)} ${email.padEnd(38)} ${password}`,
      );
    }
  }

  // -------------------------------------------------------------------------
  // Peminjaman contoh — tanggal relatif terhadap hari ini, jadi kalender
  // tidak pernah kosong dan tidak pernah menampilkan data masa lalu palsu.
  // -------------------------------------------------------------------------
  const [himasifo, himatifa, himakom, bemFisip, himabisdig] = orgRecords;

  const bookings = [
    {
      title: "Rapat Kerja Divisi Akademik",
      organizationId: himasifo.id,
      date: isoDate(1),
      startTime: "09:00",
      endTime: "11:00",
      pjName: "Ketua Himasifo",
      pjContact: "081200000001",
      purpose: "Evaluasi program kerja divisi akademik semester berjalan.",
    },
    {
      title: "Open Recruitment Pengurus Baru",
      organizationId: himatifa.id,
      date: isoDate(2),
      startTime: "13:00",
      endTime: "16:00",
      pjName: "Ketua Himatifa",
      pjContact: "081200000002",
      purpose: "Sesi wawancara calon pengurus himpunan.",
    },
    {
      title: "Workshop Dasar Pemrograman",
      organizationId: himakom.id,
      date: isoDate(3),
      startTime: "10:00",
      endTime: "15:00",
      pjName: "Ketua Himakom",
      pjContact: "081200000003",
      purpose: "Pelatihan pemrograman untuk mahasiswa baru.",
    },
    {
      title: "Diskusi Publik Kebijakan Kampus",
      organizationId: bemFisip.id,
      date: isoDate(4),
      startTime: "15:30",
      endTime: "20:00",
      pjName: "Ketua BEM FISIP",
      pjContact: "081200000004",
      purpose: "Forum terbuka bersama perwakilan mahasiswa.",
    },
    {
      title: "Kuliah Umum Kewirausahaan Digital",
      organizationId: himabisdig.id,
      date: isoDate(0),
      startTime: "08:00",
      endTime: "12:00",
      pjName: "Ketua Himabisdig",
      pjContact: "081200000005",
      purpose: "Kuliah umum dengan praktisi industri.",
      status: "SELESAI",
      completedAt: new Date(),
    },
  ];

  for (const item of bookings) {
    await prisma.booking.create({
      data: {
        title: item.title,
        organizationId: item.organizationId,
        roomId: room.id,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        purpose: item.purpose,
        pjName: item.pjName,
        pjContact: item.pjContact,
        status: item.status ?? "DIJADWALKAN",
        completedAt: item.completedAt ?? null,
        source: "SUPER_ADMIN",
        createdById: superAdmin.id,
      },
    });
  }

  // -------------------------------------------------------------------------
  // Contoh slot yang ditutup (perawatan)
  // -------------------------------------------------------------------------
  await prisma.slotLock.create({
    data: {
      date: isoDate(5),
      startTime: "08:00",
      endTime: "12:00",
      reason: "Perawatan dan pembersihan area selasar.",
      lockedById: superAdmin.id,
    },
  });

  console.log("\n=== AKUN SEED ===");
  console.log("PERAN        EMAIL                                  SANDI");
  console.log("-".repeat(78));
  credentials.forEach((line) => console.log(line));
  console.log("-".repeat(78));
  console.log("Semua akun wajib ganti sandi saat login pertama.");
  console.log(`\nSelesai: ${orgRecords.length} organisasi, ${bookings.length} booking, 1 slot lock.`);
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
