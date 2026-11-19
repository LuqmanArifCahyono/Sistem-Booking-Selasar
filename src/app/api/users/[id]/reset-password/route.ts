import { z } from "zod";
import { resetPassword, UserError } from "@/lib/users";
import { passwordSchema } from "@/lib/validators";
import { ok, toErrorResponse, readJson, requireActor } from "@/lib/http";

const bodySchema = z.object({
  newPassword: passwordSchema,
});

type Params = { params: Promise<{ id: string }> };

/**
 * Reset sandi akun oleh Super Admin.
 * Akun yang direset otomatis wajib mengganti sandi saat login berikutnya.
 */
export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const actor = await requireActor();
    const body = await readJson(request);

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      throw new UserError(parsed.error.issues[0]?.message ?? "Sandi tidak valid.", 422);
    }

    await resetPassword(
      id,
      parsed.data.newPassword,
      actor,
      request.headers.get("x-forwarded-for"),
    );

    return ok({ id, reset: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
