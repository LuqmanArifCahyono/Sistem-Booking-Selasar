"use client";

import React, { useEffect, useState } from "react";
import { BookingEvent } from "@/types";

interface BookingDetailModalProps {
  event: BookingEvent | null;
  onClose: () => void;
  /** Diisi hanya kalau pengguna berhak mengubah jadwal ini. */
  onEditBooking?: (event: BookingEvent) => void;
  onCancelBooking?: (event: BookingEvent) => void;
  onCompleteBooking?: (event: BookingEvent) => void;
  onDeleteBooking?: (event: BookingEvent) => void;
  busy?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  terjadwal: "Dijadwalkan",
  selesai: "Selesai",
  kadaluwarsa: "Kadaluwarsa",
  dibatalkan: "Dibatalkan",
};

const STATUS_CLASS: Record<string, string> = {
  terjadwal: "bg-status-scheduled/10 text-status-scheduled border-status-scheduled/30",
  selesai: "bg-status-done/10 text-status-done border-status-done/30",
  kadaluwarsa: "bg-status-expired/10 text-status-expired border-status-expired/30",
  dibatalkan: "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/30",
};

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function BookingDetailModal({
  event,
  onClose,
  onEditBooking,
  onCancelBooking,
  onCompleteBooking,
  onDeleteBooking,
  busy = false,
}: BookingDetailModalProps) {
  const [confirm, setConfirm] = useState<"batal" | "hapus" | null>(null);
  const [prevEventId, setPrevEventId] = useState(event?.id);

  if (event?.id !== prevEventId) {
    setPrevEventId(event?.id);
    setConfirm(null);
  }

  useEffect(() => {
    if (!event) return;
    const handler = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [event, onClose]);

  if (!event) return null;

  const status = event.status ?? "terjadwal";
  const bisaUbah = Boolean(onEditBooking || onCancelBooking || onCompleteBooking || onDeleteBooking);
  const time = (value: string) => value.replace(".", ":");

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-3 sm:p-6 dark:bg-black/70"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        className="w-full max-w-xl overflow-hidden rounded-panel border border-line bg-surface text-foreground shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 id="booking-detail-title" className="text-lg font-semibold text-foreground">
              Detail Jadwal
            </h2>
            <p className="mt-1 text-sm text-muted">Informasi kegiatan pada kalender selasar</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="rounded-control p-2 text-muted hover:bg-surface-muted"
          >
            ✕
          </button>
        </header>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <p className="text-sm text-muted">Nama kegiatan</p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{event.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-control border px-2 py-1 text-xs font-semibold ${STATUS_CLASS[status] ?? STATUS_CLASS.terjadwal}`}
              >
                {STATUS_LABEL[status] ?? status}
              </span>
              <span
                className={`inline-flex rounded-control border px-2 py-1 text-xs font-semibold ${event.bgClass} ${event.textClass} ${event.borderClass}`}
              >
                {event.organizationName}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Tanggal</p>
              <p className="mt-1 text-sm font-medium text-foreground">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Waktu</p>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">
                {time(event.startTime)} – {time(event.endTime)} WIB
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Penyelenggara</p>
              <p className="mt-1 text-sm font-medium text-foreground">{event.organizationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Penanggung jawab</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {event.personInCharge || "Belum dicantumkan"}
              </p>
            </div>
          </div>

          {event.purpose && (
            <div>
              <p className="text-sm text-muted">Keperluan peminjaman</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {event.purpose}
              </p>
            </div>
          )}

          {confirm && (
            <div
              role="alert"
              className="rounded-control border border-status-cancelled/30 bg-status-cancelled/10 p-3"
            >
              <p className="text-sm font-semibold text-status-cancelled">
                {confirm === "hapus" ? "Hapus jadwal ini secara permanen?" : "Batalkan jadwal ini?"}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {confirm === "hapus"
                  ? "Jadwal hilang dari kalender. Riwayatnya tetap tersimpan untuk audit."
                  : "Slot akan dilepas dan bisa dipakai himpunan lain."}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirm(null)}
                  className="min-h-9 rounded-control border border-line px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-surface-muted"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (confirm === "hapus") onDeleteBooking?.(event);
                    else onCancelBooking?.(event);
                  }}
                  className="min-h-9 rounded-control bg-status-cancelled px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {busy ? "Memproses..." : confirm === "hapus" ? "Ya, hapus" : "Ya, batalkan"}
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {onEditBooking && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onEditBooking(event)}
                className="inline-flex min-h-9 items-center justify-center rounded-control bg-blue-600 dark:bg-blue-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-60 cursor-pointer transition-colors"
              >
                Ubah Jadwal
              </button>
            )}
            {onCompleteBooking && status !== "selesai" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onCompleteBooking(event)}
                className="inline-flex min-h-9 items-center justify-center rounded-control border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-60 cursor-pointer transition-colors"
              >
                Tandai Selesai
              </button>
            )}
            {onCancelBooking && status !== "dibatalkan" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirm("batal")}
                className="inline-flex min-h-9 items-center justify-center rounded-control border border-amber-600/30 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-60 cursor-pointer transition-colors"
              >
                Batalkan
              </button>
            )}
            {onDeleteBooking && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirm("hapus")}
                className="inline-flex min-h-9 items-center justify-center rounded-control border border-red-600/30 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-60 cursor-pointer transition-colors"
              >
                Hapus
              </button>
            )}
            {!bisaUbah && (
              <p className="text-xs sm:text-sm text-muted">
                Hanya pembuat jadwal atau Super Admin yang dapat mengubah data ini.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-control bg-foreground px-4 py-2 text-xs sm:text-sm font-semibold text-background hover:opacity-90 cursor-pointer transition-opacity"
          >
            Tutup
          </button>
        </footer>
      </section>
    </div>
  );
}
