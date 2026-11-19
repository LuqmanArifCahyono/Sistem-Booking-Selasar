import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema } from "@/lib/validators";
import { ok, fail, toErrorResponse, readJson, requireActor } from "@/lib/http";
import { recordAudit } from "@/lib/audit";

/**
 * Ganti sandi. Dipakai untuk dua hal:
 * 1. Kewajiban ganti sandi saat login pertama akun yang dibuat Super Admin.
 * 2. Inisiatif pengguna sendiri.
 *
 * Catatan: JWT yang sedang aktif masih membawa mustChangePassword = true
 * sampai pengguna login ulang, jadi klien diminta login ulang setelah sukses.
 */
export async function POST(request: Request) {
  try {
    const actor = await requireActor();
    const body = await readJson(request);

    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Data tidak valid.", 422);
    }

    const user = await prisma.user.findUnique({ where: { id: actor.id } });
    if (!user) return fail("Akun tidak ditemukan.", 404);

    const matches = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!matches) return fail("Sandi saat ini salah.", 401);

    await prisma.user.update({
      where: { id: actor.id },
      data: {
        passwordHash: await hashPassword(parsed.data.newPassword),
        mustChangePassword: false,
      },
    });

    await recordAudit({
      actorId: actor.id,
      action: "USER_CHANGE_PASSWORD",
      entity: "User",
      entityId: actor.id,
      ip: request.headers.get("x-forwarded-for"),
    });

    return ok({ changed: true, reLoginRequired: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
