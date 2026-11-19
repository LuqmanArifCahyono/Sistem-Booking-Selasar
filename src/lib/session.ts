/**
 * Pembantu sesi untuk server component dan route handler.
 *
 * Sesi Auth.js berbentuk JWT, artinya isinya bisa lebih lama daripada data di
 * database. Contoh nyata: database di-seed ulang, akun dihapus, atau akun
 * dinonaktifkan. Kalau JWT dipercaya begitu saja, pengguna akan terjebak pada
 * sesi yang menunjuk akun yang sudah tidak ada.
 *
 * Karena itu setiap pembacaan sesi diverifikasi ulang ke database. Kalau
 * akunnya tidak ada atau tidak aktif, sesi dianggap tidak ada dan pengguna
 * dikembalikan ke halaman masuk.
 */

import { auth } from "./auth";
import { prisma } from "./db";
import type { Actor } from "./rbac";
import type { Position, Role, SessionUser } from "@/types/domain";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const tokenUser = session?.user;
  if (!tokenUser?.id) return null;

  const record = await prisma.user.findUnique({
    where: { id: tokenUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      position: true,
      organizationId: true,
      mustChangePassword: true,
      isActive: true,
      organization: { select: { name: true } },
    },
  });

  if (!record || !record.isActive) return null;

  // Nilai diambil dari database, bukan dari JWT, supaya perubahan peran atau
  // status wajib-ganti-sandi langsung berlaku tanpa menunggu token kedaluwarsa.
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    role: record.role as Role,
    position: (record.position as Position | null) ?? null,
    organizationId: record.organizationId,
    organizationName: record.organization?.name ?? null,
    mustChangePassword: record.mustChangePassword,
  };
}

/** Bentuk minimal yang dibutuhkan lapisan otorisasi. */
export async function getActor(): Promise<Actor | null> {
  const user = await getSessionUser();
  if (!user) return null;
  return {
    id: user.id,
    role: user.role,
    organizationId: user.organizationId,
  };
}
