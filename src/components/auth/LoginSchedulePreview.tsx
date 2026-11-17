// [FRONTEND CHANGE START: Revisi UI Pratinjau Jadwal & Interaktivitas Fitur - Milestone 1]
"use client";

import React, { useState } from "react";
import { LOGIN_SCHEDULE_DATA, LOGIN_FEATURE_POINTS } from "@/constants/auth";

export function LoginSchedulePreview() {
  const [selectedDay, setSelectedDay] = useState<"hariIni" | "besok">("hariIni");

  // State dropdown interaktif untuk poin fitur 01-03
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({
    "01": true, // Default terbuka untuk edukasi awal
    "02": false,
    "03": false,
  });

  const toggleFeature = (num: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const schedule = LOGIN_SCHEDULE_DATA[selectedDay];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Main Schedule Preview Card */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs">
        {/* Card Header with Icon & Day Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#E2E8F0]/70">
          <div>
            <div className="flex items-center gap-2">
              {/* Icon Pratinjau Jadwal */}
              <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-[#2563EB]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172B]">
                Pratinjau Jadwal Pemakaian Selasar
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BC7D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BC7D]"></span>
              </span>
              <p className="text-xs text-[#62748E]">
                Pembaruan otomatis · Status jam terisi & kosong {selectedDay === "hariIni" ? "hari ini" : "besok"}
              </p>
            </div>
          </div>

          {/* Day Toggle Buttons */}
          <div className="flex items-center self-start bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setSelectedDay("hariIni")}
              className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${selectedDay === "hariIni"
                ? "bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold"
                : "text-[#62748E] hover:text-[#0F172B] font-medium"
                }`}
              aria-pressed={selectedDay === "hariIni"}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedDay("besok")}
              className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${selectedDay === "besok"
                ? "bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold"
                : "text-[#62748E] hover:text-[#0F172B] font-medium"
                }`}
              aria-pressed={selectedDay === "besok"}
            >
              Besok
            </button>
          </div>
        </div>

        {/* Date Display Row dengan Kotak Berwarna #2563EB */}
        <div className="flex items-center justify-between py-3">
          <span className="text-xs font-semibold text-[#62748E] uppercase tracking-wide">
            Jadwal Tanggal
          </span>
          <span className="text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB] px-3 py-1 rounded-md shadow-2xs">
            {schedule.dateFormatted}
          </span>
        </div>

        {/* Quick Time Slot Status Strip: Rata Kiri + Shape Full Warna Dinamis */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-1.5">
          {schedule.slots.map((slot, index) => {
            const isOccupied = slot.status === "terisi";
            return (
              <div
                key={`slot-chip-${index}`}
                className={`p-2.5 rounded-lg border flex flex-col items-start text-left transition-all ${isOccupied
                  ? "bg-[#FDDF67]/5 border-[#FDDF67]/30"
                  : "bg-[#00BC7D]/5 border-[#00BC7D]/30"
                  }`}
              >
                {/* Waktu Jam (Rata Kiri) */}
                <div className="text-[11px] font-semibold text-[#314158]">
                  {slot.time}
                </div>

                {/* Shape Full Width di Antara Jam dan Status Sesuai Warna */}
                <div
                  className={`w-full h-1.5 rounded-full my-2 ${isOccupied ? "bg-[#FE9A00]" : "bg-[#00BC7D]"
                    }`}
                />

                {/* Status Terisi / Kosong (Rata Kiri) */}
                <div>
                  <span
                    className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${isOccupied
                      ? "bg-[#BB4D00]/15 text-[#BB4D00]"
                      : "bg-[#00BC7D]/15 text-[#00BC7D]"
                      }`}
                  >
                    {isOccupied ? "Terisi" : "Kosong"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Agenda Items List: Kotak Jam Dihapus & Diganti Icon Jam */}
        <div className="mt-3.5 space-y-2">
          {schedule.slots.map((slot, index) => {
            const isOccupied = slot.status === "terisi";
            return (
              <div
                key={`agenda-row-${index}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Jam dengan Icon Jam (Kotak Dihapus) */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#314158] whitespace-nowrap shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-[#2563EB]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6l3 2"
                      />
                    </svg>
                    <span>{slot.time.replace("–", " - ")}</span>
                  </div>

                  <p
                    className={`text-xs truncate ${isOccupied
                      ? "font-medium text-[#0F172B]"
                      : "text-[#62748E] italic"
                      }`}
                  >
                    {slot.agendaTitle}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-md border ${isOccupied
                    ? "bg-[#BB4D00]/10 text-[#BB4D00] border-[#BB4D00]/30"
                    : "bg-[#00BC7D]/10 text-[#00BC7D] border-[#00BC7D]/30"
                    }`}
                >
                  {isOccupied ? "Terisi" : "Kosong"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Three Key System Features: Dropdown Accordion + Border Bawah #2563EB */}
      <div className="space-y-2.5">
        {LOGIN_FEATURE_POINTS.map((feature) => {
          const isOpen = Boolean(expandedFeatures[feature.number]);
          return (
            <div
              key={feature.number}
              className="rounded-xl border border-[#E2E8F0] border-b-2 border-b-[#2563EB] bg-[#FFFFFF] hover:border-b-[#1D4ED8] transition-all overflow-hidden"
            >
              {/* Header Kartu Fitur (Klik untuk Buka/Tutup Dropdown) */}
              <button
                type="button"
                onClick={() => toggleFeature(feature.number)}
                className="w-full flex items-center justify-between gap-3 p-3 text-left cursor-pointer hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 shadow-xs">
                    <span className="text-sm font-bold text-[#2563EB]">
                      {feature.number}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#0F172B]">
                    {feature.title}
                  </h3>
                </div>

                {/* Chevron Dropdown Indicator */}
                <div className="shrink-0 p-1 text-[#62748E]">
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2563EB]" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Isi Dropdown (Hanya Muncul Ketika Kartu Diklik) */}
              {isOpen && feature.description && (
                <div className="px-3.5 pb-3.5 pt-0 ml-10 text-[11px] text-[#62748E] leading-relaxed border-t border-[#E2E8F0]/40 animate-in fade-in duration-150">
                  <p className="pt-2">{feature.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Branding Line */}
      <div className="pt-2 text-xs text-[#62748E] border-t border-[#E2E8F0]/70">
        <p>
          <span className="font-semibold text-[#314158]">SelasarSpace</span> Layanan kampus • Ruang kampus, lebih teratur.
        </p>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Revisi UI Pratinjau Jadwal & Interaktivitas Fitur - Milestone 1]
