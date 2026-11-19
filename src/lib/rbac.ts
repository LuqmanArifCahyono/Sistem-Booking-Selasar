/**
 * Aturan otorisasi SelasarSpace — satu tempat, tanpa ketergantungan framework.
 *
 * Semua keputusan "boleh atau tidak" HARUS lewat file ini, baik dari route
 * handler maupun dari server component. Tidak ada pemeriksaan izin yang
 * ditulis ulang di komponen.
 *
 * Prinsip: server adalah hakim. UI hanya menyembunyikan tombol; file ini yang
 * benar-benar menolak.
 */

import type { Role } from "@/types/domain";

export interface Actor {
  id: string;
  role: Role;
  organizationId: string | null;
}

export interface BookingOwnership {
  createdById: string;
  organizationId: string;
}

export class ForbiddenError extends Error {
  constructor(message = "Anda tidak berhak melakukan aksi ini.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// ---------------------------------------------------------------------------
// Peran dasar
// ---------------------------------------------------------------------------

export function isSuperAdmin(actor: Actor | null): boolean {
  return actor?.role === "SUPER_ADMIN";
}

export function isAdmin(actor: Actor | null): boolean {
  return actor?.role === "ADMIN";
}

/** Mahasiswa hanya membaca. Tidak ada satu pun aksi tulis yang terbuka. */
export function isReadOnly(actor: Actor | null): boolean {
  return !actor || actor.role === "USER";
}

// ---------------------------------------------------------------------------
// Peminjaman
// ---------------------------------------------------------------------------

/** Semua peran boleh melihat kalender, termasuk yang belum login. */
export function canViewBookings(): boolean {
  return true;
}

/**
 * Admin hanya boleh membuat booking untuk himpunannya sendiri.
 * Super admin bebas.
 */
export function canCreateBooking(
  actor: Actor | null,
  organizationId: string,
): boolean {
  if (!actor) return false;
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role === "ADMIN") return actor.organizationId === organizationId;
  return false;
}

/**
 * Aturan inti permintaan produk: admin hanya boleh mengubah atau menghapus
 * booking yang DIA sendiri buat. Super admin boleh semuanya.
 */
export function canMutateBooking(
  actor: Actor | null,
  booking: BookingOwnership,
): boolean {
  if (!actor) return false;
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role !== "ADMIN") return false;
  if (actor.organizationId !== booking.organizationId) return false;
  return booking.createdById === actor.id;
}

/** Tandai selesai / batalkan mengikuti aturan ubah yang sama. */
export const canCompleteBooking = canMutateBooking;
export const canCancelBooking = canMutateBooking;

// ---------------------------------------------------------------------------
// Slot
// ---------------------------------------------------------------------------

export function canLockSlot(actor: Actor | null): boolean {
  return actor?.role === "ADMIN" || actor?.role === "SUPER_ADMIN";
}

// ---------------------------------------------------------------------------
// Akun & administrasi
// ---------------------------------------------------------------------------

export function canManageUsers(actor: Actor | null): boolean {
  return isSuperAdmin(actor);
}

export function canManageOrganizations(actor: Actor | null): boolean {
  return isSuperAdmin(actor);
}

/**
 * Admin melihat jejak audit miliknya sendiri saja.
 * Super admin melihat seluruh jejak.
 */
export function canViewAuditLog(actor: Actor | null, actorIdOfLog?: string): boolean {
  if (!actor) return false;
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role === "ADMIN") return actorIdOfLog === actor.id;
  return false;
}

// ---------------------------------------------------------------------------
// Pembantu untuk route handler
// ---------------------------------------------------------------------------

export function assertCanMutateBooking(
  actor: Actor | null,
  booking: BookingOwnership,
): void {
  if (!canMutateBooking(actor, booking)) {
    throw new ForbiddenError(
      "Booking ini dibuat oleh akun lain. Hanya pembuatnya atau Super Admin yang boleh mengubahnya.",
    );
  }
}

export function assertCanCreateBooking(
  actor: Actor | null,
  organizationId: string,
): void {
  if (!canCreateBooking(actor, organizationId)) {
    throw new ForbiddenError("Anda hanya boleh membuat jadwal untuk himpunan Anda sendiri.");
  }
}
