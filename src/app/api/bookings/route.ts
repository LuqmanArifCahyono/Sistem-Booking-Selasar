import { createBooking, listBookings, BookingError } from "@/lib/bookings";
import { getActor } from "@/lib/session";
import { bookingCreateSchema } from "@/lib/validators";
import { ok, toErrorResponse, readJson, requireActor } from "@/lib/http";

/** Kalender bisa dibaca siapa saja, termasuk yang belum masuk. */
export async function GET(request: Request) {
  try {
    const actor = await getActor();
    const { searchParams } = new URL(request.url);

    const bookings = await listBookings(
      {
        date: searchParams.get("date") ?? undefined,
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        organizationId: searchParams.get("organizationId") ?? undefined,
        roomId: searchParams.get("roomId") ?? undefined,
      },
      actor,
    );

    return ok(bookings);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Hanya ADMIN (himpunannya sendiri) dan SUPER_ADMIN. */
export async function POST(request: Request) {
  try {
    const actor = await requireActor();
    const body = await readJson(request);

    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new BookingError(first?.message ?? "Data tidak valid.", 422);
    }

    const booking = await createBooking(
      parsed.data,
      actor,
      request.headers.get("x-forwarded-for"),
    );

    return ok(booking, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}
