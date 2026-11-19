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
    <div className="flex flex-col gap-4 w-full">
      {/* Main Schedule Preview Card */}
      <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-sm transition-all">
        {/* Card Header with Icon & Day Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent">
                <svg
                  className="w-4 h-4"
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
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Pratinjau Ketersediaan Selasar
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-done opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-status-done"></span>
                  </span>
                  <p className="text-xs text-muted">
                    {hasAgendas
                      ? `Sinkronisasi database · ${freeSlots.length} slot kosong & ${occupiedAgendas.length} agenda terisi ${
                          isHariIni ? "hari ini" : isBesok ? "besok" : ""
                        }`
                      : `Sinkronisasi database · Selasar 100% bebas sepanjang hari`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Day Toggle Buttons: Hari Ini & Besok */}
          <div className="flex items-center self-start bg-surface-muted p-1 rounded-xl border border-line">
            <button
              type="button"
              onClick={() => setSelectedDateIso(todayIso)}
              className={`px-3.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isHariIni
                  ? "bg-surface text-accent shadow-xs font-semibold"
                  : "text-muted hover:text-foreground font-medium"
              }`}
              aria-pressed={isHariIni}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateIso(tomorrowIso)}
              className={`px-3.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isBesok
                  ? "bg-surface text-accent shadow-xs font-semibold"
                  : "text-muted hover:text-foreground font-medium"
              }`}
              aria-pressed={isBesok}
            >
              Besok
            </button>
          </div>
        </div>

        {/* Date Display Row dengan Fitur Pilih Tanggal Bebas */}
        <div className="flex items-center justify-between py-3.5 border-b border-line">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Jadwal Tanggal
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
              className="inline-flex items-center gap-2 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/15 border border-accent/30 px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              title="Klik di mana saja untuk memilih tanggal"
            >
              <svg
                className="w-3.5 h-3.5 text-accent shrink-0 pointer-events-none"
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
                className="w-3 h-3 text-accent opacity-60 group-hover:opacity-100 transition-opacity shrink-0 pointer-events-none"
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
        <div className="grid grid-cols-3 gap-2.5 py-3.5 border-b border-line">
          <div className="flex flex-col p-3 rounded-xl bg-surface-muted/60 border border-line transition-colors">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Agenda Aktif
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-foreground mt-1">
              {hasAgendas ? `${occupiedAgendas.length} Kegiatan` : "0 Kegiatan"}
            </span>
            <span className="text-xs text-muted mt-0.5 truncate">
              {hasAgendas ? "Terjadwal di selasar" : "Selasar kosong"}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded-xl bg-surface-muted/60 border border-line transition-colors">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Waktu Terpakai
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-status-expired mt-1">
              {formattedOccupiedHours}
            </span>
            <span className="text-xs text-muted mt-0.5 truncate">
              {hasAgendas ? "Dari 13 jam operasional" : "100% jam tersedia"}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded-xl bg-surface-muted/60 border border-line transition-colors">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Waktu Tersedia
            </span>
            <span className="text-base sm:text-lg font-bold tabular-nums text-status-done mt-1">
              {formattedFreeHours}
            </span>
            <span className="text-xs text-muted mt-0.5 truncate">
              {freeSlots.length > 0 ? `${freeSlots.length} slot bebas` : "Jadwal penuh"}
            </span>
          </div>
        </div>

        {/* 2. DAFTAR SLOT WAKTU KOSONG (TERSEDIA) */}
        <div className="pt-3.5 pb-3">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-done" />
              <h3 className="text-xs font-bold text-foreground">
                Slot Waktu Kosong (Tersedia):
              </h3>
            </div>
            <span className="text-xs text-status-done font-semibold">
              {freeSlots.length} slot bebas diajukan
            </span>
          </div>

          {freeSlots.length > 0 ? (
            <div className="my-1 space-y-1.5">
              {freeSlots.map((slot, index) => (
                <div
                  key={`free-slot-${index}`}
                  className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-surface-muted/30 border border-line/60 hover:bg-surface-muted transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l3 2" />
                      </svg>
                      <span className="font-mono font-bold text-status-done">
                        {slot.time}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/80 truncate">
                      Waktu Bebas Selasar • {slot.durationLabel} ({slot.subtext})
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-done/10 border border-status-done/30 text-status-done">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-done shrink-0" />
                    <span className="text-xs font-semibold">Tersedia</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3 px-3.5 rounded-xl bg-surface-muted text-xs text-muted">
              Tidak ada slot kosong yang tersedia pada rentang 08:00–21:00.
            </div>
          )}
        </div>

        {/* 3. DAFTAR RINCIAN KEGIATAN (TERISI) */}
        <div className="pt-3.5 border-t border-line">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-expired" />
              <h3 className="text-xs font-bold text-foreground">
                Daftar Rincian Kegiatan (Terisi):
              </h3>
            </div>
            <span className="text-xs text-status-expired font-semibold">
              {occupiedAgendas.length} slot terisi
            </span>
          </div>

          {hasAgendas ? (
            <div className="my-1 space-y-1.5">
              {occupiedAgendas.map((agenda, index) => (
                <div
                  key={`${selectedDateIso}-agenda-${index}`}
                  className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-surface-muted/30 border border-line/60 hover:bg-surface-muted transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l3 2" />
                      </svg>
                      <span className="font-mono font-bold text-status-expired">
                        {agenda.time}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/80 truncate">
                      {agenda.agendaTitle}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-expired/10 border border-status-expired/30 text-status-expired">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-expired shrink-0" />
                    <span className="text-xs font-semibold">Terisi</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3 px-3.5 rounded-xl bg-status-done/5 border border-status-done/20 text-xs text-status-done flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-done shrink-0" />
              <span>Tidak ada kegiatan terjadwal pada tanggal ini. Seluruh jam kegiatan bebas dan dapat diajukan.</span>
            </div>
          )}
        </div>
      </div>

      {/* Three Key System Features: Dropdown Accordion */}
      <div className="space-y-2">
        {LOGIN_FEATURE_POINTS.map((feature) => {
          const isOpen = Boolean(expandedFeatures[feature.number]);
          return (
            <div
              key={feature.number}
              className="rounded-xl border border-line bg-surface hover:border-line-hover transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFeature(feature.number)}
                className="w-full flex items-center justify-between gap-3 p-3.5 text-left cursor-pointer hover:bg-surface-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent">
                      {feature.number}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground">
                    {feature.title}
                  </h3>
                </div>

                <div className="shrink-0 p-1 text-muted">
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-accent" : ""
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
                <div className="px-4 pb-3.5 pt-1 ml-10 text-xs text-muted leading-relaxed border-t border-line/50">
                  <p>{feature.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Branding Line */}
      <div className="pt-2 text-xs text-muted border-t border-line flex items-center justify-between">
        <p>
          <span className="font-semibold text-foreground">SelasarSpace</span> • Peminjaman Ruang Terpadu Kampus
        </p>
        <span className="text-muted/70">v1.0 Institutional</span>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Pratinjau Ketersediaan & Jadwal Selasar Sebelum Login]
