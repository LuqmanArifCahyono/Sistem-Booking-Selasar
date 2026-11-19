"use client";

import React from "react";
import { AdminTimelineSlot } from "@/types/admin";

interface AdminTimelineViewProps {
  slots: AdminTimelineSlot[];
  dateFormatted: string; // e.g. "12/11/2026"
  onViewDetail: (slot: AdminTimelineSlot) => void;
  onManualFill: (slot: AdminTimelineSlot) => void;
  onLockSlot: (slot: AdminTimelineSlot) => void;
}

export function AdminTimelineView({
  slots,
  dateFormatted,
  onViewDetail,
  onManualFill,
  onLockSlot,
}: AdminTimelineViewProps) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-xs transition-all flex flex-col h-full">
      {/* Header Linimasa */}
      <div className="pb-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Linimasa Operasional Selasar (08:00 – 21:00 WIB)
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted mt-0.5 flex-wrap">
            <span>Jadwal tanggal {dateFormatted}</span>
            <span>•</span>
            <span className="text-status-expired font-medium">
              Manajemen slot waktu terintegrasi real-time
            </span>
          </div>
        </div>
      </div>

      {/* Daftar Slot Waktu Linimasa */}
      {slots.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-line flex items-center justify-center text-muted mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-foreground">
            Tidak ada slot atau jadwal kegiatan yang cocok
          </p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Periksa filter organisasi di panel sebelah kiri atau pilih tanggal pelaksanaan lainnya.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-line/60 flex-1">
          {slots.map((slot) => {
            const isBentrok = slot.status === "bentrok";
            const isTersedia = slot.status === "tersedia";
            const isDikunci = slot.status === "dikunci";
            const isDipesan = slot.status === "dipesan";

            return (
              <div
                key={slot.id}
                className={`py-3.5 px-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isBentrok
                    ? "bg-status-cancelled/5 hover:bg-status-cancelled/10"
                    : isTersedia
                    ? "bg-status-done/5 hover:bg-status-done/10"
                    : isDikunci
                    ? "bg-surface-muted/50 opacity-70"
                    : "hover:bg-surface-muted/40"
                }`}
              >
                {/* Kolom Waktu & Info Kegiatan */}
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Waktu Slot */}
                  <div className="w-32 shrink-0 pt-0.5">
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground whitespace-nowrap block">
                      {slot.timeSlot}
                    </span>
                  </div>

                  {/* Judul & Nama Ormawa */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold truncate block ${
                          isBentrok
                            ? "text-status-cancelled"
                            : isTersedia
                            ? "text-status-done"
                            : isDikunci
                            ? "text-muted line-through"
                            : "text-foreground"
                        }`}
                      >
                        {slot.eventName}
                      </span>
                    </div>

                    {slot.organizationName && (
                      <span className="text-xs text-muted mt-0.5 block truncate">
                        {slot.organizationName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Kolom Status & Aksi Kontrol */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-center">
                  {/* Badge Status */}
                  {isDipesan && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-status-done/10 text-status-done border border-status-done/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-done" />
                      Dipesan
                    </span>
                  )}

                  {isBentrok && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-status-cancelled/10 text-status-cancelled border border-status-cancelled/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-cancelled" />
                      Bentrok
                    </span>
                  )}

                  {isTersedia && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-status-done/10 text-status-done border border-status-done/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-done" />
                      Tersedia
                    </span>
                  )}

                  {isDikunci && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-muted text-muted border border-line">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                      Dikunci
                    </span>
                  )}

                  {/* Tombol Aksi Kontrol */}
                  {!isTersedia && !isDikunci && (
                    <button
                      type="button"
                      onClick={() => onViewDetail(slot)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline cursor-pointer ml-1"
                    >
                      <span>Lihat Detail</span>
                      <span className="text-xs">→</span>
                    </button>
                  )}

                  {isTersedia && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onManualFill(slot)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent hover:bg-accent-hover active:scale-[0.98] text-accent-foreground transition-all cursor-pointer shadow-xs"
                      >
                        + Isi Manual
                      </button>
                      <button
                        type="button"
                        onClick={() => onLockSlot(slot)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-line bg-surface hover:bg-surface-muted text-foreground transition-all cursor-pointer"
                      >
                        Kunci Waktu
                      </button>
                    </div>
                  )}

                  {isDikunci && (
                    <button
                      type="button"
                      onClick={() => onLockSlot(slot)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-line bg-surface hover:bg-surface-muted text-foreground transition-all cursor-pointer"
                    >
                      Buka Kunci
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
