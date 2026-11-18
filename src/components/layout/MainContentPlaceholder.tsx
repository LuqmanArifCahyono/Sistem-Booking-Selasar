"use client";

import React from "react";
import { CalendarView, Organization } from "@/types";
import { MONTH_NAMES_ID } from "@/constants";

interface MainContentPlaceholderProps {
  currentView: CalendarView;
  currentDate: Date;
  selectedDate: Date;
  organizations: Organization[];
}

export function MainContentPlaceholder({
  currentView,
  currentDate,
  selectedDate,
  organizations,
}: MainContentPlaceholderProps) {
  const monthName = MONTH_NAMES_ID[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const dayName = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ][selectedDate.getDay()];

  const activeOrgs = organizations.filter((o) => o.checked).map((o) => o.name);

  // Month View Wireframe Placeholder
  if (currentView === "bulan") {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-[#090D16] overflow-hidden transition-colors">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#1E293B] bg-gray-50/50 dark:bg-[#0F172A] text-center py-2 text-xs font-semibold text-gray-600 dark:text-[#94A3B8] tracking-wider">
          <span>SENIN</span>
          <span>SELASA</span>
          <span>RABU</span>
          <span>KAMIS</span>
          <span>JUMAT</span>
          <span>SABTU</span>
          <span>MINGGU</span>
        </div>

        {/* Calendar Grid Placeholder */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 border-b border-gray-200 dark:border-[#1E293B] min-h-[420px]">
          {Array.from({ length: 35 }).map((_, i) => {
            const dateNum = i + 1 <= 30 ? i + 1 : i - 29;
            const isRefDate = dateNum === 12;
            return (
              <div
                key={i}
                className="border-r border-b border-gray-100 dark:border-[#1E293B] p-2 text-left relative flex flex-col justify-between hover:bg-gray-50/40 dark:hover:bg-[#111827]/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      isRefDate
                        ? "w-6 h-6 rounded-full bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] flex items-center justify-center font-bold dark:border dark:border-[#93C5FD]/40"
                        : "text-gray-500 dark:text-[#94A3B8] font-medium"
                    }`}
                  >
                    {dateNum}
                  </span>
                </div>
                {isRefDate && (
                  <div className="mt-1 p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border-l-3 border-emerald-500 text-[11px] text-emerald-900 dark:text-emerald-200 leading-tight">
                    <div className="font-semibold truncate">Welcome Party</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300">10.00–12.00</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Status Bar */}
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-[#94A3B8] flex items-center justify-between border-t border-gray-100 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] transition-colors">
          <span>Area Kalender Bulan ({monthName} {year})</span>
          <span className="text-gray-400 dark:text-[#64748B]">Filter aktif: {activeOrgs.join(", ") || "Semua nonaktif"}</span>
        </div>
      </div>
    );
  }

  // Week View Wireframe Placeholder
  if (currentView === "mingguan") {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-[#090D16] overflow-hidden transition-colors">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-[#1E293B] bg-gray-50/50 dark:bg-[#0F172A] text-center py-2 text-xs font-semibold text-gray-600 dark:text-[#94A3B8]">
          <span className="text-gray-400 dark:text-[#64748B] font-normal">WIB</span>
          <span>SEN 9</span>
          <span>SEL 10</span>
          <span>RAB 11</span>
          <span className="text-gray-900 dark:text-[#F8FAFC] font-bold">KAM 12</span>
          <span>JUM 13</span>
          <span>SAB 14</span>
          <span>MIN 15</span>
        </div>

        {/* Hourly Timeslot Placeholder */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#1E293B] min-h-[420px]">
          {["07.00", "09.00", "11.00", "13.00", "15.00", "17.00", "19.00"].map(
            (time, idx) => (
              <div key={idx} className="grid grid-cols-8 h-16 divide-x divide-gray-100 dark:divide-[#1E293B]">
                <span className="p-2 text-[11px] text-gray-400 dark:text-[#64748B] font-mono text-center">
                  {time}
                </span>
                <div className="p-1 col-span-7 flex items-center text-xs text-gray-400 dark:text-[#64748B] italic pl-3">
                  {idx === 1 && (
                    <div className="w-48 p-2 rounded bg-blue-50 dark:bg-blue-950/60 border-l-3 border-blue-500 text-blue-900 dark:text-blue-200 text-[11px] not-italic">
                      <div className="font-semibold">Rapat Kerja (Himasifo)</div>
                      <div className="text-[10px] text-blue-700 dark:text-[#93C5FD]">09.00–11.00 WIB</div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div className="px-4 py-2 text-xs text-gray-500 dark:text-[#94A3B8] border-t border-gray-100 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
          Area Kalender Mingguan · 9–15 {monthName} {year}
        </div>
      </div>
    );
  }

  // Day View Wireframe Placeholder
  if (currentView === "harian") {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-[#090D16] overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1E293B] bg-gray-50/30 dark:bg-[#0F172A] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-[#94A3B8] tracking-wider uppercase">
              {dayName}
            </span>
            <div className="text-2xl font-bold text-gray-950 dark:text-[#F8FAFC]">
              {selectedDate.getDate()} {monthName} {year}
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-[#94A3B8]">
            Tampilan jadwal terperinci harian
          </span>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-[#94A3B8]">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1E293B] flex items-center justify-center mb-3 text-gray-400 dark:text-[#64748B]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-[#CBD5E1]">
            Placeholder Tampilan Harian
          </p>
          <p className="text-xs text-gray-500 dark:text-[#94A3B8] max-w-sm mt-1">
            Slot waktu 07.00 s/d 21.00 WIB siap diimplementasikan pada tahap kalender berikutnya.
          </p>
        </div>
      </div>
    );
  }

  // History View Wireframe Placeholder
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#090D16] overflow-y-auto p-4 sm:p-6 space-y-6 transition-colors">
      <div>
        <h3 className="text-xl font-bold text-gray-950 dark:text-[#F8FAFC]">Histori peminjaman</h3>
        <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-1">
          Rekap seluruh jadwal peminjaman tempat pada bulan {monthName} {year}.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="border border-gray-200 dark:border-[#1E293B] rounded-xl p-4 bg-white dark:bg-[#111827] shadow-2xs">
          <span className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">Total peminjaman</span>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#F8FAFC] mt-2">4</div>
        </div>
        <div className="border border-gray-200 dark:border-[#1E293B] rounded-xl p-4 bg-white dark:bg-[#111827] shadow-2xs">
          <span className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">Selesai</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">2</div>
        </div>
        <div className="border border-gray-200 dark:border-[#1E293B] rounded-xl p-4 bg-white dark:bg-[#111827] shadow-2xs">
          <span className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">Hari ini</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">1</div>
        </div>
        <div className="border border-gray-200 dark:border-[#1E293B] rounded-xl p-4 bg-white dark:bg-[#111827] shadow-2xs">
          <span className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">Terjadwal</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-[#93C5FD] mt-2">1</div>
        </div>
      </div>

      {/* Placeholder Table */}
      <div className="border border-gray-200 dark:border-[#1E293B] rounded-xl overflow-hidden bg-white dark:bg-[#111827] shadow-2xs">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1E293B] bg-gray-50/50 dark:bg-[#0F172A] flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-900 dark:text-[#F8FAFC]">Daftar peminjaman</span>
          <span className="text-gray-500 dark:text-[#94A3B8]">Urutan: tanggal terbaru</span>
        </div>
        <div className="p-8 text-center text-gray-500 dark:text-[#64748B] text-xs">
          Placeholder tabel histori peminjaman (siap diisi pada tahap berikutnya).
        </div>
      </div>
    </div>
  );
}
