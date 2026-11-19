// [FRONTEND CHANGE START: Log Aktivitas & Audit Pembatalan User - Milestone 1]
"use client";

import React, { useState, useMemo } from "react";
import { ActivityFilterType, AdminActivityLogItem } from "@/types/admin";

interface AdminActivityLogProps {
  logs: AdminActivityLogItem[];
  selectedOrgIds?: string[];
  onSimulateCancel?: () => void;
}

export function AdminActivityLog({
  logs,
  selectedOrgIds,
}: AdminActivityLogProps) {
  const [activeTab, setActiveTab] = useState<ActivityFilterType>("semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logs berdasarkan tab, pencarian, dan filter organisasi
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filter organisasi dari sidebar: jika daftar filter disediakan (bahkan kosong),
      // sembunyikan log jika organisasinya tidak dicentang.
      if (selectedOrgIds !== undefined && log.organizationId) {
        if (!selectedOrgIds.includes(log.organizationId)) {
          return false;
        }
      }

      // Filter tab
      if (activeTab === "booking" && log.type !== "booking") return false;
      if (activeTab === "batal" && log.type !== "batal") return false;

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchOrg = log.organizationName.toLowerCase().includes(query);
        const matchPJ = log.personInCharge.toLowerCase().includes(query);
        const matchTitle = log.eventName.toLowerCase().includes(query);
        const matchDate = log.date.toLowerCase().includes(query);
        const matchTime = log.timeRange.toLowerCase().includes(query);
        if (!matchOrg && !matchPJ && !matchTitle && !matchDate && !matchTime) {
          return false;
        }
      }

      return true;
    });
  }, [logs, activeTab, searchQuery, selectedOrgIds]);

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors flex flex-col h-full">
      {/* Header Log Aktivitas */}
      <div className="pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
        <h2 className="text-sm sm:text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
          Log Aktivitas & Audit Pembatalan User
        </h2>
        <p className="text-xs text-[#62748E] dark:text-[#94A3B8] mt-1">
          Rekam jejak pengisian & pelepasan jadwal mandiri
        </p>
      </div>

      {/* Input Pencarian Organisasi, PJ, atau Tanggal (DMY) */}
      <div className="pt-3 pb-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari organisasi, PJ, atau tanggal (DMY)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] placeholder-[#62748E] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
          />
          <div className="absolute left-3 top-2.5 text-[#62748E] dark:text-[#94A3B8] pointer-events-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-[#62748E] hover:text-[#0F172B] dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs: Semua | Booking Baru | Dibatalkan User */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] dark:border-[#1E293B] pt-1">
        <button
          type="button"
          onClick={() => setActiveTab("semua")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "semua"
              ? "border-[#2563EB] text-[#2563EB] dark:text-[#93C5FD]"
              : "border-transparent text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-white"
          }`}
        >
          Semua
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("booking")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "booking"
              ? "border-[#2563EB] text-[#2563EB] dark:text-[#93C5FD]"
              : "border-transparent text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-white"
          }`}
        >
          Booking Baru
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("batal")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "batal"
              ? "border-[#2563EB] text-[#2563EB] dark:text-[#93C5FD]"
              : "border-transparent text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-white"
          }`}
        >
          Dibatalkan User
        </button>
      </div>

      {/* Daftar Log Aktivitas */}
      <div className="mt-3 space-y-3 flex-1 overflow-y-auto max-h-[520px] pr-1">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#62748E] dark:text-[#94A3B8]">
            Tidak ada aktivitas yang sesuai dengan filter atau pencarian.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isBatal = log.type === "batal";

            return (
              <div
                key={log.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isBatal
                    ? "bg-[#FEF2F2]/60 dark:bg-[#7F1D1D]/15 border-[#FECACA] dark:border-[#991B1B]/40"
                    : "bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B]"
                }`}
              >
                {/* Header Kartu Log */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#E2E8F0]/50 dark:border-[#1E293B]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isBatal ? (
                      <span className="text-xs font-bold text-[#DC2626] dark:text-[#EF4444]">
                        Dibatalkan oleh: {log.organizationName} (PJ: {log.personInCharge})
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                          {log.organizationName}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2563EB]/10 dark:bg-[#93C5FD]/15 text-[#2563EB] dark:text-[#93C5FD] border border-[#2563EB]/20">
                          {log.slotTag}
                        </span>
                      </>
                    )}
                  </div>

                  <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">
                    {log.timestamp}
                  </span>
                </div>

                {/* Body Kartu Log */}
                <div className="mt-2 text-xs">
                  {isBatal && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      <span>{log.slotTag}</span>
                    </div>
                  )}

                  <h3 className="font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                    {log.eventName}
                  </h3>

                  {isBatal ? (
                    <div className="mt-1.5 space-y-1 text-[11px] text-[#314158] dark:text-[#CBD5E1]">
                      <p>
                        <strong className="text-[#62748E] dark:text-[#94A3B8]">Jadwal dilepas:</strong> {log.date} • {log.timeRange}
                      </p>
                      {log.reason && (
                        <p className="bg-white/80 dark:bg-[#111827]/80 p-2 rounded-lg border border-[#E2E8F0]/70 dark:border-[#1E293B] text-[#DC2626] dark:text-[#FCA5A5] italic">
                          <strong className="not-italic text-[#62748E] dark:text-[#94A3B8]">Alasan User:</strong> &ldquo;{log.reason}&rdquo;
                        </p>
                      )}
                      <p className="text-[10px] text-[#62748E] dark:text-[#94A3B8] pt-1">
                        Status: <span className="font-semibold">{log.cancellationStatus || "Pembatalan Mandiri User"}</span> • Waktu batal: {log.timestamp}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] text-[#62748E] dark:text-[#94A3B8]">
                      PJ: <strong className="text-[#0F172B] dark:text-[#F8FAFC]">{log.personInCharge}</strong> · Jadwal: {log.date} ({log.timeRange})
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Log Aktivitas & Audit Pembatalan User - Milestone 1]
