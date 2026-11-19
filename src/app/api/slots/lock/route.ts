import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import { canLockSlot, ForbiddenError } from "@/lib/rbac";
import { slotLockSchema, rangesOverlap, validateTimeRange } from "@/lib/validators";
import { ok, fail, toErrorResponse, readJson, requireActor } from "@/lib/http";
import { resolveBookingStatus } from "@/lib/booking-status";

/** Slot yang ditutup pengelola pada satu tanggal. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const locks = await prisma.slotLock.findMany({
      where: date ? { date } : {},
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        reason: true,
        createdAt: true,
        lockedBy: { select: { id: true, name: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return ok(locks);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Tutup sebuah rentang waktu. Admin dan Super Admin saja. */
export async function POST(request: Request) {
  try {
    const actor = await requireActor();
    if (!canLockSlot(actor)) throw new ForbiddenError("Hanya pengelola yang boleh menutup slot.");

    const body = await readJson(request);
    const parsed = slotLockSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Data tidak valid.", 422);
    }

    // Slot yang ditutup tidak boleh menabrak jadwal yang masih aktif.
    const [sameDay, room] = await Promise.all([
      prisma.booking.findMany({
        where: { date: parsed.data.date, deletedAt: null, status: { not: "DIBATALKAN" } },
        select: { id: true, title: true, date: true, startTime: true, endTime: true, status: true },
      }),
      prisma.room.findFirst({
        where: { isActive: true },
        select: { openTime: true, closeTime: true },
      }),
    ]);

    if (room) {
      const timeError = validateTimeRange(parsed.data.startTime, parsed.data.endTime, {
        open: room.openTime,
        close: room.closeTime,
      });
      if (timeError) return fail(timeError, 422);
    }

    const clash = sameDay.find(
      (booking) =>
        resolveBookingStatus(booking) !== "DIBATALKAN" &&
        rangesOverlap(parsed.data, booking),
    );

    if (clash) {
      return fail(
        `Tidak bisa menutup slot: masih ada jadwal "${clash.title}" (${clash.startTime}–${clash.endTime}). Batalkan jadwal itu lebih dulu.`,
        409,
      );
    }

    const lock = await prisma.slotLock.create({
      data: {
        date: parsed.data.date,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        reason: parsed.data.reason?.trim() || null,
        lockedById: actor.id,
      },
      select: { id: true, date: true, startTime: true, endTime: true, reason: true },
    });

    await recordAudit({
      actorId: actor.id,
      action: "SLOT_LOCK",
      entity: "SlotLock",
      entityId: lock.id,
      after: lock,
      ip: request.headers.get("x-forwarded-for"),
    });

    return ok(lock, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Buka kembali slot. Pembuat kunci atau Super Admin. */
export async function DELETE(request: Request) {
  try {
    const actor = await requireActor();
    if (!canLockSlot(actor)) throw new ForbiddenError("Hanya pengelola yang boleh membuka slot.");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return fail("Parameter id wajib diisi.", 422);

    const lock = await prisma.slotLock.findUnique({ where: { id } });
    if (!lock) return fail("Kunci slot tidak ditemukan.", 404);

    if (actor.role !== "SUPER_ADMIN" && lock.lockedById !== actor.id) {
      throw new ForbiddenError("Slot ini ditutup oleh akun lain. Hanya pembuatnya atau Super Admin yang boleh membukanya.");
    }

    await prisma.slotLock.delete({ where: { id } });

    await recordAudit({
      actorId: actor.id,
      action: "SLOT_UNLOCK",
      entity: "SlotLock",
      entityId: id,
      before: lock,
      ip: request.headers.get("x-forwarded-for"),
    });

    return ok({ id, deleted: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
