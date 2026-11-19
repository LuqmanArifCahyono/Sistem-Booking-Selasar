import type { Role } from "@/types/domain";

/**
 * Halaman rumah untuk setiap peran.
 *
 * Satu tempat saja, dipakai oleh: router di "/", halaman login, penjaga peran,
 * dan pengalihan setelah ganti sandi. Kalau nanti ada panel baru, cukup ubah
 * di sini.
 */
export const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: "/super-admin",
  ADMIN: "/admin",
  USER: "/kalender",
};

export function homePathForRole(role: Role | null | undefined): string {
  if (!role) return "/login";
  return ROLE_HOME[role] ?? "/kalender";
}

/** Halaman mana yang boleh dibuka peran ini. */
export const ROLE_ALLOWED_PREFIX: Record<Role, string[]> = {
  SUPER_ADMIN: ["/super-admin", "/admin", "/kalender", "/ganti-sandi"],
  ADMIN: ["/admin", "/kalender", "/ganti-sandi"],
  USER: ["/kalender", "/ganti-sandi"],
};

export function isPathAllowedForRole(role: Role, pathname: string): boolean {
  const allowed = ROLE_ALLOWED_PREFIX[role] ?? [];
  return allowed.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
