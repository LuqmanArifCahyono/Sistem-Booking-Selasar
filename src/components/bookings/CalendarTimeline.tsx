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
    height: Math.max(((clippedEnd - clippedStart) / 60) * HOUR_HEIGHT, 32),
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
    <div className="flex-1 min-h-0 flex flex-col bg-background transition-colors select-none">
      <div className="flex-1 min-h-0 overflow-auto">
        <div className={isWeek ? "min-w-[850px]" : "min-w-[420px]"}>
          {/* Sticky Header with Day Columns */}
          <div className="sticky top-0 z-20 border-b border-line bg-surface transition-colors">
            <div
              className="grid"
              style={{ gridTemplateColumns: `72px repeat(${dates.length}, minmax(0, 1fr))` }}
            >
              <div className="h-[60px] flex items-center justify-center border-r border-line text-xs font-mono font-medium tracking-wider text-muted">
                WIB
              </div>
              {dates.map((date) => {
                const selected = sameDay(date, selectedDate);
                const isToday = sameDay(date, today);
                const weekday = DAY_NAMES_FULL[(date.getDay() + 6) % 7];

                return (
                  <div
                    key={dateKey(date)}
                    className={`h-[60px] flex flex-col items-center justify-center gap-1 border-r border-line transition-colors ${
                      selected ? "bg-accent/5 dark:bg-accent/15" : "bg-surface"
                    }`}
                  >
                    <span className={`text-[11px] font-semibold tracking-wider uppercase ${selected ? "text-accent" : "text-muted"}`}>
                      {weekday.slice(0, 3)}
                    </span>
                    <span
                      className={`inline-flex min-w-6 h-6 px-1.5 items-center justify-center text-xs rounded-control ${
                        isToday
                          ? "bg-accent text-white font-bold shadow-xs"
                          : selected
                            ? "bg-foreground text-background font-bold"
                            : "text-foreground/80 font-medium"
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

          {/* Timeline Grid */}
          <div
            className="grid"
            style={{ gridTemplateColumns: `72px repeat(${dates.length}, minmax(0, 1fr))` }}
            role="group"
            aria-label={isWeek ? "Jadwal satu minggu" : `Jadwal ${formatDate(dates[0])}`}
          >
            {/* Hour Scale Column */}
            <div className="relative border-r border-line bg-surface" style={{ height: TOTAL_HEIGHT }}>
              {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => {
                const hour = START_HOUR + index;
                return (
                  <div
                    key={hour}
                    className={`absolute left-0 right-0 pr-2.5 text-right font-mono text-xs text-muted ${
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

            {/* Date Columns */}
            {dates.map((date) => {
              const dayEvents = filteredEvents.filter((event) => event.date === dateKey(date));
              const selected = sameDay(date, selectedDate);
              const isToday = sameDay(date, today);

              return (
                <div
                  key={dateKey(date)}
                  className={`relative border-r border-line [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_63px,var(--color-line)_63px,var(--color-line)_64px)] ${
                    selected ? "bg-accent/5" : isToday ? "bg-surface-muted/30" : "bg-surface"
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
                        className={`absolute z-10 left-1.5 right-1.5 overflow-hidden rounded-control border p-2 text-left shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer ${event.borderClass} ${event.bgClass} ${event.textClass}`}
                        style={{ top: position.top + 2, height: Math.max(position.height - 4, 32) }}
                      >
                        <span className="block truncate text-xs font-semibold leading-tight">
                          {event.title}
                        </span>
                        <div className="flex items-center justify-between gap-1 mt-1 text-[11px] leading-none opacity-90">
                          <span className="truncate font-medium">{event.organizationName}</span>
                          <span className="font-mono shrink-0">{event.startTime}–{event.endTime}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="flex shrink-0 items-center justify-between border-t border-line bg-surface px-5 py-3 text-xs text-muted transition-colors">
        <span className="font-medium text-foreground">
          {filteredEvents.length > 0
            ? `${filteredEvents.length} jadwal peminjaman ditampilkan`
            : isWeek
              ? "Tidak ada peminjaman pada minggu ini"
              : "Tidak ada peminjaman pada tanggal ini"}
        </span>
        <span className="font-mono text-muted">{isWeek ? "Tampilan Mingguan" : formatDate(dates[0])}</span>
      </footer>
    </div>
  );
}
