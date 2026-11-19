import {
  BookingError,
  deleteBooking,
  getBookingById,
  updateBooking,
} from "@/lib/bookings";
import { getActor } from "@/lib/session";
import { bookingUpdateSchema } from "@/lib/validators";
import { ok, toErrorResponse, readJson, requireActor } from "@/lib/http";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const actor = await getActor();
    const booking = await getBookingById(id, actor);
    if (!booking) return toErrorResponse(new BookingError("Jadwal tidak ditemukan.", 404));
    return ok(booking);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const actor = await requireActor();
    const body = await readJson(request);

    const parsed = bookingUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new BookingError(first?.message ?? "Data tidak valid.", 422);
    }

    const booking = await updateBooking(
      id,
      parsed.data,
      actor,
      request.headers.get("x-forwarded-for"),
    );

    return ok(booking);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const actor = await requireActor();
    await deleteBooking(id, actor, request.headers.get("x-forwarded-for"));
    return ok({ id, deleted: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
