import { requireActor, ok, toErrorResponse, fail } from "@/lib/http";
import { getAdminTimeline, toISO } from "@/lib/admin-timeline";

export async function GET(request: Request) {
  try {
    const actor = await requireActor();
    if (actor.role !== "ADMIN" && actor.role !== "SUPER_ADMIN") {
      return fail("Akses khusus Sub-Admin dan Super Admin.", 403);
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") || toISO(new Date());
    const roomId = searchParams.get("roomId") || undefined;

    const timeline = await getAdminTimeline(dateParam, roomId);
    return ok(timeline);
  } catch (error) {
    return toErrorResponse(error);
  }
}
