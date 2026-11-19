/**
 * Lapisan service peminjaman.
 *
 * Semua aturan bisnis ada di sini, bukan di route handler:
 * - validasi jam operasional
 * - penolakan bentrok (booking lain + slot yang dikunci)
 * - pemeriksaan kepemilikan (admin hanya boleh mengubah miliknya)
 * - pencatatan audit
 *
 * Route handler cukup memanggil fungsi di file ini lalu menerjemahkan error
 * menjadi status HTTP.
 */

import { prisma } from "./db";
import { recordAudit } from "./audit";
import { resolveBookingStatus, timeToMinutes } from "./booking-status";
import {
  assertCanCreateBooking,
  assertCanMutateBooking,
  canMutateBooking,
  type Actor,
} from "./rbac";
import {
  describeConflict,
  findConflict,
  validateTimeRange,
  type ConflictSource,
} from "./validators";
import type { BookingDTO, BookingStatus } from "@/types/domain";

// ---------------------------------------------------------------------------
// Error yang bisa diterjemahkan jadi status HTTP
// ---------------------------------------------------------------------------

export class BookingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "BookingError";
    this.status = status;
  }
}

export class ConflictError extends BookingError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}

// ---------------------------------------------------------------------------
// Tipe input
// ---------------------------------------------------------------------------

export interface BookingInput {
  title: string;
  organizationId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  pjName: string;
  pjContact: string;
  purpose?: string;
}

export interface BookingFilters {
  date?: string;
  from?: string;
  to?: string;
  organizationId?: string;
  roomId?: string;
  includeDeleted?: boolean;
}

// ---------------------------------------------------------------------------
// Pemetaan ke DTO
// ---------------------------------------------------------------------------

type BookingRow = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string | null;
  pjName: string;
  pjContact: string;
  status: string;
  createdAt: Date;
  createdById: string;
  organizationId: string;
  roomId: string;
  organization: { name: string; shortName: string; colorHex: string };
  room: { name: string };
  createdBy: { name: string };
};

function toDTO(row: BookingRow, actor: Actor | null): BookingDTO {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    purpose: row.purpose,
    pjName: row.pjName,
    pjContact: row.pjContact,
    status: resolveBookingStatus(row) as BookingStatus,
    organizationId: row.organizationId,
    organizationName: row.organization.name,
    organizationShortName: row.organization.shortName,
    organizationColorHex: row.organization.colorHex,
    roomId: row.roomId,
    roomName: row.room.name,
    createdById: row.createdById,
    createdByName: row.createdBy.name,
    createdAt: row.createdAt.toISOString(),
    canMutate: canMutateBooking(actor, row),
  };
}

const includeRelations = {
  organization: { select: { name: true, shortName: true, colorHex: true } },
  room: { select: { name: true } },
  createdBy: { select: { name: true } },
} as const;

// ---------------------------------------------------------------------------
// Baca
// ---------------------------------------------------------------------------

export async function listBookings(
  filters: BookingFilters,
  actor: Actor | null,
): Promise<BookingDTO[]> {
  const where: Record<string, unknown> = {};

  if (filters.includeDeleted !== true) where.deletedAt = null;
  if (filters.date) where.date = filters.date;
  if (filters.organizationId) where.organizationId = filters.organizationId;
  if (filters.roomId) where.roomId = filters.roomId;

  if (filters.from || filters.to) {
    where.date = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    };
  }

  const rows = await prisma.booking.findMany({
    where,
    include: includeRelations,
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return rows.map((row) => toDTO(row as BookingRow, actor));
}

export async function getBookingById(
  id: string,
  actor: Actor | null,
): Promise<BookingDTO | null> {
  const row = await prisma.booking.findFirst({
    where: { id, deletedAt: null },
    include: includeRelations,
  });
  return row ? toDTO(row as BookingRow, actor) : null;
}

// ---------------------------------------------------------------------------
// Bentrok
// ---------------------------------------------------------------------------

/**
 * Kumpulkan semua yang menempati slot pada satu tanggal: booking aktif
 * (kecuali yang dibatalkan dan kecuali dirinya sendiri) plus slot yang dikunci.
 * Waktu pembuatan ikut diambil karena aturan produknya "yang mengisi lebih
 * dulu menang", jadi pesan bentrok harus bisa menyebut kapan pemesan sebelumnya
 * masuk.
 */
export async function collectOccupants(
  date: string,
  excludeBookingId?: string,
): Promise<ConflictSource[]> {
  const [bookings, locks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        date,
        deletedAt: null,
        status: { not: "DIBATALKAN" },
        ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      },
      select: {
        id: true,
        title: true,
        date: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        organization: { select: { shortName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.slotLock.findMany({
      where: { date },
      select: {
        id: true,
        reason: true,
        date: true,
        startTime: true,
        endTime: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return [
    ...bookings.map((booking) => ({
      id: booking.id,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      title: booking.title,
      organizationName: booking.organization.shortName,
      createdAt: booking.createdAt,
      kind: "booking" as const,
    })),
    ...locks.map((lock) => ({
      id: lock.id,
      date: lock.date,
      startTime: lock.startTime,
      endTime: lock.endTime,
      title: lock.reason ?? "Slot ditutup pengelola",
      createdAt: lock.createdAt,
      kind: "lock" as const,
    })),
  ];
}

async function assertNoConflict(
  input: { date: string; startTime: string; endTime: string },
  window: { open: string; close: string },
  excludeBookingId?: string,
): Promise<void> {
  const timeError = validateTimeRange(input.startTime, input.endTime, window);
  if (timeError) throw new BookingError(timeError, 422);

  const occupants = await collectOccupants(input.date, excludeBookingId);
  const conflict = findConflict(input, occupants);
  if (conflict) throw new ConflictError(describeConflict(conflict));
}

// ---------------------------------------------------------------------------
// Tulis
// ---------------------------------------------------------------------------

export async function createBooking(
  input: BookingInput,
  actor: Actor,
  ip?: string | null,
): Promise<BookingDTO> {
  assertCanCreateBooking(actor, input.organizationId);

  const [organization, room] = await Promise.all([
    prisma.organization.findFirst({
      where: { id: input.organizationId, isActive: true },
    }),
    prisma.room.findFirst({ where: { id: input.roomId, isActive: true } }),
  ]);

  if (!organization) throw new BookingError("Himpunan tidak ditemukan.", 404);
  if (!room) throw new BookingError("Ruang tidak ditemukan.", 404);

  // Jam buka/tutup diambil dari data ruang, bukan konstanta di kode, supaya
  // pengelola bisa mengubahnya tanpa deploy ulang.
  await assertNoConflict(input, { open: room.openTime, close: room.closeTime });

  const created = await prisma.booking.create({
    data: {
      title: input.title,
      organizationId: input.organizationId,
      roomId: input.roomId,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      pjName: input.pjName,
      pjContact: input.pjContact,
      purpose: input.purpose?.trim() || null,
      status: "DIJADWALKAN",
      source: actor.role,
      createdById: actor.id,
    },
    include: includeRelations,
  });

  await recordAudit({
    actorId: actor.id,
    action: "BOOKING_CREATE",
    entity: "Booking",
    entityId: created.id,
    after: {
      title: created.title,
      date: created.date,
      startTime: created.startTime,
      endTime: created.endTime,
      organizationId: created.organizationId,
    },
    ip,
  });

  return toDTO(created as BookingRow, actor);
}

export async function updateBooking(
  id: string,
  input: Partial<BookingInput>,
  actor: Actor,
  ip?: string | null,
): Promise<BookingDTO> {
  const existing = await prisma.booking.findFirst({
    where: { id, deletedAt: null },
    include: includeRelations,
  });
  if (!existing) throw new BookingError("Jadwal tidak ditemukan.", 404);

  assertCanMutateBooking(actor, existing);

  if (input.organizationId && input.organizationId !== existing.organizationId) {
    // Memindahkan jadwal ke himpunan lain hanya boleh dilakukan Super Admin.
    assertCanCreateBooking(actor, input.organizationId);
  }

  const next = {
    date: input.date ?? existing.date,
    startTime: input.startTime ?? existing.startTime,
    endTime: input.endTime ?? existing.endTime,
  };

  const targetRoomId = input.roomId ?? existing.roomId;
  const room = await prisma.room.findFirst({
    where: { id: targetRoomId, isActive: true },
    select: { openTime: true, closeTime: true },
  });
  if (!room) throw new BookingError("Ruang tidak ditemukan.", 404);

  await assertNoConflict(next, { open: room.openTime, close: room.closeTime }, id);

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.organizationId !== undefined
        ? { organizationId: input.organizationId }
        : {}),
      ...(input.roomId !== undefined ? { roomId: input.roomId } : {}),
      ...(input.date !== undefined ? { date: input.date } : {}),
      ...(input.startTime !== undefined ? { startTime: input.startTime } : {}),
      ...(input.endTime !== undefined ? { endTime: input.endTime } : {}),
      ...(input.pjName !== undefined ? { pjName: input.pjName } : {}),
      ...(input.pjContact !== undefined ? { pjContact: input.pjContact } : {}),
      ...(input.purpose !== undefined
        ? { purpose: input.purpose.trim() || null }
        : {}),
    },
    include: includeRelations,
  });

  await recordAudit({
    actorId: actor.id,
    action: "BOOKING_UPDATE",
    entity: "Booking",
    entityId: id,
    before: {
      title: existing.title,
      date: existing.date,
      startTime: existing.startTime,
      endTime: existing.endTime,
      status: existing.status,
    },
    after: {
      title: updated.title,
      date: updated.date,
      startTime: updated.startTime,
      endTime: updated.endTime,
      status: updated.status,
    },
    ip,
  });

  return toDTO(updated as BookingRow, actor);
}

/** Soft delete: data tetap tersimpan untuk audit. */
export async function deleteBooking(
  id: string,
  actor: Actor,
  ip?: string | null,
): Promise<void> {
  const existing = await prisma.booking.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw new BookingError("Jadwal tidak ditemukan.", 404);

  assertCanMutateBooking(actor, existing);

  await prisma.booking.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await recordAudit({
    actorId: actor.id,
    action: "BOOKING_DELETE",
    entity: "Booking",
    entityId: id,
    before: {
      title: existing.title,
      date: existing.date,
      startTime: existing.startTime,
      endTime: existing.endTime,
    },
    ip,
  });
}

/**
 * Tandai selesai atau batalkan.
 *
 * KADALUWARSA tidak pernah disimpan: kalau admin menekan "Tandai Selesai"
 * pada jadwal yang sudah lewat, statusnya menjadi SELESAI.
 */
export async function setBookingStatus(
  id: string,
  status: "SELESAI" | "DIBATALKAN",
  actor: Actor,
  reason?: string,
  ip?: string | null,
): Promise<BookingDTO> {
  const existing = await prisma.booking.findFirst({
    where: { id, deletedAt: null },
    include: includeRelations,
  });
  if (!existing) throw new BookingError("Jadwal tidak ditemukan.", 404);

  assertCanMutateBooking(actor, existing);

  const updated = await prisma.booking.update({
    where: { id },
    data:
      status === "SELESAI"
        ? { status: "SELESAI", completedAt: new Date() }
        : { status: "DIBATALKAN", cancelledAt: new Date(), cancelReason: reason ?? null },
    include: includeRelations,
  });

  await recordAudit({
    actorId: actor.id,
    action: status === "SELESAI" ? "BOOKING_COMPLETE" : "BOOKING_CANCEL",
    entity: "Booking",
    entityId: id,
    before: { status: existing.status },
    after: { status: updated.status, reason: reason ?? null },
    ip,
  });

  return toDTO(updated as BookingRow, actor);
}

// ---------------------------------------------------------------------------
// Ketersediaan
// ---------------------------------------------------------------------------

export interface AvailabilityGap {
  startTime: string;
  endTime: string;
}

/** Jam kosong pada satu tanggal, dihitung dari jam operasional ruang. */
export async function getAvailability(
  date: string,
  roomId: string,
): Promise<{ open: string; close: string; occupied: ConflictSource[]; gaps: AvailabilityGap[] }> {
  const room = await prisma.room.findFirst({ where: { id: roomId, isActive: true } });
  if (!room) throw new BookingError("Ruang tidak ditemukan.", 404);

  const occupants = await collectOccupants(date);
  const sorted = [...occupants].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  const gaps: AvailabilityGap[] = [];
  let cursor = room.openTime;

  for (const slot of sorted) {
    if (timeToMinutes(slot.startTime) > timeToMinutes(cursor)) {
      gaps.push({ startTime: cursor, endTime: slot.startTime });
    }
    if (timeToMinutes(slot.endTime) > timeToMinutes(cursor)) {
      cursor = slot.endTime;
    }
  }

  if (timeToMinutes(cursor) < timeToMinutes(room.closeTime)) {
    gaps.push({ startTime: cursor, endTime: room.closeTime });
  }

  return { open: room.openTime, close: room.closeTime, occupied: sorted, gaps };
}
