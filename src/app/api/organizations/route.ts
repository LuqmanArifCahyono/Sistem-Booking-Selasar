import { prisma } from "@/lib/db";
import { ok, toErrorResponse } from "@/lib/http";

/** Daftar himpunan aktif untuk dropdown dan filter kalender. */
export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        faculty: true,
        studyProgram: true,
        colorHex: true,
      },
      orderBy: [{ faculty: "asc" }, { name: "asc" }],
    });

    return ok(organizations);
  } catch (error) {
    return toErrorResponse(error);
  }
}
