import type { Metadata } from "next";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { resolveBookingStatus } from "@/lib/booking-status";
import { canMutateBooking } from "@/lib/rbac";
import { KalenderClient } from "@/components/bookings/KalenderClient";
import type { BookingEvent, Organization } from "@/types";
import type { BookingStatus } from "@/types/domain";

export const metadata: Metadata = {
  title: "Kalender Selasar — SelasarSpace",
};

/**
 * Palet warna per himpunan.
 *
 * Kelas Tailwind harus literal supaya ikut terkompilasi, jadi warna dipilih
 * berdasarkan urutan himpunan, bukan dibentuk dari hex di database. Hex asli
 * tetap dipakai di panel admin dan legenda.
 */
const PALETTE = [
  {
    bgClass: "bg-blue-100/90 hover:bg-blue-200/90 dark:bg-blue-950/60 dark:hover:bg-blue-900/60",
    textClass: "text-blue-950 dark:text-blue-100",
    subtextClass: "text-blue-800 dark:text-blue-300",
    borderClass: "border-blue-300 dark:border-blue-800",
  },
  {
    bgClass: "bg-purple-100/90 hover:bg-purple-200/90 dark:bg-purple-950/60 dark:hover:bg-purple-900/60",
    textClass: "text-purple-950 dark:text-purple-100",
    subtextClass: "text-purple-800 dark:text-purple-300",
    borderClass: "border-purple-300 dark:border-purple-800",
  },
  {
    bgClass: "bg-emerald-100/90 hover:bg-emerald-200/90 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60",
    textClass: "text-emerald-950 dark:text-emerald-100",
    subtextClass: "text-emerald-800 dark:text-emerald-300",
    borderClass: "border-emerald-300 dark:border-emerald-800",
  },
  {
    bgClass: "bg-amber-100/90 hover:bg-amber-200/90 dark:bg-amber-950/60 dark:hover:bg-amber-900/60",
    textClass: "text-amber-950 dark:text-amber-100",
    subtextClass: "text-amber-800 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-800",
  },
  {
    bgClass: "bg-pink-100/90 hover:bg-pink-200/90 dark:bg-pink-950/60 dark:hover:bg-pink-900/60",
    textClass: "text-pink-950 dark:text-pink-100",
    subtextClass: "text-pink-800 dark:text-pink-300",
    borderClass: "border-pink-300 dark:border-pink-800",
  },
  {
    bgClass: "bg-cyan-100/90 hover:bg-cyan-200/90 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/60",
    textClass: "text-cyan-950 dark:text-cyan-100",
    subtextClass: "text-cyan-800 dark:text-cyan-300",
    borderClass: "border-cyan-300 dark:border-cyan-800",
  },
];

const STATUS_MAP: Record<BookingStatus, BookingEvent["status"]> = {
  DIJADWALKAN: "terjadwal",
  SELESAI: "selesai",
  KADALUWARSA: "kadaluwarsa",
  DIBATALKAN: "dibatalkan",
};

function localTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** "09:00" -> "09.00", format yang dipakai komponen tampilan. */
function toDotTime(value: string): string {
  return value.replace(":", ".");
}

// Halaman ini membaca sesi, database, dan tanggal hari ini, jadi tidak bisa
// diprerender statis. Ini jalan keluar resmi Next 16 untuk rute blocking.
export const instant = false;

export default async function KalenderPage() {
  // Tanggal hari ini harus dihitung saat permintaan, bukan saat build.
  await connection();

  const user = await getSessionUser();
  const actor = user
    ? { id: user.id, role: user.role, organizationId: user.organizationId }
    : null;
  const isSuper = user?.role === "SUPER_ADMIN";
  const isAdminUser = user?.role === "ADMIN";

  const backLink = isSuper
    ? { href: "/super-admin", label: "Panel Super Admin" }
    : isAdminUser
      ? { href: "/admin", label: "Panel Admin" }
      : undefined;

  const secondaryBackLink = isSuper
    ? { href: "/admin", label: "Timeline Admin" }
    : undefined;

  const canCreate = isSuper || isAdminUser;

  const [organizationRows, bookingRows, activeRoom] = await Promise.all([
    prisma.organization.findMany({
      where: { isActive: true },
      select: { id: true, name: true, shortName: true, colorHex: true },
      orderBy: [{ faculty: "asc" }, { name: "asc" }],
    }),
    prisma.booking.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        date: true,
        startTime: true,
        endTime: true,
        purpose: true,
        pjName: true,
        pjContact: true,
        status: true,
        createdById: true,
        organizationId: true,
        organization: { select: { name: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.room.findFirst({
      where: { isActive: true },
      select: { id: true, name: true },
    }),
  ]);

  const paletteByOrg = new Map<string, (typeof PALETTE)[number]>();
  organizationRows.forEach((org, index) => {
    paletteByOrg.set(org.id, PALETTE[index % PALETTE.length]);
  });

  const organizations: Organization[] = organizationRows.map((org, index) => {
    const palette = PALETTE[index % PALETTE.length];
    return {
      id: org.id,
      name: org.shortName,
      colorHex: org.colorHex,
      badgeClass: palette.bgClass,
      textClass: palette.textClass,
      borderClass: palette.borderClass,
      checked: true,
    };
  });

  const events: BookingEvent[] = bookingRows.map((row) => {
    const palette = paletteByOrg.get(row.organizationId) ?? PALETTE[0];
    return {
      id: row.id,
      title: row.title,
      organizationId: row.organizationId,
      organizationName: row.organization.name,
      date: row.date,
      startTime: toDotTime(row.startTime),
      endTime: toDotTime(row.endTime),
      personInCharge: row.pjName,
      pjContact: row.pjContact,
      purpose: row.purpose ?? undefined,
      status: STATUS_MAP[resolveBookingStatus(row)],
      canMutate: actor ? canMutateBooking(actor, row) : false,
      ...palette,
    };
  });

  return (
    <KalenderClient
      todayIso={localTodayIso()}
      events={events}
      organizations={organizations}
      roomId={activeRoom?.id ?? "default-room"}
      backLink={backLink}
      secondaryBackLink={secondaryBackLink}
      mustChangePassword={user?.mustChangePassword}
      canCreate={canCreate}
      userRole={user?.role}
      user={user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      } : null}
    />
  );
}
