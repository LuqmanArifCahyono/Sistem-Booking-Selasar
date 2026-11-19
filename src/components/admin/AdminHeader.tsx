// [FRONTEND CHANGE START: Header Panel Sub-Admin - Milestone 1]
"use client";

import React from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminHeaderProps {
  dateLabel: string; // e.g. "Kamis, 12/11/2026"
  onOpenExport: () => void;
  onOpenManualBooking: () => void;
}

export function AdminHeader({
  dateLabel,
  onOpenExport,
  onOpenManualBooking,
}: AdminHeaderProps) {
  return (
    <header className="bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1E293B] px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20 transition-colors">
      {/* Title & Date */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-[#0F172B] dark:text-[#F8FAFC]">
          Monitor Jadwal & Kontrol Slot
        </h1>
        <p className="text-xs font-medium text-[#62748E] dark:text-[#94A3B8] mt-0.5">
          {dateLabel}
        </p>
      </div>

      {/* Action Buttons Top Right */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">

        {/* Tombol Ekspor Laporan */}
        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <svg className="w-3.5 h-3.5 text-[#62748E] dark:text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Ekspor Laporan</span>
        </button>

        {/* Tombol Tambah Jadwal Manual */}
        <button
          type="button"
          onClick={onOpenManualBooking}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <span>+</span>
          <span>Tambah Jadwal Manual</span>
        </button>

        {/* Theme Toggle */}
        <div className="shrink-0 ml-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
// [FRONTEND CHANGE END: Header Panel Sub-Admin - Milestone 1]
