"use client";

import React from "react";
import { BookingEvent, Organization } from "@/types";
import { MONTH_NAMES_ID, DAY_NAMES_FULL } from "@/constants";

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  today: Date;
  onSelectDate: (date: Date) => void;
  organizations: Organization[];
  events: BookingEvent[];
  onEventClick: (event: BookingEvent) => void;
}

export function MonthView({
  currentDate,
  selectedDate,
  today,
  onSelectDate,
  organizations,
  events,
  onEventClick,
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = MONTH_NAMES_ID[month];

  // Map of active organization IDs
  const activeOrgIds = new Set(
    organizations.filter((o) => o.checked).map((o) => o.id)
  );

  // Filter events based on active organizations
  const visibleEvents = events.filter((evt) =>
    evt.status !== "dibatalkan" && activeOrgIds.has(evt.organizationId)
  );

  // Helper date equality
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Format date to ISO string "YYYY-MM-DD" matching event.date
  const formatDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const isToday = (d: Date) => {
    return isSameDay(d, today);
  };

  // Calculate calendar grid (Monday = 1, Sunday = 7)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startDay = firstDayOfMonth.getDay();
  startDay = startDay === 0 ? 7 : startDay;

  const totalDays = lastDayOfMonth.getDate();
  const daysFromPrevMonth = startDay - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const gridDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Trailing previous month days
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    gridDays.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month - 1, d),
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    gridDays.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d),
    });
  }

  // Leading next month days to complete 35 or 42 cells
  const targetTotal = gridDays.length <= 35 ? 35 : 42;
  const remaining = targetTotal - gridDays.length;
  for (let d = 1; d <= remaining; d++) {
    gridDays.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const currentMonthEventsCount = visibleEvents.filter((e) =>
    e.date.startsWith(currentMonthPrefix)
  ).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden select-none transition-colors">
      {/* Scrollable Container */}
      <div className="flex-1 flex flex-col overflow-x-auto min-h-0">
        <div className="min-w-[760px] flex-1 flex flex-col h-full border-b border-line">
          {/* Days of Week Header */}
          <div
            role="row"
            className="grid grid-cols-7 border-b border-line bg-surface text-center py-2.5 shrink-0 transition-colors"
          >
            {DAY_NAMES_FULL.map((name, i) => (
              <div
                key={i}
                role="columnheader"
                className="text-xs font-semibold text-muted tracking-wider uppercase"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div
            role="grid"
            aria-label={`Kalender ${monthName} ${year}`}
            className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-line border-l border-line min-h-[560px]"
          >
            {gridDays.map((cell, idx) => {
              const dateKey = formatDateKey(cell.date);
              const dayEvents = visibleEvents.filter((e) => e.date === dateKey);
              const todayFlag = isToday(cell.date);
              const selected = isSameDay(cell.date, selectedDate);

              return (
                <div
                  key={idx}
                  role="gridcell"
                  tabIndex={0}
                  onClick={() => onSelectDate(cell.date)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectDate(cell.date);
                    }
                  }}
                  className={`border-b border-line p-2 sm:p-2.5 flex flex-col justify-start gap-1.5 transition-colors relative cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:z-10 ${
                    cell.isCurrentMonth
                      ? "bg-surface hover:bg-surface-muted/60"
                      : "bg-surface-muted/30 hover:bg-surface-muted/60 opacity-60"
                  } ${
                    selected
                      ? "ring-1 ring-inset ring-accent/60 bg-accent/5 dark:bg-accent/10"
                      : ""
                  }`}
                  aria-label={`${cell.day} ${
                    MONTH_NAMES_ID[cell.date.getMonth()]
                  } ${cell.date.getFullYear()}${todayFlag ? ", Hari ini" : ""}${
                    selected ? ", Terpilih" : ""
                  }${
                    dayEvents.length > 0
                      ? `, ${dayEvents.length} jadwal kegiatan`
                      : ""
                  }`}
                >
                  {/* Date Number Badge */}
                  <div className="flex items-center justify-between">
                    {todayFlag ? (
                      <span
                        className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-control bg-accent text-white font-bold text-xs shadow-xs"
                        aria-label="Hari ini"
                      >
                        {cell.day}
                      </span>
                    ) : selected ? (
                      <span
                        className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-control bg-foreground text-background font-bold text-xs"
                        aria-label="Tanggal dipilih"
                      >
                        {cell.day}
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-semibold ${
                          cell.isCurrentMonth
                            ? "text-foreground/80 group-hover:text-foreground"
                            : "text-muted"
                        }`}
                      >
                        {cell.day}
                      </span>
                    )}

                    {dayEvents.length > 0 && (
                      <span className="text-[11px] font-medium text-muted">
                        {dayEvents.length} kegiatan
                      </span>
                    )}
                  </div>

                  {/* Event Cards in Date Cell */}
                  <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pt-0.5">
                    {dayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`w-full text-left p-2 rounded-control transition-all active:scale-[0.98] shadow-2xs hover:shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent border ${event.borderClass} ${event.bgClass} ${event.textClass}`}
                        aria-label={`${event.title}, ${event.organizationName}, pukul ${event.startTime} sampai ${event.endTime}`}
                      >
                        <div className="font-semibold text-xs leading-snug truncate">
                          {event.title}
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-1 text-[11px] leading-none opacity-90">
                          <span className="truncate font-medium">{event.organizationName}</span>
                          <span className="font-mono shrink-0">{event.startTime}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className="px-5 py-3 bg-surface border-t border-line flex items-center justify-between text-xs text-muted shrink-0 transition-colors">
        <span className="font-medium text-foreground">
          {currentMonthEventsCount} jadwal kegiatan aktif pada bulan ini
        </span>
        <span className="font-mono text-muted">
          {monthName} {year}
        </span>
      </footer>
    </div>
  );
}
