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
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50 text-center py-2 text-xs font-semibold text-gray-600 tracking-wider">
          <span>SENIN</span>
          <span>SELASA</span>
          <span>RABU</span>
          <span>KAMIS</span>
          <span>JUMAT</span>
          <span>SABTU</span>
          <span>MINGGU</span>
        </div>

        {/* Calendar Grid Placeholder */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 border-b border-gray-200 min-h-[420px]">
          {Array.from({ length: 35 }).map((_, i) => {
            const dateNum = i + 1 <= 30 ? i + 1 : i - 29;
            const isRefDate = dateNum === 12;
            return (
              <div
                key={i}
                className="border-r border-b border-gray-100 p-2 text-left relative flex flex-col justify-between hover:bg-gray-50/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      isRefDate
                        ? "w-6 h-6 rounded-full bg-gray-950 text-white flex items-center justify-center font-bold"
                        : "text-gray-500 font-medium"
                    }`}
                  >
                    {dateNum}
                  </span>
                </div>
                {isRefDate && (
                  <div className="mt-1 p-1.5 rounded bg-emerald-50 border-l-3 border-emerald-500 text-[11px] text-emerald-900 leading-tight">
                    <div className="font-semibold truncate">Welcome Party</div>
                    <div className="text-[10px] text-emerald-700">10.00–12.00</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Status Bar */}
        <div className="px-4 py-2 text-xs text-gray-500 flex items-center justify-between border-t border-gray-100 bg-white">
          <span>Area Kalender Bulan ({monthName} {year})</span>
          <span className="text-gray-400">Filter aktif: {activeOrgs.join(", ") || "Semua nonaktif"}</span>
        </div>
      </div>
    );
  }

  // Week View Wireframe Placeholder
  if (currentView === "mingguan") {
    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50/50 text-center py-2 text-xs font-semibold text-gray-600">
          <span className="text-gray-400 font-normal">WIB</span>
          <span>SEN 9</span>
          <span>SEL 10</span>
          <span>RAB 11</span>
          <span className="text-gray-900 font-bold">KAM 12</span>
          <span>JUM 13</span>
          <span>SAB 14</span>
          <span>MIN 15</span>
        </div>

        {/* Hourly Timeslot Placeholder */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 min-h-[420px]">
          {["07.00", "09.00", "11.00", "13.00", "15.00", "17.00", "19.00"].map(
            (time, idx) => (
              <div key={idx} className="grid grid-cols-8 h-16 divide-x divide-gray-100">
                <span className="p-2 text-[11px] text-gray-400 font-mono text-center">
                  {time}
                </span>
                <div className="p-1 col-span-7 flex items-center text-xs text-gray-400 italic pl-3">
                  {idx === 1 && (
                    <div className="w-48 p-2 rounded bg-blue-50 border-l-3 border-blue-500 text-blue-900 text-[11px] not-italic">
                      <div className="font-semibold">Rapat Kerja (Himasifo)</div>
                      <div className="text-[10px] text-blue-700">09.00–11.00 WIB</div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
          Area Kalender Mingguan · 9–15 {monthName} {year}
        </div>
      </div>
    );
  }

  // Day View Wireframe Placeholder
  if (currentView === "harian") {
    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
              {dayName}
            </span>
            <div className="text-2xl font-bold text-gray-950">
              {selectedDate.getDate()} {monthName} {year}
            </div>
          </div>
          <span className="text-xs text-gray-500">
            Tampilan jadwal terperinci harian
          </span>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-gray-500">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
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
          <p className="text-sm font-semibold text-gray-800">
            Placeholder Tampilan Harian
          </p>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            Slot waktu 07.00 s/d 21.00 WIB siap diimplementasikan pada tahap kalender berikutnya.
          </p>
        </div>
      </div>
    );
  }

  // History View Wireframe Placeholder
  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto p-4 sm:p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-950">Histori peminjaman</h3>
        <p className="text-xs text-gray-500 mt-1">
          Rekap seluruh jadwal peminjaman tempat pada bulan {monthName} {year}.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Total peminjaman</span>
          <div className="text-2xl font-bold text-gray-900 mt-2">4</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Selesai</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">2</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Hari ini</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">1</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Terjadwal</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">1</div>
        </div>
      </div>

      {/* Placeholder Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-900">Daftar peminjaman</span>
          <span className="text-gray-500">Urutan: tanggal terbaru</span>
        </div>
        <div className="p-8 text-center text-gray-500 text-xs">
          Placeholder tabel histori peminjaman (siap diisi pada tahap berikutnya).
        </div>
      </div>
    </div>
  );
}
