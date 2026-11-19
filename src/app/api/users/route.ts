import { createAdminAccount, listAccounts, UserError } from "@/lib/users";
import { createAdminAccountSchema } from "@/lib/validators";
import { ok, toErrorResponse, readJson, requireActor } from "@/lib/http";

/** Daftar seluruh akun. Hanya Super Admin. */
export async function GET() {
  try {
    const actor = await requireActor();
    return ok(await listAccounts(actor));
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Buat akun Admin Himpunan baru. Hanya Super Admin. */
export async function POST(request: Request) {
  try {
    const actor = await requireActor();
    const body = await readJson(request);

    const parsed = createAdminAccountSchema.safeParse(body);
    if (!parsed.success) {
      throw new UserError(parsed.error.issues[0]?.message ?? "Data tidak valid.", 422);
    }

    const account = await createAdminAccount(
      parsed.data,
      actor,
      request.headers.get("x-forwarded-for"),
    );

    return ok(account, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}
