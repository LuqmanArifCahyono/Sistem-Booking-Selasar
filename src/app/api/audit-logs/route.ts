import { prisma } from "@/lib/db";
import { ok, toErrorResponse } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = Math.min(Number(searchParams.get("limit") ?? 30), 100);

    const logs = await prisma.auditLog.findMany({
      take,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true,
            organizationId: true,
            organization: { select: { id: true, name: true, shortName: true } },
          },
        },
      },
    });

    return ok(logs);
  } catch (error) {
    return toErrorResponse(error);
  }
}
