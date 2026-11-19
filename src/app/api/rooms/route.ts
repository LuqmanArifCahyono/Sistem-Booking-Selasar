import { prisma } from "@/lib/db";
import { ok, toErrorResponse } from "@/lib/http";

/** Daftar ruang aktif beserta jam operasionalnya. */
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, openTime: true, closeTime: true },
      orderBy: { name: "asc" },
    });

    return ok(rooms);
  } catch (error) {
    return toErrorResponse(error);
  }
}
