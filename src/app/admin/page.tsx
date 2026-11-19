import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/guard";
import { getAdminTimeline, toISO, toDMY } from "@/lib/admin-timeline";
import { AdminClient } from "@/components/admin/AdminClient";
import type { AdminOrganizationFilter, AdminActivityLogItem } from "@/types/admin";

export const metadata: Metadata = {
  title: "Monitor Jadwal & Kontrol Slot — SelasarSpace",
};

// Route ini membaca sesi dan database secara dinamis.
export const instant = false;

const DOT_MAP: Record<string, string> = {
  "#2563EB": "bg-blue-600",
  "#7C3AED": "bg-purple-600",
  "#059669": "bg-emerald-600",
  "#DB2777": "bg-pink-600",
  "#D97706": "bg-amber-500",
  "#0891B2": "bg-cyan-600",
};

export default async function AdminPage() {
  const user = await requireRole(["ADMIN", "SUPER_ADMIN"], "/admin");
  const initialDateISO = toISO(new Date());

  const [dbOrgs, room, auditLogsRaw] = await Promise.all([
    prisma.organization.findMany({
      where: { isActive: true },
      orderBy: [{ faculty: "asc" }, { name: "asc" }],
    }),
    prisma.room.findFirst({
      where: { isActive: true },
      select: { id: true, name: true, openTime: true, closeTime: true },
    }),
    prisma.auditLog.findMany({
      take: 30,
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
    }),
  ]);

  const activeRoom = room ?? {
    id: "default-room",
    name: "Selasar Utama",
    openTime: "08:00",
    closeTime: "21:00",
  };

  const timelineData = await getAdminTimeline(initialDateISO, activeRoom.id);

  const initialOrganizations: AdminOrganizationFilter[] = dbOrgs.map((org) => ({
    id: org.id,
    name: org.name,
    colorHex: org.colorHex,
    dotClass: DOT_MAP[org.colorHex] || "bg-blue-600",
    checked: true,
  }));

  const initialActivityLogs: AdminActivityLogItem[] = auditLogsRaw.map((log) => {
    let beforeObj: Record<string, unknown> = {};
    let afterObj: Record<string, unknown> = {};
    try { if (log.before) beforeObj = JSON.parse(log.before); } catch {}
    try { if (log.after) afterObj = JSON.parse(log.after); } catch {}

    const isBooking = log.action === "BOOKING_CREATE";
    const title = (afterObj.title as string) || (beforeObj.title as string) || "Peminjaman Selasar";
    const rawDate = (afterObj.date as string) || (beforeObj.date as string) || toISO(log.createdAt);
    const start = (afterObj.startTime as string) || (beforeObj.startTime as string) || "08:00";
    const end = (afterObj.endTime as string) || (beforeObj.endTime as string) || "10:00";

    return {
      id: log.id,
      type: isBooking ? ("booking" as const) : ("batal" as const),
      organizationId: log.actor.organizationId || "lainnya",
      organizationName: log.actor.organization?.name || "Pengelola Kampus",
      personInCharge: log.actor.name,
      eventName: title,
      date: rawDate.includes("-") ? toDMY(rawDate) : rawDate,
      timeRange: `${start.replace(":", ".")} - ${end.replace(":", ".")} WIB`,
      timestamp: `${toDMY(toISO(log.createdAt))} • ${log.createdAt.toISOString().slice(11, 16)} WIB`,
      slotTag: isBooking ? "Booking Baru" : "Slot Otomatis Dibuka",
      reason: (afterObj.reason as string) || "Pelepasan jadwal oleh peminjam.",
      cancellationStatus: "Pembatalan Mandiri User",
    };
  });

  // Ambil nama organisasi akun jika ada
  let userOrgName: string | null = null;
  if (user.organizationId) {
    const org = dbOrgs.find((o) => o.id === user.organizationId);
    userOrgName = org?.name ?? null;
  }

  return (
    <AdminClient
      initialSlots={timelineData.slots}
      initialStats={timelineData.stats}
      initialActivityLogs={initialActivityLogs}
      initialOrganizations={initialOrganizations}
      initialDateISO={initialDateISO}
      room={activeRoom}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        organizationId: user.organizationId,
        organizationName: userOrgName,
        mustChangePassword: user.mustChangePassword,
      }}
    />
  );
}
