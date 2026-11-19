/**
 * Jejak audit. Setiap perubahan data yang berdampak ditulis di sini.
 *
 * Audit tidak boleh menggagalkan aksi utama: kalau pencatatan gagal, aksi
 * tetap dianggap berhasil dan kegagalan hanya dilaporkan ke log server.
 */

import { prisma } from "./db";

export interface AuditInput {
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
}

function serialize(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        before: serialize(input.before),
        after: serialize(input.after),
        ip: input.ip ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] gagal mencatat aktivitas", {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      error,
    });
  }
}
