import { prisma } from "./db";
import { timeToMinutes } from "./booking-status";
import { rangesOverlap } from "./validators";
import { MONTH_NAMES_ID } from "@/constants/admin";
import type { AdminTimelineSlot, AdminStats } from "@/types/admin";
import { toDMY, toISO, minutesToTime } from "./date-format";

export { toDMY, toISO, minutesToTime };

export interface AdminTimelineData {
  slots: AdminTimelineSlot[];
  stats: AdminStats;
  room: { id: string; name: string; openTime: string; closeTime: string };
  dateISO: string;
  dateDMY: string;
}

export async function getAdminTimeline(
  dateISO: string,
  roomId?: string,
): Promise<AdminTimelineData> {
  const room = roomId
    ? await prisma.room.findUnique({ where: { id: roomId } })
    : await prisma.room.findFirst({ where: { isActive: true } });

  const activeRoom = room ?? {
    id: "default-room",
    name: "Selasar Utama",
    openTime: "08:00",
    closeTime: "21:00",
  };

  const dateDMY = toDMY(dateISO);

  // 1. Ambil seluruh booking aktif pada tanggal ini
  const bookings = await prisma.booking.findMany({
    where: {
      date: dateISO,
      deletedAt: null,
      status: { not: "DIBATALKAN" },
      ...(room ? { roomId: room.id } : {}),
    },
    include: {
      organization: { select: { id: true, name: true, shortName: true, colorHex: true } },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // 2. Ambil seluruh slot yang dikunci pada tanggal ini
  const locks = await prisma.slotLock.findMany({
    where: { date: dateISO },
    include: {
      lockedBy: { select: { id: true, name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // 3. Konversi booking ke AdminTimelineSlot
  const bookingSlots: AdminTimelineSlot[] = bookings.map((b) => {
    // Cek apakah ada jadwal lain yang bertubrukan (bentrok)
    const hasConflict = bookings.some(
      (other) => other.id !== b.id && rangesOverlap(b, other),
    );

    return {
      id: b.id,
      timeSlot: `${b.startTime.replace(":", ".")} - ${b.endTime.replace(":", ".")} WIB`,
      rawTime: `${b.startTime} - ${b.endTime}`,
      status: hasConflict ? "bentrok" : "dipesan",
      eventName: b.title,
      organizationId: b.organizationId,
      organizationName: b.organization.name,
      personInCharge: b.pjName,
      contactPJ: b.pjContact,
      purpose: b.purpose ?? "Kegiatan organisasi di area selasar kampus.",
      date: dateDMY,
      isManual: b.source === "SUPER_ADMIN" || b.source === "ADMIN",
    };
  });

  // 4. Konversi slot lock ke AdminTimelineSlot
  const lockSlots: AdminTimelineSlot[] = locks.map((l) => ({
    id: l.id,
    timeSlot: `${l.startTime.replace(":", ".")} - ${l.endTime.replace(":", ".")} WIB`,
    rawTime: `${l.startTime} - ${l.endTime}`,
    status: "dikunci",
    eventName: l.reason ? `Slot Dikunci (${l.reason})` : "Slot Dikunci oleh Pengelola",
    organizationId: "",
    organizationName: "Pengelola Selasar",
    personInCharge: l.lockedBy?.name || "Pengelola",
    contactPJ: "-",
    purpose: l.reason ?? "Penutupan sementara area selasar oleh pengelola kampus.",
    date: dateDMY,
  }));

  // 5. Hitung celah kosong (gaps) dari jam buka sampai jam tutup
  const occupants = [
    ...bookings.map((b) => ({ startTime: b.startTime, endTime: b.endTime })),
    ...locks.map((l) => ({ startTime: l.startTime, endTime: l.endTime })),
  ];

  const occupiedRanges = occupants
    .map((o) => ({
      start: timeToMinutes(o.startTime),
      end: timeToMinutes(o.endTime),
    }))
    .filter((r) => r.end > r.start)
    .sort((a, b) => a.start - b.start);

  const mergedOccupied: { start: number; end: number }[] = [];
  for (const range of occupiedRanges) {
    if (mergedOccupied.length === 0) {
      mergedOccupied.push({ ...range });
    } else {
      const last = mergedOccupied[mergedOccupied.length - 1];
      if (range.start <= last.end) {
        last.end = Math.max(last.end, range.end);
      } else {
        mergedOccupied.push({ ...range });
      }
    }
  }

  const openMins = timeToMinutes(activeRoom.openTime);
  const closeMins = timeToMinutes(activeRoom.closeTime);
  let cursor = openMins;
  const gapSlots: AdminTimelineSlot[] = [];

  for (const occ of mergedOccupied) {
    if (occ.start > cursor) {
      const startTime = minutesToTime(cursor);
      const endTime = minutesToTime(occ.start);
      gapSlots.push({
        id: `gap-${dateISO}-${startTime}-${endTime}`,
        timeSlot: `${startTime.replace(":", ".")} - ${endTime.replace(":", ".")} WIB`,
        rawTime: `${startTime} - ${endTime}`,
        status: "tersedia",
        eventName: "Waktu tersedia",
        organizationId: "",
        organizationName: "",
        personInCharge: "",
        contactPJ: "",
        purpose: `Slot waktu terbuka untuk pengajuan kegiatan ormawa pada ${dateDMY}.`,
        date: dateDMY,
      });
    }
    if (occ.end > cursor) {
      cursor = occ.end;
    }
  }

  if (cursor < closeMins) {
    const startTime = minutesToTime(cursor);
    const endTime = minutesToTime(closeMins);
    gapSlots.push({
      id: `gap-${dateISO}-${startTime}-${endTime}`,
      timeSlot: `${startTime.replace(":", ".")} - ${endTime.replace(":", ".")} WIB`,
      rawTime: `${startTime} - ${endTime}`,
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: `Slot waktu terbuka untuk pengajuan kegiatan ormawa pada ${dateDMY}.`,
      date: dateDMY,
    });
  }

  // 6. Gabungkan seluruh slot dan urutkan berdasarkan waktu mulai
  const allSlots = [...bookingSlots, ...lockSlots, ...gapSlots].sort((a, b) => {
    const aStart = a.rawTime.split(" - ")[0] || "00:00";
    const bStart = b.rawTime.split(" - ")[0] || "00:00";
    return timeToMinutes(aStart) - timeToMinutes(bStart);
  });

  // 7. Hitung statistik dinamis
  const monthPrefix = dateISO.slice(0, 7); // "YYYY-MM"
  const [yearStr, monthStr] = monthPrefix.split("-");
  const monthIdx = Number(monthStr) - 1;
  const monthLabel = `${MONTH_NAMES_ID[monthIdx] || ""} ${yearStr}`;

  const [cancelledCount, totalMonthBookings] = await Promise.all([
    prisma.booking.count({
      where: {
        date: { startsWith: monthPrefix },
        status: "DIBATALKAN",
      },
    }),
    prisma.booking.count({
      where: {
        date: { startsWith: monthPrefix },
        deletedAt: null,
      },
    }),
  ]);

  const slotKosong = gapSlots.length;
  const bookedSlots = bookingSlots.filter((s) => s.status === "dipesan");
  const orgNames = Array.from(
    new Set(bookedSlots.map((s) => s.organizationName).filter(Boolean)),
  );

  const stats: AdminStats = {
    slotKosong,
    slotKosongSub: `Tersedia pada ${dateDMY}`,
    jadwalTerisi: bookedSlots.length,
    jadwalTerisiSub: orgNames.length > 0 ? orgNames.join(", ") : "Belum ada jadwal terisi",
    pembatalanPeriode: cancelledCount,
    pembatalanSub: "Jadwal dibatalkan pada periode ini",
    totalPemakaian: totalMonthBookings,
    totalPemakaianUnit: "Sesi",
    totalPemakaianSub: monthLabel,
  };

  return {
    slots: allSlots,
    stats,
    room: {
      id: activeRoom.id,
      name: activeRoom.name,
      openTime: activeRoom.openTime,
      closeTime: activeRoom.closeTime,
    },
    dateISO,
    dateDMY,
  };
}
