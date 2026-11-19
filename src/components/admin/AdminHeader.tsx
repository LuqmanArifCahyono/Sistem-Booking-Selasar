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
    <header className="bg-surface border-b border-line px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20 transition-all">
      {/* Title & Date */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Monitor Jadwal & Kontrol Slot
        </h1>
        <p className="text-xs font-medium text-muted mt-0.5">
          {dateLabel}
        </p>
      </div>

      {/* Action Buttons Top Right */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        {/* Tombol Ekspor Laporan */}
        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-line bg-surface hover:bg-surface-muted active:scale-[0.98] text-foreground transition-all cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Ekspor Laporan</span>
        </button>

        {/* Tombol Tambah Jadwal Manual */}
        <button
          type="button"
          onClick={onOpenManualBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-accent hover:bg-accent-hover active:scale-[0.98] text-accent-foreground shadow-xs transition-all cursor-pointer"
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
