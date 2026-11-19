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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 transition-all"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface text-foreground shadow-2xl transition-all"
      >
        <header className="flex items-start justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 id="booking-detail-title" className="text-lg font-bold tracking-tight text-foreground">
                Detail Jadwal Selasar
              </h2>
              <p className="text-xs text-muted">Informasi lengkap kegiatan peminjaman ruangan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Nama Kegiatan</span>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">{event.title}</h3>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[status] ?? STATUS_CLASS.terjadwal}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {STATUS_LABEL[status] ?? status}
              </span>
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${event.bgClass} ${event.textClass} ${event.borderClass}`}
              >
                {event.organizationName}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line/60 bg-surface-muted/40 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Tanggal Pelaksanaan</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(event.date)}</p>
            </div>
            <div className="rounded-xl border border-line/60 bg-surface-muted/40 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Rentang Jam</p>
              <p className="mt-1 font-mono text-sm font-bold text-foreground">
                {time(event.startTime)} – {time(event.endTime)} WIB
              </p>
            </div>
            <div className="rounded-xl border border-line/60 bg-surface-muted/40 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Penyelenggara</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{event.organizationName}</p>
            </div>
            <div className="rounded-xl border border-line/60 bg-surface-muted/40 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Penanggung Jawab</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {event.personInCharge || "Belum dicantumkan"}
              </p>
            </div>
          </div>

          {event.purpose && (
            <div className="rounded-xl border border-line/60 bg-surface-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Keperluan Peminjaman</p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {event.purpose}
              </p>
            </div>
          )}

          {confirm && (
            <div
              role="alert"
              className="rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 p-4 animate-in fade-in duration-200"
            >
              <p className="text-sm font-bold text-status-cancelled">
                {confirm === "hapus" ? "Konfirmasi Hapus Jadwal Secara Permanen" : "Konfirmasi Pembatalan Jadwal"}
              </p>
              <p className="mt-1 text-xs text-foreground/80 leading-relaxed">
                {confirm === "hapus"
                  ? "Jadwal akan dihapus dari kalender. Data riwayat tetap tersimpan untuk kebutuhan audit."
                  : "Slot waktu kegiatan ini akan dilepaskan kembali dan dapat dipinjam oleh himpunan lain."}
              </p>
              <div className="mt-3.5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirm(null)}
                  className="min-h-9 rounded-xl border border-line px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
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
                  className="min-h-9 rounded-xl bg-status-cancelled px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {busy ? "Memproses..." : confirm === "hapus" ? "Ya, Hapus Jadwal" : "Ya, Batalkan Jadwal"}
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-muted/30 px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {onEditBooking && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onEditBooking(event)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-accent-foreground shadow-xs hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60 cursor-pointer transition-all"
              >
                Ubah Jadwal
              </button>
            )}
            {onCompleteBooking && status !== "selesai" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onCompleteBooking(event)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-status-done/30 bg-status-done/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-status-done hover:bg-status-done/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer transition-all"
              >
                Tandai Selesai
              </button>
            )}
            {onCancelBooking && status !== "dibatalkan" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirm("batal")}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-status-expired/30 bg-status-expired/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-status-expired hover:bg-status-expired/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer transition-all"
              >
                Batalkan
              </button>
            )}
            {onDeleteBooking && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirm("hapus")}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-status-cancelled hover:bg-status-cancelled/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer transition-all"
              >
                Hapus
              </button>
            )}
            {!bisaUbah && (
              <p className="text-xs text-muted">
                Hanya pembuat jadwal atau Super Admin yang dapat mengubah data ini.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-xl border border-line bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-surface-muted active:scale-[0.98] cursor-pointer transition-all"
          >
            Tutup
          </button>
        </footer>
      </section>
    </div>
  );
}
