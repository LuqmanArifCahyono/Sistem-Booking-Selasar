/**
 * Service pengelolaan akun. Semua aksi di sini hanya untuk Super Admin.
 */

import { prisma } from "./db";
import { recordAudit } from "./audit";
import { hashPassword } from "./password";
import { canManageUsers, ForbiddenError, type Actor } from "./rbac";
import { MAX_ADMINS_PER_ORGANIZATION } from "@/types/domain";

export class UserError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "UserError";
    this.status = status;
  }
}

function assertSuperAdmin(actor: Actor) {
  if (!canManageUsers(actor)) {
    throw new ForbiddenError("Hanya Super Admin yang boleh mengelola akun.");
  }
}

export interface AccountRow {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string | null;
  organizationName: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string;
}

export async function listAccounts(actor: Actor): Promise<AccountRow[]> {
  assertSuperAdmin(actor);

  const rows = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      position: true,
      mustChangePassword: true,
      isActive: true,
      createdAt: true,
      organization: { select: { name: true } },
    },
    orderBy: [{ role: "asc" }, { email: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    position: row.position,
    organizationName: row.organization?.name ?? null,
    mustChangePassword: row.mustChangePassword,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
  }));
}

export interface CreateAdminInput {
  organizationId: string;
  position: "KETUA" | "SEKRETARIS" | "BENDAHARA";
  name: string;
  email: string;
  password: string;
}

export async function createAdminAccount(
  input: CreateAdminInput,
  actor: Actor,
  ip?: string | null,
): Promise<AccountRow> {
  assertSuperAdmin(actor);

  const organization = await prisma.organization.findFirst({
    where: { id: input.organizationId, isActive: true },
  });
  if (!organization) throw new UserError("Himpunan tidak ditemukan.", 404);

  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) throw new UserError("Email ini sudah dipakai akun lain.", 409);

  // Batas 3 akun per himpunan: ketua, sekretaris, bendahara.
  const adminCount = await prisma.user.count({
    where: { organizationId: input.organizationId, role: "ADMIN" },
  });
  if (adminCount >= MAX_ADMINS_PER_ORGANIZATION) {
    throw new UserError(
      `Himpunan ini sudah punya ${MAX_ADMINS_PER_ORGANIZATION} akun admin. Hapus atau nonaktifkan salah satu lebih dulu.`,
      409,
    );
  }

  const positionTaken = await prisma.user.findFirst({
    where: { organizationId: input.organizationId, role: "ADMIN", position: input.position },
  });
  if (positionTaken) {
    throw new UserError(
      `Jabatan ${input.position} untuk himpunan ini sudah dipegang akun lain.`,
      409,
    );
  }

  const created = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash: await hashPassword(input.password),
      role: "ADMIN",
      position: input.position,
      organizationId: input.organizationId,
      mustChangePassword: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      position: true,
      mustChangePassword: true,
      isActive: true,
      createdAt: true,
      organization: { select: { name: true } },
    },
  });

  await recordAudit({
    actorId: actor.id,
    action: "USER_CREATE_ADMIN",
    entity: "User",
    entityId: created.id,
    after: {
      email: created.email,
      position: created.position,
      organizationId: input.organizationId,
    },
    ip,
  });

  return {
    id: created.id,
    name: created.name,
    email: created.email,
    role: created.role,
    position: created.position,
    organizationName: created.organization?.name ?? null,
    mustChangePassword: created.mustChangePassword,
    isActive: created.isActive,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function resetPassword(
  userId: string,
  newPassword: string,
  actor: Actor,
  ip?: string | null,
): Promise<void> {
  assertSuperAdmin(actor);

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new UserError("Akun tidak ditemukan.", 404);

  if (target.role === "SUPER_ADMIN" && target.id !== actor.id) {
    throw new UserError("Sandi Super Admin lain tidak bisa direset dari panel.", 403);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: await hashPassword(newPassword),
      mustChangePassword: true,
    },
  });

  await recordAudit({
    actorId: actor.id,
    action: "USER_RESET_PASSWORD",
    entity: "User",
    entityId: userId,
    after: { email: target.email, mustChangePassword: true },
    ip,
  });
}

export async function setAccountActive(
  userId: string,
  isActive: boolean,
  actor: Actor,
  ip?: string | null,
): Promise<void> {
  assertSuperAdmin(actor);

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new UserError("Akun tidak ditemukan.", 404);
  if (target.id === actor.id) {
    throw new UserError("Tidak bisa menonaktifkan akun sendiri.", 400);
  }

  await prisma.user.update({ where: { id: userId }, data: { isActive } });

  await recordAudit({
    actorId: actor.id,
    action: isActive ? "USER_ACTIVATE" : "USER_DEACTIVATE",
    entity: "User",
    entityId: userId,
    before: { isActive: target.isActive },
    after: { isActive },
    ip,
  });
}
