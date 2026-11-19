"use client";

import React from "react";
import { AdminStats } from "@/types/admin";

interface AdminStatCardsProps {
  stats: AdminStats;
}

export function AdminStatCards({ stats }: AdminStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Slot Kosong Tersedia */}
      <div className="bg-surface border border-line rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Slot Kosong Tersedia
          </span>
          <div className="w-8 h-8 rounded-xl bg-status-done/10 border border-status-done/20 flex items-center justify-center text-status-done shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
            {stats.slotKosong} <span className="text-base font-semibold text-muted">Slot</span>
          </div>
          <p className="text-xs text-muted mt-1 truncate">
            {stats.slotKosongSub}
          </p>
        </div>
      </div>

      {/* Card 2: Jadwal Terisi */}
      <div className="bg-surface border border-line rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Jadwal Terisi
          </span>
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
            {stats.jadwalTerisi} <span className="text-base font-semibold text-muted">Jadwal</span>
          </div>
          <p className="text-xs text-muted mt-1 truncate" title={stats.jadwalTerisiSub}>
            {stats.jadwalTerisiSub}
          </p>
        </div>
      </div>

      {/* Card 3: Pembatalan Periode Ini */}
      <div className="bg-surface border border-line rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Pembatalan Periode Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-status-cancelled/10 border border-status-cancelled/20 flex items-center justify-center text-status-cancelled shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono tabular-nums text-status-cancelled">
            {stats.pembatalanPeriode}
          </div>
          <p className="text-xs text-muted mt-1 truncate">
            {stats.pembatalanSub}
          </p>
        </div>
      </div>

      {/* Card 4: Total Pemakaian Bulan Ini */}
      <div className="bg-surface border border-line rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total Pemakaian Bulan Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
            {stats.totalPemakaian} <span className="text-base font-semibold text-muted">{stats.totalPemakaianUnit}</span>
          </div>
          <p className="text-xs text-muted mt-1 truncate">
            {stats.totalPemakaianSub}
          </p>
        </div>
      </div>
    </div>
  );
}
