// [FRONTEND CHANGE START: Linimasa Jadwal & Kontrol Slot Panel Sub-Admin - Milestone 1]
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
    <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors flex flex-col h-full">
      {/* Header Linimasa */}
      <div className="pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
        <h2 className="text-sm sm:text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
          Linimasa Jadwal & Kontrol Slot (08.00 - 20.00 WIB)
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-[#62748E] dark:text-[#94A3B8] mt-1 flex-wrap">
          <span>Menampilkan jadwal tanggal {dateFormatted}</span>
          <span>•</span>
          <span className="text-[#BB4D00] dark:text-[#FE9A00] font-medium">
            Pembatalan jadwal hanya dilakukan oleh akun user
          </span>
        </div>
      </div>

      {/* Daftar Slot Waktu Linimasa */}
      {slots.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
          <div className="w-10 h-10 rounded-full bg-[#E2E8F0]/70 dark:bg-[#1E293B] flex items-center justify-center text-[#62748E] dark:text-[#94A3B8] mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC]">
            Tidak ada jadwal kegiatan yang cocok
          </p>
          <p className="text-[11px] text-[#62748E] dark:text-[#94A3B8] mt-1 max-w-sm">
            Silakan aktifkan kembali checklist Penyelenggara Event di sidebar atau pilih tanggal lainnya.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E2E8F0]/70 dark:divide-[#1E293B] flex-1">
          {slots.map((slot) => {
          const isBentrok = slot.status === "bentrok";
          const isTersedia = slot.status === "tersedia";
          const isDikunci = slot.status === "dikunci";
          const isDipesan = slot.status === "dipesan";

          return (
            <div
              key={slot.id}
              className={`py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isBentrok
                  ? "bg-red-50/50 dark:bg-red-950/20"
                  : isTersedia
                  ? "bg-emerald-50/40 dark:bg-emerald-950/15"
                  : isDikunci
                  ? "bg-gray-100/60 dark:bg-gray-800/20 opacity-75"
                  : "hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/40"
              }`}
            >
              {/* Kolom Waktu & Info Kegiatan */}
              <div className="flex items-start gap-4 min-w-0">
                {/* Waktu Slot */}
                <div className="w-32 shrink-0 pt-0.5">
                  <span className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC] whitespace-nowrap block">
                    {slot.timeSlot}
                  </span>
                </div>

                {/* Judul & Nama Ormawa */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold truncate block ${
                        isBentrok
                          ? "text-[#DC2626] dark:text-[#EF4444]"
                          : isTersedia
                          ? "text-[#008A5B] dark:text-[#00E599]"
                          : isDikunci
                          ? "text-[#62748E] dark:text-[#94A3B8] line-through"
                          : "text-[#0F172B] dark:text-[#F8FAFC]"
                      }`}
                    >
                      {slot.eventName}
                    </span>
                  </div>

                  {slot.organizationName && (
                    <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 block truncate">
                      {slot.organizationName}
                    </span>
                  )}
                </div>
              </div>

              {/* Kolom Status & Aksi Kontrol */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-center">
                {/* Badge Status */}
                {isDipesan && (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Dipesan
                  </span>
                )}

                {isBentrok && (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                    Bentrok
                  </span>
                )}

                {isTersedia && (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Tersedia
                  </span>
                )}

                {isDikunci && (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                    Dikunci
                  </span>
                )}

                {/* Tombol Aksi Kontrol */}
                {!isTersedia && !isDikunci && (
                  <button
                    type="button"
                    onClick={() => onViewDetail(slot)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#93C5FD] hover:underline cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <span className="text-[10px]">›</span>
                  </button>
                )}

                {isTersedia && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onManualFill(slot)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors cursor-pointer"
                    >
                      + Isi Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => onLockSlot(slot)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                    >
                      Kunci waktu
                    </button>
                    <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] font-mono hidden md:inline">
                      {slot.rawTime}
                    </span>
                  </div>
                )}

                {isDikunci && (
                  <button
                    type="button"
                    onClick={() => onLockSlot(slot)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded border border-gray-300 dark:border-gray-700 text-[#314158] dark:text-[#CBD5E1] hover:bg-white transition-colors cursor-pointer"
                  >
                    Buka kunci
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
// [FRONTEND CHANGE END: Linimasa Jadwal & Kontrol Slot Panel Sub-Admin - Milestone 1]
