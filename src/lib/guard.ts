/**
 * Penjaga sesi untuk server component.
 *
 * Dipakai di layout setiap area: kalau belum masuk, lempar ke /login. Kalau
 * sudah masuk tapi perannya tidak berhak, kembalikan ke halaman rumahnya
 * sendiri (bukan halaman error, supaya tidak terasa seperti hukuman).
 */

import { redirect } from "next/navigation";
import { getSessionUser } from "./session";
import { homePathForRole } from "./roles";
import type { Role, SessionUser } from "@/types/domain";

export async function requireUser(callbackUrl?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    const target = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(target);
  }
  return user;
}

export async function requireRole(roles: Role[], callbackUrl?: string): Promise<SessionUser> {
  const user = await requireUser(callbackUrl);
  if (!roles.includes(user.role)) {
    redirect(homePathForRole(user.role));
  }
  return user;
}

/**
 * Pengingat sandi bawaan: pengguna disarankan mengganti sandi tetapi tidak dipaksa.
 */
export function requirePasswordChanged(_user?: SessionUser): void {
  // Tidak lagi memaksa redirect ke /ganti-sandi; digantikan dengan banner pengingat di UI.
  void _user;
}
