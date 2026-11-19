/**
 * Pembantu route handler: sesi, terjemahan error, dan bentuk respons seragam.
 */

import { NextResponse } from "next/server";
import { getActor } from "./session";
import { BookingError } from "./bookings";
import { UserError } from "./users";
import { ForbiddenError, type Actor } from "./rbac";

export class UnauthorizedError extends Error {
  constructor(message = "Anda harus masuk terlebih dahulu.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status: number): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Ambil aktor dari sesi, atau lempar 401. */
export async function requireActor(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) throw new UnauthorizedError();
  return actor;
}

export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof UnauthorizedError) return fail(error.message, 401);
  if (error instanceof ForbiddenError) return fail(error.message, 403);
  if (error instanceof BookingError) return fail(error.message, error.status);
  if (error instanceof UserError) return fail(error.message, error.status);

  console.error("[api] kesalahan tak terduga", error);
  return fail("Terjadi kesalahan pada server. Coba lagi.", 500);
}

/** Baca body JSON dengan aman. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new BookingError("Body permintaan bukan JSON yang valid.", 400);
  }
}
