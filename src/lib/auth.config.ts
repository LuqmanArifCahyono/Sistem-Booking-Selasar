/**
 * Konfigurasi Auth.js yang aman untuk Edge runtime.
 *
 * File ini sengaja tidak mengimpor Prisma maupun bcrypt: middleware berjalan
 * di Edge, dan Prisma tidak bisa hidup di sana. Provider kredensial yang
 * menyentuh database dipasang di src/lib/auth.ts (Node runtime).
 */

import type { NextAuthConfig } from "next-auth";
import type { Position, Role } from "@/types/domain";

/** Klaim tambahan yang kita titipkan di dalam JWT. */
interface AuthClaims {
  role?: Role;
  position?: Position | null;
  organizationId?: string | null;
  organizationName?: string | null;
  mustChangePassword?: boolean;
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    // Sesi 8 jam: cukup untuk satu hari kerja pengurus, tidak menggantung selamanya.
    maxAge: 8 * 60 * 60,
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const claims = user as AuthClaims;
        token.role = claims.role ?? "USER";
        token.position = claims.position ?? null;
        token.organizationId = claims.organizationId ?? null;
        token.organizationName = claims.organizationName ?? null;
        token.mustChangePassword = claims.mustChangePassword ?? false;
      }
      return token;
    },
    session({ session, token }) {
      const claims = token as AuthClaims;
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = claims.role ?? "USER";
        session.user.position = claims.position ?? null;
        session.user.organizationId = claims.organizationId ?? null;
        session.user.organizationName = claims.organizationName ?? null;
        session.user.mustChangePassword = claims.mustChangePassword ?? false;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
