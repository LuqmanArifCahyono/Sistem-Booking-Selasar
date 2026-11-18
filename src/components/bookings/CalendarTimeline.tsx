"use client";

import React from "react";
import { BookingEvent } from "@/types";
import { DAY_NAMES_FULL, MONTH_NAMES_ID } from "@/constants";

interface CalendarTimelineProps {
  dates: Date[];
  events: BookingEvent[];
  selectedDate: Date;
  today: Date;
  onEventClick: (event: BookingEvent) => void;
  mode: "week" | "day";
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 64;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

function sameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.replace(".", ":").split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

function eventPosition(event: BookingEvent) {
  const start = timeToMinutes(event.startTime);
  const end = timeToMinutes(event.endTime);
  const visibleStart = START_HOUR * 60;
  const visibleEnd = END_HOUR * 60;
  const clippedStart = Math.max(start, visibleStart);
  const clippedEnd = Math.min(end, visibleEnd);

  return {
    top: ((clippedStart - visibleStart) / 60) * HOUR_HEIGHT,
    height: Math.max(((clippedEnd - clippedStart) / 60) * HOUR_HEIGHT, 28),
    visible: end > visibleStart && start < visibleEnd && end > start,
  };
}

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function CalendarTimeline({
  dates,
  events,
  selectedDate,
  today,
  onEventClick,
  mode,
}: CalendarTimelineProps) {
  const isWeek = mode === "week";
  const filteredEvents = events.filter((event) =>
    dates.some((date) => dateKey(date) === event.date)
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#090D16] transition-colors">
      <div className="flex-1 min-h-0 overflow-auto">
        <div className={isWeek ? "min-w-[850px]" : "min-w-[420px]"}>
          <div className="sticky top-0 z-20 border-b border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] transition-colors">
            <div
              className="grid"
              style={{ gridTemplateColumns: `68px repeat(${dates.length}, minmax(0, 1fr))` }}
            >
              <div className="h-[58px] flex items-center justify-center border-r border-gray-200 dark:border-[#1E293B] text-[10px] font-medium tracking-wide text-gray-500 dark:text-[#94A3B8]">
                WIB
              </div>
              {dates.map((date) => {
                const selected = sameDay(date, selectedDate);
                const isToday = sameDay(date, today);
                const weekday = DAY_NAMES_FULL[(date.getDay() + 6) % 7];

                return (
                  <div
                    key={dateKey(date)}
                    className={`h-[58px] flex flex-col items-center justify-center gap-0.5 border-r border-gray-200 dark:border-[#1E293B] transition-colors ${
                      selected ? "bg-blue-50/60 dark:bg-blue-950/30" : "bg-white dark:bg-[#0F172A]"
                    }`}
                  >
                    <span className={`text-[10px] font-semibold tracking-wide uppercase ${selected ? "text-gray-950 dark:text-[#F8FAFC]" : "text-gray-500 dark:text-[#94A3B8]"}`}>
                      {weekday.slice(0, 3)}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                        isToday
                          ? selected
                            ? "bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] font-bold ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-[#0F172A] dark:border dark:border-[#93C5FD]/40"
                            : "bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] font-bold dark:border dark:border-[#93C5FD]/40"
                          : selected
                            ? "bg-amber-500 text-white font-semibold"
                            : "text-gray-800 dark:text-[#CBD5E1]"
                      }`}
                      aria-label={`${formatDate(date)}${isToday ? ", hari ini" : ""}${selected ? ", dipilih" : ""}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="grid"
            style={{ gridTemplateColumns: `68px repeat(${dates.length}, minmax(0, 1fr))` }}
            role="group"
            aria-label={isWeek ? "Jadwal satu minggu" : `Jadwal ${formatDate(dates[0])}`}
          >
            <div className="relative border-r border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]" style={{ height: TOTAL_HEIGHT }}>
              {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => {
                const hour = START_HOUR + index;
                return (
                  <div
                    key={hour}
                    className={`absolute left-0 right-0 pr-2 text-right text-[10px] text-gray-500 dark:text-[#94A3B8] ${
                      index === 0
                        ? "translate-y-0"
                        : index === END_HOUR - START_HOUR
                          ? "-translate-y-full"
                          : "-translate-y-1/2"
                    }`}
                    style={{ top: index * HOUR_HEIGHT }}
                  >
                    {String(hour).padStart(2, "0")}.00
                  </div>
                );
              })}
            </div>

            {dates.map((date) => {
              const dayEvents = filteredEvents.filter((event) => event.date === dateKey(date));
              const selected = sameDay(date, selectedDate);
              const isToday = sameDay(date, today);

              return (
                <div
                  key={dateKey(date)}
                  className={`relative border-r border-gray-200 dark:border-[#1E293B] [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_63px,#e5e7eb_63px,#e5e7eb_64px)] dark:[background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_63px,#1e293b_63px,#1e293b_64px)] ${
                    selected ? "bg-blue-50/25 dark:bg-blue-950/20" : isToday ? "bg-gray-50/40 dark:bg-[#0F172A]/40" : "bg-white dark:bg-[#090D16]"
                  }`}
                  style={{
                    height: TOTAL_HEIGHT,
                  }}
                >
                  {dayEvents.map((event) => {
                    const position = eventPosition(event);
                    if (!position.visible) return null;

                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onEventClick(event)}
                        aria-label={`${event.title}, ${event.organizationName}, ${event.startTime} sampai ${event.endTime} WIB`}
                        className={`absolute z-10 left-1 right-1 overflow-hidden rounded-md border p-2 text-left shadow-[0_1px_1px_rgba(15,23,42,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${event.borderClass} ${event.bgClass} ${event.textClass}`}
                        style={{ top: position.top + 2, height: Math.max(position.height - 4, 32) }}
                      >
                        <span className="block truncate text-[11px] font-semibold leading-tight">
                          {event.title}
                        </span>
                        <span className={`mt-0.5 block truncate text-[10px] ${event.subtextClass}`}>
                          {event.organizationName}
                        </span>
                        <span className={`mt-1 block text-[10px] font-medium ${event.subtextClass}`}>
                          {event.startTime}–{event.endTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-gray-100 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-4 py-2 text-xs text-gray-500 dark:text-[#94A3B8] transition-colors">
        <span className="text-gray-600 dark:text-[#CBD5E1]">
          {filteredEvents.length > 0
            ? `${filteredEvents.length} jadwal ditampilkan`
            : isWeek
              ? "Tidak ada jadwal pada minggu ini"
              : "Tidak ada jadwal pada tanggal ini"}
        </span>
        <span className="text-gray-400 dark:text-[#64748B]">{isWeek ? "Tampilan mingguan" : formatDate(dates[0])}</span>
      </footer>
    </div>
  );
}
