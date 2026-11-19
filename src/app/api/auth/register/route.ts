import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validators";
import { ok, fail, toErrorResponse, readJson } from "@/lib/http";
import { recordAudit } from "@/lib/audit";

/**
 * Registrasi mandiri untuk mahasiswa.
 *
 * Peran selalu USER dan tidak pernah diambil dari body permintaan — ini
 * mencegah eskalasi hak akses lewat manipulasi payload. Akun admin hanya
 * dibuat oleh Super Admin.
 */
export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Data tidak valid.", 422);
    }

    const email = parsed.data.email;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return fail("Email ini sudah terdaftar. Coba masuk atau gunakan email lain.", 409);
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name,
        passwordHash: await hashPassword(parsed.data.password),
        role: "USER",
        mustChangePassword: false,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await recordAudit({
      actorId: user.id,
      action: "USER_REGISTER",
      entity: "User",
      entityId: user.id,
      after: { email: user.email },
      ip: request.headers.get("x-forwarded-for"),
    });

    return ok(user, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}
