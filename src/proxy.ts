/**
 * Penjaga rute di lapisan Edge (Next 16: file convention `proxy.ts`).
 *
 * Ini lapisan pertama: cepat dan murah, tapi tidak boleh dipercaya sendirian.
 * Pemeriksaan izin yang mengikat tetap di server component (src/lib/guard.ts)
 * dan route handler (src/lib/rbac.ts), karena JWT bisa sudah kedaluwarsa atau
 * peran pengguna berubah setelah token dibuat.
 */

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { homePathForRole, isPathAllowedForRole } from "@/lib/roles";
import type { Role } from "@/types/domain";

const { auth } = NextAuth(authConfig);

/** Semua alamat yang wajib punya sesi. */
const PROTECTED_PREFIXES = ["/admin", "/super-admin", "/kalender", "/ganti-sandi"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const user = request.auth?.user;

  if (!isProtected(pathname)) return NextResponse.next();

  if (!user) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Akun yang memakai sandi bawaan diperingatkan di antarmuka, tidak dipaksa redirect.

  const role = user.role as Role;
  if (!isPathAllowedForRole(role, pathname)) {
    return NextResponse.redirect(new URL(homePathForRole(role), request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
