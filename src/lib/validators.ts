/**
 * Validasi input — dipakai bersama oleh route handler dan form.
 *
 * Semua aturan waktu (jam operasional, urutan mulai/selesai, bentrok) ada di
 * sini supaya tidak ada dua versi kebenaran antara client dan server.
 */

import { z } from "zod";
import { timeToMinutes } from "./booking-status";

export const OPEN_MINUTES = timeToMinutes("08:00");
export const CLOSE_MINUTES = timeToMinutes("21:00");

// ---------------------------------------------------------------------------
// Potongan dasar
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Email terlalu pendek.")
  .max(254, "Email terlalu panjang.")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format email tidak valid.");

export const passwordSchema = z
  .string()
  .min(8, "Sandi minimal 8 karakter.")
  .max(72, "Sandi maksimal 72 karakter.");

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus berformat YYYY-MM-DD.")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }, "Tanggal tidak valid.");

export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam harus berformat HH:mm.");

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Sandi wajib diisi."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi sandi tidak sama.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Sandi saat ini wajib diisi."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi sandi tidak sama.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Sandi baru harus berbeda dari sandi lama.",
    path: ["newPassword"],
  });

// ---------------------------------------------------------------------------
// Peminjaman
// ---------------------------------------------------------------------------

const bookingBase = z.object({
  title: z.string().trim().min(3, "Nama kegiatan minimal 3 karakter.").max(120),
  organizationId: z.string().trim().min(1, "Himpunan wajib dipilih."),
  roomId: z.string().trim().min(1, "Ruang wajib dipilih."),
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  pjName: z.string().trim().min(3, "Nama penanggung jawab minimal 3 karakter.").max(100),
  pjContact: z
    .string()
    .trim()
    .min(8, "Kontak minimal 8 karakter.")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Kontak hanya boleh angka, spasi, +, dan -."),
  purpose: z.string().trim().max(500).optional().or(z.literal("")),
});

/**
 * Urutan jam selalu wajib. Batas jam buka/tutup hanya diperiksa kalau jendela
 * operasional diberikan, karena nilainya berasal dari data ruang di database,
 * bukan dari konstanta di kode.
 */
export function validateTimeRange(
  startTime: string,
  endTime: string,
  window?: { open: string; close: string },
): string | null {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (end <= start) return "Jam selesai harus setelah jam mulai.";

  if (window) {
    const open = timeToMinutes(window.open);
    const close = timeToMinutes(window.close);
    if (start < open) return `Peminjaman tidak boleh sebelum ${window.open}.`;
    if (end > close) return `Peminjaman tidak boleh melewati ${window.close}.`;
  }

  return null;
}

export const bookingCreateSchema = bookingBase.superRefine((data, ctx) => {
  const error = validateTimeRange(data.startTime, data.endTime);
  if (error) {
    ctx.addIssue({ code: "custom", message: error, path: ["endTime"] });
  }
});

export const bookingUpdateSchema = bookingBase
  .partial()
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const error = validateTimeRange(data.startTime, data.endTime);
      if (error) {
        ctx.addIssue({ code: "custom", message: error, path: ["endTime"] });
      }
    }
  });

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(["SELESAI", "DIBATALKAN"]),
  reason: z.string().trim().max(300).optional(),
});

// ---------------------------------------------------------------------------
// Slot & akun
// ---------------------------------------------------------------------------

export const slotLockSchema = z
  .object({
    date: dateSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    reason: z.string().trim().max(300).optional(),
  })
  .superRefine((data, ctx) => {
    const error = validateTimeRange(data.startTime, data.endTime);
    if (error) {
      ctx.addIssue({ code: "custom", message: error, path: ["endTime"] });
    }
  });

export const createAdminAccountSchema = z.object({
  organizationId: z.string().trim().min(1, "Himpunan wajib dipilih."),
  position: z.enum(["KETUA", "SEKRETARIS", "BENDAHARA"]),
  name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(100),
  email: emailSchema,
  password: passwordSchema,
});

// ---------------------------------------------------------------------------
// Bentrok jadwal
// ---------------------------------------------------------------------------

export interface TimeRange {
  startTime: string;
  endTime: string;
}

/** Dua rentang bertabrakan? Batas sentuh (10:00-12:00 vs 12:00-14:00) tidak dihitung bentrok. */
export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return (
    timeToMinutes(a.startTime) < timeToMinutes(b.endTime) &&
    timeToMinutes(a.endTime) > timeToMinutes(b.startTime)
  );
}

export interface ConflictSource extends TimeRange {
  date: string;
  kind: "booking" | "lock";
  id: string;
  title: string;
  organizationName?: string;
  /** Kapan pemesanan ini masuk. Yang lebih awal menang. */
  createdAt?: Date;
}

/**
 * Cari satu pun sumber bentrok pada tanggal yang sama.
 * Mengembalikan null jika aman.
 */
export function findConflict(
  candidate: { date: string; startTime: string; endTime: string },
  sources: ConflictSource[],
): ConflictSource | null {
  for (const source of sources) {
    if (source.date !== candidate.date) continue;
    if (rangesOverlap(candidate, source)) return source;
  }
  return null;
}

/** Waktu dalam zona WIB, format "19/11/2026 09.12". */
function formatWib(value: Date): string {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(value);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}.${get("minute")}`;
}

/**
 * Pesan bentrok yang bisa dibaca manusia.
 *
 * Aturan produk: siapa yang mengisi lebih dulu, dia yang menang. Jadi pesan ini
 * selalu menyebut pemesan sebelumnya dan kapan dia masuk, bukan sekadar
 * "bentrok".
 */
export function describeConflict(conflict: ConflictSource): string {
  const jam = `${conflict.startTime}–${conflict.endTime}`;

  if (conflict.kind === "lock") {
    return `Slot ${jam} ditutup oleh pengelola${conflict.title ? ` (${conflict.title})` : ""}. Pilih waktu lain.`;
  }

  const pemilik = conflict.organizationName ? ` oleh ${conflict.organizationName}` : "";
  const kapan = conflict.createdAt ? ` pada ${formatWib(conflict.createdAt)}` : "";

  return `Slot ${jam} sudah dipesan lebih dulu${pemilik} lewat kegiatan "${conflict.title}"${kapan}. Yang mengisi lebih awal yang berlaku, jadi pilih waktu lain.`;
}
