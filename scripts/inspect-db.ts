/**
 * Snapshot isi database, apa pun penyedianya (MySQL, SQLite, Postgres).
 *
 * Memakai Prisma Client, bukan driver mentah, supaya skrip ini tetap jalan
 * setelah database dipindah. Prisma Studio tidak dipakai karena tidak
 * mendukung protokol `file:` pada Prisma 7.
 *
 * Pakai: npm run db:inspect
 */

import "dotenv/config";
import { prisma } from "../src/lib/db";

function section(title: string) {
  console.log(`\n${title}`);
  console.log("-".repeat(62));
}

async function main() {
  const provider = (process.env.DATABASE_URL ?? "").split(":")[0];
  console.log(`Database: ${provider}`);

  const [organizations, users, rooms, bookings, deleted, locks, audits] = await Promise.all([
    prisma.organization.findMany({
      select: {
        shortName: true,
        faculty: true,
        studyProgram: true,
        _count: { select: { users: true, bookings: true } },
      },
      orderBy: [{ faculty: "asc" }, { name: "asc" }],
    }),
    prisma.user.findMany({ select: { role: true, mustChangePassword: true } }),
    prisma.room.findMany({ select: { name: true, openTime: true, closeTime: true } }),
    prisma.booking.findMany({
      where: { deletedAt: null },
      select: {
        date: true,
        startTime: true,
        endTime: true,
        title: true,
        status: true,
        organization: { select: { shortName: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.booking.count({ where: { deletedAt: { not: null } } }),
    prisma.slotLock.findMany({
      select: { date: true, startTime: true, endTime: true, reason: true },
      orderBy: { date: "asc" },
    }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        action: true,
        entity: true,
        createdAt: true,
        actor: { select: { name: true } },
      },
    }),
  ]);

  const countByRole = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] ?? 0) + 1;
    return acc;
  }, {});

  section("Ringkasan");
  console.log(`Organisasi        : ${organizations.length}`);
  console.log(`Pengguna          : ${users.length}`);
  console.log(`  Super Admin     : ${countByRole.SUPER_ADMIN ?? 0}`);
  console.log(`  Admin Himpunan  : ${countByRole.ADMIN ?? 0}`);
  console.log(`  Mahasiswa       : ${countByRole.USER ?? 0}`);
  console.log(`Wajib ganti sandi : ${users.filter((u) => u.mustChangePassword).length}`);
  rooms.forEach((room) => {
    console.log(`Ruang             : ${room.name} (${room.openTime}-${room.closeTime})`);
  });
  console.log(`Peminjaman        : ${bookings.length} aktif, ${deleted} dihapus (soft delete)`);
  console.log(`Slot ditutup      : ${locks.length}`);

  section("Himpunan");
  organizations.forEach((org) => {
    console.log(
      `${org.shortName.padEnd(14)} ${org.faculty.padEnd(6)} ${(org.studyProgram ?? "-").padEnd(24)} ` +
        `${org._count.users} akun, ${org._count.bookings} jadwal`,
    );
  });

  section("Peminjaman aktif");
  if (bookings.length === 0) {
    console.log("(kosong)");
  } else {
    bookings.forEach((row) => {
      console.log(
        `${row.date} ${row.startTime}-${row.endTime}  ${row.organization.shortName.padEnd(10)} ` +
          `${row.status.padEnd(13)} ${row.title}`,
      );
      console.log(`${" ".repeat(28)}dibuat oleh: ${row.createdBy.name}`);
    });
  }

  section("Slot yang ditutup");
  if (locks.length === 0) {
    console.log("(kosong)");
  } else {
    locks.forEach((lock) => {
      console.log(`${lock.date} ${lock.startTime}-${lock.endTime}  ${lock.reason ?? "-"}`);
    });
  }

  section("Jejak audit terakhir");
  if (audits.length === 0) {
    console.log("(belum ada aktivitas)");
  } else {
    audits.forEach((log) => {
      console.log(
        `${log.createdAt.toISOString().slice(0, 19).replace("T", " ")}  ` +
          `${log.action.padEnd(20)} ${log.entity.padEnd(10)} oleh ${log.actor.name}`,
      );
    });
  }

  console.log();
}

main()
  .catch((error) => {
    console.error("Gagal membaca database:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
