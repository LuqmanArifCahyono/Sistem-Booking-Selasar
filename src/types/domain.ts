/**
 * Model domain SelasarSpace — satu-satunya sumber kebenaran untuk tipe & enum.
 *
 * Aturan: TIDAK ADA kelas Tailwind, hex warna, atau string presentasi di sini.
 * Warna dan gaya hidup di lapisan UI (src/lib/theme.ts), bukan di data.
 *
 * Enum disimpan sebagai String di database supaya schema tetap portabel
 * antara SQLite (dev) dan Postgres/Supabase (produksi).
 */

// ---------------------------------------------------------------------------
// Peran & jabatan
// ---------------------------------------------------------------------------

export const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const POSITIONS = ["KETUA", "SEKRETARIS", "BENDAHARA"] as const;
export type Position = (typeof POSITIONS)[number];

export const POSITION_LABELS: Record<Position, string> = {
  KETUA: "Ketua Himpunan",
  SEKRETARIS: "Sekretaris",
  BENDAHARA: "Bendahara",
};

export const ROLE_LABELS: Record<Role, string> = {
  USER: "Mahasiswa",
  ADMIN: "Admin Himpunan",
  SUPER_ADMIN: "Super Admin",
};

/** Batas akun admin per himpunan (ketua, sekretaris, bendahara). */
export const MAX_ADMINS_PER_ORGANIZATION = 3;

// ---------------------------------------------------------------------------
// Fakultas & organisasi
// ---------------------------------------------------------------------------

export const FACULTIES = ["FIK", "FISIP"] as const;
export type Faculty = (typeof FACULTIES)[number];

export const FACULTY_LABELS: Record<Faculty, string> = {
  FIK: "Fakultas Ilmu Komputer",
  FISIP: "Fakultas Ilmu Sosial dan Ilmu Politik",
};

// ---------------------------------------------------------------------------
// Status peminjaman
// ---------------------------------------------------------------------------

export const BOOKING_STATUSES = [
  "DIJADWALKAN",
  "SELESAI",
  "KADALUWARSA",
  "DIBATALKAN",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  DIJADWALKAN: "Dijadwalkan",
  SELESAI: "Selesai",
  KADALUWARSA: "Kadaluwarsa",
  DIBATALKAN: "Dibatalkan",
};

/** Status yang benar-benar disimpan di kolom `Booking.status`. */
export const STORED_BOOKING_STATUSES = ["DIJADWALKAN", "SELESAI", "DIBATALKAN"] as const;
export type StoredBookingStatus = (typeof STORED_BOOKING_STATUSES)[number];

// ---------------------------------------------------------------------------
// Batas operasional selasar
// ---------------------------------------------------------------------------

export const SELASAR_OPEN_TIME = "08:00";
export const SELASAR_CLOSE_TIME = "21:00";
export const TIMEZONE_LABEL = "WIB";

// ---------------------------------------------------------------------------
// Bentuk data yang dikirim ke UI
// ---------------------------------------------------------------------------

export interface OrganizationDTO {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  faculty: Faculty;
  studyProgram: string | null;
  colorHex: string;
}

export interface BookingDTO {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string | null;
  pjName: string;
  pjContact: string;
  status: BookingStatus; // sudah termasuk KADALUWARSA hasil hitungan
  organizationId: string;
  organizationName: string;
  organizationShortName: string;
  organizationColorHex: string;
  roomId: string;
  roomName: string;
  createdById: string;
  createdByName: string;
  createdAt: string; // ISO
  /** true jika pemakai sesi boleh mengubah/menghapus booking ini. */
  canMutate: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  position: Position | null;
  organizationId: string | null;
  organizationName: string | null;
  mustChangePassword: boolean;
}
