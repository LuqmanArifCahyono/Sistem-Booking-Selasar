// [FRONTEND CHANGE START: Pratinjau Ketersediaan & Jadwal Selasar Sebelum Login]
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  getScheduleByDate,
  LOGIN_FEATURE_POINTS,
  INDONESIAN_DAY_NAMES,
} from "@/constants/auth";

const getTodayIso = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getTomorrowIso = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function LoginSchedulePreview() {
  const todayIso = useMemo(() => getTodayIso(), []);
  const tomorrowIso = useMemo(() => getTomorrowIso(), []);

  // State tanggal terpilih dalam format ISO (YYYY-MM-DD), default ke Hari Ini
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);
  const [dbBookings, setDbBookings] = useState<Array<{
    id: string;
    startTime: string;
    endTime: string;
    title: string;
    organizationName: string;
  }> | null>(null);

  // Ref untuk input kalender native
  const dateInputRef = useRef<HTMLInputElement>(null);

  // State dropdown interaktif untuk poin fitur 01-03
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({
    "01": true,
    "02": false,
    "03": false,
  });

  const toggleFeature = (num: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  // Muat jadwal riil dari database (endpoint publik /api/bookings)
  useEffect(() => {
    let active = true;
    fetch(`/api/bookings?date=${selectedDateIso}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.ok && Array.isArray(json.data)) {
          setDbBookings(json.data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [selectedDateIso]);

  // Fungsi pembuka kalender dari klik di bagian mana pun pada badge tanggal
  const handleOpenPicker = () => {
    if (dateInputRef.current) {
      try {
        if (typeof dateInputRef.current.showPicker === "function") {
          dateInputRef.current.showPicker();
          return;
        }
      } catch {
        // Fallback jika showPicker tidak didukung peramban lawas
      }
      dateInputRef.current.focus();
    }
  };

  const handleDateChange = (newDateIso: string) => {
    if (!newDateIso) return;
    setSelectedDateIso(newDateIso);
  };

  const isHariIni = selectedDateIso === todayIso;
  const isBesok = selectedDateIso === tomorrowIso;

  // Jadwal fallback atau fallback label
  const fallbackSchedule = getScheduleByDate(selectedDateIso);

  // Format label tanggal terpilih
  const dateFormatted = useMemo(() => {
    const parts = selectedDateIso.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const dateObj = new Date(y, m - 1, d);
        const dayName = INDONESIAN_DAY_NAMES[dateObj.getDay()] || "Hari";
        return `${dayName}, ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
      }
    }
    return fallbackSchedule.dateFormatted;
  }, [selectedDateIso, fallbackSchedule.dateFormatted]);

  // Daftar agenda terisi: gunakan data database jika sudah dimuat
  const occupiedAgendas = useMemo(() => {
    if (dbBookings !== null) {
      return dbBookings.map((b) => ({
        time: `${b.startTime}–${b.endTime}`,
        agendaTitle: `${b.organizationName} — ${b.title}`,
        organization: b.organizationName,
      }));
    }
    return fallbackSchedule.occupiedAgendas;
  }, [dbBookings, fallbackSchedule.occupiedAgendas]);

  const hasAgendas = occupiedAgendas.length > 0;

  // Rentang jam operasional selasar kampus: 08:00 (480 menit) s.d. 21:00 (1260 menit) = 780 menit total
  const DAY_START_MIN = 8 * 60; // 480
  const DAY_END_MIN = 21 * 60; // 1260
  const TOTAL_DAY_MIN = DAY_END_MIN - DAY_START_MIN; // 780

  const parseTimeToMinutes = (t: string): number => {
    if (!t) return 0;
    const parts = t.trim().split(":");
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    }
    return 0;
  };

  const formatMinutesToTimeStr = (m: number): string => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  const formatMinutesFriendly = (minutes: number): string => {
    if (minutes <= 0) return "0 Menit";
    if (minutes < 60) return `${minutes} Menit`;
    const hours = minutes / 60;
    return hours % 1 === 0 ? `${hours} Jam` : `${hours.toFixed(1)} Jam`;
  };

  // Segmen waktu terisi
  const timelineSegments = occupiedAgendas.map((agenda) => {
    const [startStr, endStr] = agenda.time.split(/[-–]/);
    const startMin = Math.max(DAY_START_MIN, Math.min(DAY_END_MIN, parseTimeToMinutes(startStr)));
    const endMin = Math.max(DAY_START_MIN, Math.min(DAY_END_MIN, parseTimeToMinutes(endStr)));
    const duration = Math.max(0, endMin - startMin);

    return {
      time: agenda.time,
      title: agenda.agendaTitle,
      startMin,
      endMin,
      duration,
    };
  });

  const totalOccupiedMinutes = timelineSegments.reduce((acc, seg) => acc + seg.duration, 0);
  const formattedOccupiedHours = formatMinutesFriendly(totalOccupiedMinutes);

  // Menghitung seluruh slot waktu kosong (tersedia) di antara 08:00 - 21:00
  const calculateFreeSlots = () => {
    if (timelineSegments.length === 0) {
      return [
        {
          time: "08:00–21:00",
          durationMin: TOTAL_DAY_MIN,
          durationLabel: "13 Jam Bebas",
          subtext: "Sepanjang Hari Bebas",
        },
      ];
    }

    const sorted = [...timelineSegments].sort((a, b) => a.startMin - b.startMin);
    const slots: Array<{
      time: string;
      durationMin: number;
      durationLabel: string;
      subtext: string;
    }> = [];

    // 1. Sebelum agenda pertama
    if (sorted[0].startMin > DAY_START_MIN) {
      const dur = sorted[0].startMin - DAY_START_MIN;
      slots.push({
        time: `${formatMinutesToTimeStr(DAY_START_MIN)}–${formatMinutesToTimeStr(sorted[0].startMin)}`,
        durationMin: dur,
        durationLabel: formatMinutesFriendly(dur),
        subtext: "Pagi Hari",
      });
    }

    // 2. Di antara agenda
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].endMin;
      const nextStart = sorted[i + 1].startMin;
      if (nextStart > currentEnd) {
        const dur = nextStart - currentEnd;
        slots.push({
          time: `${formatMinutesToTimeStr(currentEnd)}–${formatMinutesToTimeStr(nextStart)}`,
          durationMin: dur,
          durationLabel: formatMinutesFriendly(dur),
          subtext: "Sela Agenda",
        });
      }
    }

    // 3. Setelah agenda terakhir hingga 21:00
    const lastEnd = sorted[sorted.length - 1].endMin;
    if (lastEnd < DAY_END_MIN) {
      const dur = DAY_END_MIN - lastEnd;
      slots.push({
        time: `${formatMinutesToTimeStr(lastEnd)}–${formatMinutesToTimeStr(DAY_END_MIN)}`,
        durationMin: dur,
        durationLabel: formatMinutesFriendly(dur),
        subtext: "Sore/Malam Hari",
      });
    }

    return slots;
  };

  const freeSlots = calculateFreeSlots();
  const totalFreeMinutes = freeSlots.reduce((acc, s) => acc + s.durationMin, 0);
  const formattedFreeHours = formatMinutesFriendly(totalFreeMinutes);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Main Schedule Preview Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        {/* Card Header with Icon & Day Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 border border-[#2563EB]/20 dark:border-[#93C5FD]/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-[#2563EB] dark:text-[#93C5FD]"
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
              <h2 className="text-base sm:text-lg font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Pratinjau Ketersediaan Selasar
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BC7D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BC7D]"></span>
              </span>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
                {hasAgendas
                  ? `Sinkronisasi database · ${freeSlots.length} slot kosong & ${occupiedAgendas.length} agenda terisi ${
                      isHariIni ? "hari ini" : isBesok ? "besok" : ""
                    }`
                  : `Sinkronisasi database · Selasar 100% bebas sepanjang hari`}
              </p>
            </div>
          </div>

          {/* Day Toggle Buttons: Hari Ini & Besok */}
          <div className="flex items-center self-start bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={() => setSelectedDateIso(todayIso)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isHariIni
                  ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#93C5FD] shadow-xs font-semibold"
                  : "text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-[#F8FAFC] font-medium"
              }`}
              aria-pressed={isHariIni}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateIso(tomorrowIso)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isBesok
                  ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#93C5FD] shadow-xs font-semibold"
                  : "text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-[#F8FAFC] font-medium"
              }`}
              aria-pressed={isBesok}
            >
              Besok
            </button>
          </div>
        </div>

        {/* Date Display Row dengan Fitur Pilih Tanggal Bebas */}
        <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wide">
              Jadwal Tanggal
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8]/80 font-normal hidden sm:inline">
              (Klik tanggal untuk pilih kalender)
            </span>
          </div>

          {/* Interactive Date Picker Badge */}
          <div className="relative inline-flex items-center">
            <div
              role="button"
              tabIndex={0}
              onClick={handleOpenPicker}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenPicker();
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] dark:text-[#93C5FD] bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 hover:bg-[#2563EB]/15 dark:hover:bg-[#93C5FD]/20 border border-[#2563EB] dark:border-[#93C5FD]/40 px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              title="Klik di mana saja untuk memilih tanggal"
            >
              <svg
                className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#93C5FD] shrink-0 pointer-events-none"
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
              <span className="pointer-events-none">{dateFormatted}</span>
              <svg
                className="w-3 h-3 text-[#2563EB] dark:text-[#93C5FD] opacity-60 group-hover:opacity-100 transition-opacity shrink-0 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Native Date Picker Input */}
            <input
              ref={dateInputRef}
              id="login-schedule-datepicker"
              type="date"
              value={selectedDateIso}
              onChange={(e) => handleDateChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* 1. RINGKASAN CEPAT KETERSEDIAAN */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 py-3 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div className="flex flex-col p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors">
            <span className="text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Agenda Aktif
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172B] dark:text-[#F8FAFC] mt-0.5">
              {hasAgendas ? `${occupiedAgendas.length} Kegiatan` : "0 Kegiatan"}
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 truncate">
              {hasAgendas ? "Terjadwal di selasar" : "Selasar kosong"}
            </span>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors">
            <span className="text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Waktu Terpakai
            </span>
            <span className="text-sm sm:text-base font-bold text-[#BB4D00] dark:text-[#FE9A00] mt-0.5">
              {formattedOccupiedHours}
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 truncate">
              {hasAgendas ? "Dari 13 jam operasional" : "100% jam tersedia"}
            </span>
          </div>

          <div className="flex flex-col p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors">
            <span className="text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Waktu Tersedia
            </span>
            <span className="text-sm sm:text-base font-bold text-[#008A5B] dark:text-[#00E599] mt-0.5">
              {formattedFreeHours}
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 truncate">
              {freeSlots.length > 0 ? `${freeSlots.length} slot kosong bebas` : "Jadwal penuh"}
            </span>
          </div>
        </div>

        {/* 2. DAFTAR SLOT WAKTU KOSONG (TERSEDIA) */}
        <div className="pt-3 pb-3">
          <div className="flex items-center justify-between pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00BC7D]" />
              <h3 className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Slot Waktu Kosong (Tersedia):
              </h3>
            </div>
            <span className="text-[11px] text-[#008A5B] dark:text-[#00E599] font-semibold">
              {freeSlots.length} slot bebas diajukan
            </span>
          </div>

          {freeSlots.length > 0 ? (
            <div className="my-1 space-y-1">
              {freeSlots.map((slot, index) => (
                <div
                  key={`free-slot-${index}`}
                  className="flex items-center justify-between gap-3 py-2 px-2.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#62748E] dark:text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l3 2" />
                      </svg>
                      <span className="font-bold text-[#008A5B] dark:text-[#00E599]">
                        {slot.time}
                      </span>
                    </div>

                    <p className="text-xs text-[#314158] dark:text-[#CBD5E1] truncate font-normal">
                      Waktu Bebas Selasar — {slot.durationLabel} ({slot.subtext})
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00BC7D]/10 dark:bg-[#00BC7D]/15 border border-[#00BC7D]/30 text-[#008A5B] dark:text-[#00E599]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BC7D] shrink-0" />
                    <span className="text-[11px] font-bold">Tersedia</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2.5 px-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] text-xs text-[#62748E] dark:text-[#94A3B8]">
              Tidak ada slot kosong yang tersedia pada rentang 08:00–21:00.
            </div>
          )}
        </div>

        {/* 3. DAFTAR RINCIAN KEGIATAN (TERISI) */}
        <div className="pt-3 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div className="flex items-center justify-between pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FE9A00]" />
              <h3 className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Daftar Rincian Kegiatan (Terisi):
              </h3>
            </div>
            <span className="text-[11px] text-[#BB4D00] dark:text-[#FE9A00] font-semibold">
              {occupiedAgendas.length} slot terisi
            </span>
          </div>

          {hasAgendas ? (
            <div className="my-1 space-y-1">
              {occupiedAgendas.map((agenda, index) => (
                <div
                  key={`${selectedDateIso}-agenda-${index}`}
                  className="flex items-center justify-between gap-3 py-2 px-2.5 rounded-lg hover:bg-[#F1F5F9]/70 dark:hover:bg-[#1E293B]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#62748E] dark:text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l3 2" />
                      </svg>
                      <span className="font-bold text-[#BB4D00] dark:text-[#FE9A00]">
                        {agenda.time}
                      </span>
                    </div>

                    <p className="text-xs text-[#314158] dark:text-[#CBD5E1] truncate font-normal">
                      {agenda.agendaTitle}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FE9A00]/10 dark:bg-[#FE9A00]/15 border border-[#FE9A00]/30 text-[#BB4D00] dark:text-[#FE9A00]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE9A00] shrink-0" />
                    <span className="text-[11px] font-bold">Terisi</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2.5 px-3 rounded-lg bg-[#00BC7D]/5 dark:bg-[#00BC7D]/10 text-xs text-[#008A5B] dark:text-[#00E599] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00BC7D]" />
              <span>Tidak ada kegiatan terjadwal pada tanggal ini. Seluruh jam kegiatan bebas dan dapat diajukan.</span>
            </div>
          )}
        </div>
      </div>

      {/* Three Key System Features: Dropdown Accordion */}
      <div className="space-y-2.5">
        {LOGIN_FEATURE_POINTS.map((feature) => {
          const isOpen = Boolean(expandedFeatures[feature.number]);
          return (
            <div
              key={feature.number}
              className="rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] border-b-2 border-b-[#2563EB] dark:border-b-[#93C5FD]/50 bg-[#FFFFFF] dark:bg-[#111827] hover:border-b-[#1D4ED8] dark:hover:border-b-[#93C5FD] transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFeature(feature.number)}
                className="w-full flex items-center justify-between gap-3 p-3 text-left cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 border border-[#2563EB]/20 dark:border-[#93C5FD]/20 flex items-center justify-center shrink-0 shadow-xs">
                    <span className="text-sm font-bold text-[#2563EB] dark:text-[#93C5FD]">
                      {feature.number}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                    {feature.title}
                  </h3>
                </div>

                <div className="shrink-0 p-1 text-[#62748E] dark:text-[#94A3B8]">
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#2563EB] dark:text-[#93C5FD]" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && feature.description && (
                <div className="px-3.5 pb-3.5 pt-0 ml-10 text-[11px] text-[#62748E] dark:text-[#94A3B8] leading-relaxed border-t border-[#E2E8F0]/40 dark:border-[#1E293B] animate-in fade-in duration-150">
                  <p className="pt-2">{feature.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Branding Line */}
      <div className="pt-2 text-xs text-[#62748E] dark:text-[#94A3B8] border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
        <p>
          <span className="font-semibold text-[#314158] dark:text-[#CBD5E1]">SelasarSpace</span> Layanan kampus • Ruang kampus, lebih teratur.
        </p>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Pratinjau Ketersediaan & Jadwal Selasar Sebelum Login]
