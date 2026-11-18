// [FRONTEND CHANGE START: Visual Timeline Bar & Ringkasan Ketersediaan Selasar - Milestone 1 Revisi 6]
"use client";

import React, { useState, useRef } from "react";
import {
  getScheduleByDate,
  DEFAULT_TODAY_ISO,
  DEFAULT_TOMORROW_ISO,
  LOGIN_FEATURE_POINTS,
} from "@/constants/auth";

export function LoginSchedulePreview() {
  // State tanggal terpilih dalam format ISO (YYYY-MM-DD), default ke Hari Ini (2026-11-12)
  const [selectedDateIso, setSelectedDateIso] = useState<string>(DEFAULT_TODAY_ISO);

  // Ref untuk input kalender native
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  // Penanganan perubahan tanggal ketika user memilih tanggal di popup kalender
  const handleDateChange = (newDateIso: string) => {
    if (!newDateIso) return;
    setSelectedDateIso(newDateIso);
  };

  // Cek apakah tanggal saat ini adalah "Hari Ini", "Besok", atau tanggal custom pilihan user
  const isHariIni = selectedDateIso === DEFAULT_TODAY_ISO;
  const isBesok = selectedDateIso === DEFAULT_TOMORROW_ISO;

  // Mengambil jadwal yang sesuai dengan tanggal terpilih secara dinamis (Hanya jam terisi)
  const schedule = getScheduleByDate(selectedDateIso);
  const hasAgendas = schedule.occupiedAgendas.length > 0;

  // --- LOGIKA PERHITUNGAN TIMELINE BAR & RINGKASAN KETERSEDIAAN ---
  // Rentang jam operasional: 08:00 (480 menit) s.d. 18:00 (1080 menit) = 600 menit total
  const DAY_START_MIN = 8 * 60; // 480
  const DAY_END_MIN = 18 * 60; // 1080
  const TOTAL_DAY_MIN = DAY_END_MIN - DAY_START_MIN; // 600

  // Helper konversi string format "HH:MM" menjadi menit sejak tengah malam
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

  // Helper format durasi menit menjadi jam (misal: "2.5 Jam" atau "5 Jam")
  const formatMinutesToHours = (minutes: number): string => {
    if (minutes <= 0) return "0 Jam";
    const hours = minutes / 60;
    return hours % 1 === 0 ? `${hours} Jam` : `${hours.toFixed(1)} Jam`;
  };

  // Menghitung segmen waktu terisi untuk visual timeline bar (08:00 - 18:00)
  const timelineSegments = schedule.occupiedAgendas.map((agenda) => {
    const [startStr, endStr] = agenda.time.split(/[-–]/);
    const startMin = Math.max(DAY_START_MIN, Math.min(DAY_END_MIN, parseTimeToMinutes(startStr)));
    const endMin = Math.max(DAY_START_MIN, Math.min(DAY_END_MIN, parseTimeToMinutes(endStr)));
    const duration = Math.max(0, endMin - startMin);
    const leftPct = ((startMin - DAY_START_MIN) / TOTAL_DAY_MIN) * 100;
    const widthPct = Math.max(1.5, (duration / TOTAL_DAY_MIN) * 100);

    return {
      time: agenda.time,
      title: agenda.agendaTitle,
      startMin,
      endMin,
      duration,
      leftPct,
      widthPct,
    };
  });

  // Total durasi waktu terisi dalam menit & jam
  const totalOccupiedMinutes = timelineSegments.reduce((acc, seg) => acc + seg.duration, 0);
  const formattedOccupiedHours = formatMinutesToHours(totalOccupiedMinutes);

  // Menghitung slot waktu bebas terbaik (gap bebas terbesar di antara 08:00 - 18:00)
  const calculateBestFreeSlot = () => {
    if (timelineSegments.length === 0) {
      return {
        time: "Sepanjang Hari",
        subtext: "10 Jam Bebas (08:00–18:00)",
        label: "Sepanjang hari bebas tanpa agenda terisi",
      };
    }

    const sorted = [...timelineSegments].sort((a, b) => a.startMin - b.startMin);
    let maxGap = 0;
    let gapStart = DAY_START_MIN;
    let gapEnd = DAY_START_MIN;

    // Cek jeda sebelum agenda pertama (08:00 s.d. agenda pertama)
    if (sorted[0].startMin > DAY_START_MIN) {
      const gap = sorted[0].startMin - DAY_START_MIN;
      if (gap > maxGap) {
        maxGap = gap;
        gapStart = DAY_START_MIN;
        gapEnd = sorted[0].startMin;
      }
    }

    // Cek jeda antar agenda
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].endMin;
      const nextStart = sorted[i + 1].startMin;
      if (nextStart > currentEnd) {
        const gap = nextStart - currentEnd;
        if (gap > maxGap) {
          maxGap = gap;
          gapStart = currentEnd;
          gapEnd = nextStart;
        }
      }
    }

    // Cek jeda setelah agenda terakhir hingga jam operasional tutup (18:00)
    const lastEnd = sorted[sorted.length - 1].endMin;
    if (lastEnd < DAY_END_MIN) {
      const gap = DAY_END_MIN - lastEnd;
      if (gap > maxGap) {
        maxGap = gap;
        gapStart = lastEnd;
        gapEnd = DAY_END_MIN;
      }
    }

    if (maxGap <= 0) {
      return {
        time: "Jadwal Penuh",
        subtext: "Cek tanggal lain",
        label: "Seluruh jam operasional terisi",
      };
    }

    const formatMin = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    };

    const timeStr = `${formatMin(gapStart)}–${formatMin(gapEnd)}`;
    const gapHours = formatMinutesToHours(maxGap);

    return {
      time: timeStr,
      subtext: `${gapHours} bebas tersedia`,
      label: `Waktu bebas terbaik: ${timeStr} (${gapHours})`,
    };
  };

  const bestFreeSlot = calculateBestFreeSlot();

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Main Schedule Preview Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        {/* Card Header with Icon & Day Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2">
              {/* Icon Pratinjau Jadwal dengan Biru Soft di Dark Mode */}
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
                Pratinjau Jam Terisi Selasar
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BC7D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BC7D]"></span>
              </span>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
                {hasAgendas
                  ? `Pembaruan otomatis · Menampilkan ${schedule.occupiedAgendas.length} agenda terisi ${isHariIni ? "hari ini" : isBesok ? "besok" : `(${schedule.dayLabel})`
                  }`
                  : `Pembaruan otomatis · Tidak ada agenda terisi (${schedule.dayLabel}) · Selasar Bebas`}
              </p>
            </div>
          </div>

          {/* Day Toggle Buttons: Hari Ini & Besok dengan Teks Biru Soft di Dark Mode */}
          <div className="flex items-center self-start bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={() => setSelectedDateIso(DEFAULT_TODAY_ISO)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${isHariIni
                ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#93C5FD] shadow-xs font-semibold"
                : "text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-[#F8FAFC] font-medium"
                }`}
              aria-pressed={isHariIni}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateIso(DEFAULT_TOMORROW_ISO)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${isBesok
                ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#93C5FD] shadow-xs font-semibold"
                : "text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-[#F8FAFC] font-medium"
                }`}
              aria-pressed={isBesok}
            >
              Besok
            </button>
          </div>
        </div>

        {/* Date Display Row dengan Fitur Pilih Tanggal Bebas & Aksen Biru Soft di Dark Mode */}
        <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wide">
              Jadwal Tanggal
            </span>
          </div>

          {/* Interactive Date Picker Badge dengan Biru Soft di Dark Mode */}
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
              {/* Icon Kalender */}
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

              {/* Teks Tanggal Terpilih */}
              <span className="pointer-events-none">{schedule.dateFormatted}</span>

              {/* Chevron Icon Indicator */}
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
              onInput={(e) => handleDateChange((e.target as HTMLInputElement).value)}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* 1. RINGKASAN CEPAT KETERSEDIAAN (Quick Availability Stat) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 py-3 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          {/* Stat 1: Agenda Aktif */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors">
            <span className="text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Agenda Aktif
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172B] dark:text-[#F8FAFC] mt-0.5">
              {hasAgendas ? `${schedule.occupiedAgendas.length} Kegiatan` : "0 Kegiatan"}
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 truncate">
              {hasAgendas ? "Terjadwal di selasar" : "Selasar bebas"}
            </span>
          </div>

          {/* Stat 2: Total Waktu Terisi */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors">
            <span className="text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Waktu Terpakai
            </span>
            <span className="text-sm sm:text-base font-bold text-[#BB4D00] dark:text-[#FE9A00] mt-0.5">
              {formattedOccupiedHours}
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 truncate">
              {hasAgendas ? "Dari 10 jam operasional" : "100% jam tersedia"}
            </span>
          </div>

          {/* Stat 3: Slot Bebas Ideal */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors">
            <span className="text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Slot Bebas Ideal
            </span>
            <span
              className="text-xs sm:text-sm font-bold text-[#008A5B] dark:text-[#00E599] mt-0.5 truncate"
              title={bestFreeSlot.label}
            >
              {bestFreeSlot.time}
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 truncate">
              {bestFreeSlot.subtext}
            </span>
          </div>
        </div>

        {/* KONDISI 1: JIKA ADA KEGIATAN TERISI */}
        {hasAgendas ? (
          <>
            {/* Header Rincian Agenda Terisi */}
            <div className="flex items-center justify-between pt-3 pb-1">
              <span className="text-xs font-semibold text-[#62748E] dark:text-[#94A3B8]">
                Daftar Rincian Kegiatan:
              </span>
              <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]/80">
                {schedule.occupiedAgendas.length} slot terisi
              </span>
            </div>

            {/* Detailed Agenda Items List: Bersih tanpa border/kotak di semua mode, memanjang ke bawah secara dinamis */}
            <div className="my-1 space-y-1">
              {schedule.occupiedAgendas.map((agenda, index) => (
                <div
                  key={`${selectedDateIso}-agenda-${index}`}
                  className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-[#F1F5F9]/70 dark:hover:bg-[#1E293B]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Waktu Kegiatan dengan Icon Jam (Teks Netral Bersih Tanpa Aksen Biru) */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172B] dark:text-[#F8FAFC] whitespace-nowrap shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#62748E] dark:text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6l3 2"
                        />
                      </svg>
                      <span>{agenda.time}</span>
                    </div>

                    {/* Judul Kegiatan Ormawa */}
                    <p className="text-xs text-[#314158] dark:text-[#CBD5E1] truncate font-normal">
                      {agenda.agendaTitle}
                    </p>
                  </div>

                  {/* Badge Penanda Terisi Kuning / Amber (Tetap Ada di Semua Theme) */}
                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FE9A00]/10 dark:bg-[#FE9A00]/15 border border-[#FE9A00]/30 text-[#BB4D00] dark:text-[#FE9A00]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE9A00] shrink-0" />
                    <span className="text-[11px] font-bold">Terisi</span>
                  </div>
                </div>
              ))}
            </div>

            {/* UI LAIN PENGGANTI BAGIAN KOSONG: Banner Edukasi Ketersediaan Jam Bebas */}
            <div className="mt-3 p-3 rounded-xl border border-[#00BC7D]/30 dark:border-[#00BC7D]/40 bg-[#00BC7D]/5 dark:bg-[#00BC7D]/10 flex items-start gap-2.5 transition-colors">
              <svg
                className="w-4 h-4 text-[#00BC7D] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-xs">
                <span className="font-bold text-[#008A5B] dark:text-[#00E599]">
                  Sisa Jam Lainnya Kosong:
                </span>
                <span className="text-[#314158] dark:text-[#CBD5E1] ml-1">
                  Di luar jam terisi di atas, seluruh waktu selasar pada tanggal ini bebas dan dapat diajukan oleh ormawa Anda.
                </span>
              </div>
            </div>
          </>
        ) : (
          /* KONDISI 2: JIKA TIDAK ADA KEGIATAN SAMA SEKALI -> Ganti dengan UI Khusus Bebas Selasar */
          <div className="my-4 p-6 rounded-xl border border-[#00BC7D]/30 dark:border-[#00BC7D]/40 bg-[#00BC7D]/5 dark:bg-[#00BC7D]/10 flex flex-col items-center justify-center text-center gap-2.5 transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#00BC7D]/15 dark:bg-[#00BC7D]/25 border border-[#00BC7D]/30 flex items-center justify-center text-[#00BC7D]">
              <svg
                className="w-6 h-6 text-[#00BC7D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Selasar Kosong Sepanjang Hari
              </h3>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8] mt-1 max-w-md">
                Tidak ada agenda pemakaian selasar yang terdaftar pada {schedule.dateFormatted}. Seluruh jam kegiatan bebas dan terbuka untuk pengajuan baru ormawa Anda.
              </p>
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#00BC7D]/15 dark:bg-[#00BC7D]/25 text-[#008A5B] dark:text-[#00E599] border border-[#00BC7D]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BC7D] animate-ping" />
                100% Waktu Tersedia untuk Diajukan
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Three Key System Features: Dropdown Accordion + Biru Soft di Dark Mode */}
      <div className="space-y-2.5">
        {LOGIN_FEATURE_POINTS.map((feature) => {
          const isOpen = Boolean(expandedFeatures[feature.number]);
          return (
            <div
              key={feature.number}
              className="rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] border-b-2 border-b-[#2563EB] dark:border-b-[#93C5FD]/50 bg-[#FFFFFF] dark:bg-[#111827] hover:border-b-[#1D4ED8] dark:hover:border-b-[#93C5FD] transition-all overflow-hidden"
            >
              {/* Header Kartu Fitur */}
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

                {/* Chevron Dropdown Indicator dengan Biru Soft di Dark Mode */}
                <div className="shrink-0 p-1 text-[#62748E] dark:text-[#94A3B8]">
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2563EB] dark:text-[#93C5FD]" : ""
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

              {/* Isi Dropdown */}
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
// [FRONTEND CHANGE END: Visual Timeline Bar & Ringkasan Ketersediaan Selasar - Milestone 1 Revisi 6]
