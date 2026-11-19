import { BookingError, setBookingStatus } from "@/lib/bookings";
import { bookingStatusUpdateSchema } from "@/lib/validators";
import { ok, toErrorResponse, readJson, requireActor } from "@/lib/http";

type Params = { params: Promise<{ id: string }> };

/** Tandai selesai atau batalkan. Aturan kepemilikan sama dengan ubah. */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const actor = await requireActor();
    const body = await readJson(request);

    const parsed = bookingStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new BookingError(first?.message ?? "Data tidak valid.", 422);
    }

    const booking = await setBookingStatus(
      id,
      parsed.data.status,
      actor,
      parsed.data.reason,
      request.headers.get("x-forwarded-for"),
    );

    return ok(booking);
  } catch (error) {
    return toErrorResponse(error);
  }
}
