import { connection } from "next/server";
import { getAvailability, BookingError } from "@/lib/bookings";
import { ok, toErrorResponse } from "@/lib/http";

/** Jam kosong pada satu tanggal. Terbuka untuk semua pengunjung. */
export async function GET(request: Request) {
  // Di luar try/catch: kalau ditaruh di dalam, penolakan prerender ikut tertangkap
  // dan berubah jadi error 500 palsu saat build.
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const roomId = searchParams.get("roomId");

    if (!date || !roomId) {
      throw new BookingError("Parameter date dan roomId wajib diisi.", 422);
    }

    return ok(await getAvailability(date, roomId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
