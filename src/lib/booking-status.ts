/**
 * Status peminjaman yang dihitung saat dibaca.
 *
 * Kenapa tidak pakai cron: Vercel free tier membatasi jadwal cron, dan status
 * yang bergantung pada cron akan salah setiap kali job gagal jalan.
 * Lebih murah dan lebih benar: hitung saat query.
 *
 * Aturan:
 * - DIBATALKAN dan SELESAI disimpan permanen, tidak pernah ditimpa.
 * - DIJADWALKAN yang sudah lewat jam selesai -> KADALUWARSA.
 * - KADALUWARSA tetap bisa diubah admin menjadi SELESAI lewat tombol
 *   "Tandai Selesai" (antisipasi peminjam lupa melapor).
 */

import type { BookingStatus } from "@/types/domain";

export interface StatusInput {
  status: string;
  date: string; // YYYY-MM-DD
  endTime: string; // HH:mm
}

/** "HH:mm" -> menit sejak tengah malam. */
export function timeToMinutes(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

/** Tanggal + jam lokal menjadi objek Date. */
export function toLocalDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export function resolveBookingStatus(
  booking: StatusInput,
  now: Date = new Date(),
): BookingStatus {
  if (booking.status === "DIBATALKAN") return "DIBATALKAN";
  if (booking.status === "SELESAI") return "SELESAI";
  if (toLocalDateTime(booking.date, booking.endTime).getTime() < now.getTime()) {
    return "KADALUWARSA";
  }
  return "DIJADWALKAN";
}

export function isExpired(booking: StatusInput, now: Date = new Date()): boolean {
  return resolveBookingStatus(booking, now) === "KADALUWARSA";
}

/** Booking aktif = masih mengunci slot. Yang dibatalkan tidak mengunci. */
export function occupiesSlot(booking: StatusInput): boolean {
  return booking.status !== "DIBATALKAN";
}
