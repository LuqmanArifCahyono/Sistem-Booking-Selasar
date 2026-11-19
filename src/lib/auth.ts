/**
 * Auth.js (Node runtime) — provider kredensial dengan bcrypt + Prisma.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { loginSchema } from "./validators";
import type { Position, Role } from "@/types/domain";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Akun SelasarSpace",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sandi", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { organization: true },
        });

        if (!user || !user.isActive) return null;

        const passwordMatches = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordMatches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
          position: (user.position as Position | null) ?? null,
          organizationId: user.organizationId,
          organizationName: user.organization?.name ?? null,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
});
