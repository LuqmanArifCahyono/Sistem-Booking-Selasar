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

  // Tanggal hari ini berdasarkan perangkat pengguna
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

  // Leading next month days to complete 35 or 42 cells (matching 6 rows in mockup)
  const targetTotal = gridDays.length <= 35 ? 35 : 42;
  const remaining = targetTotal - gridDays.length;
  for (let d = 1; d <= remaining; d++) {
    gridDays.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  // Count events in current active month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const currentMonthEventsCount = visibleEvents.filter((e) =>
    e.date.startsWith(currentMonthPrefix)
  ).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#090D16] overflow-hidden select-none transition-colors">
      {/* Scrollable Container for Tablet/Mobile */}
      <div className="flex-1 flex flex-col overflow-x-auto min-h-0">
        <div className="min-w-[760px] flex-1 flex flex-col h-full border-b border-gray-200 dark:border-[#1E293B]">
          {/* Days of Week Header */}
          <div
            role="row"
            className="grid grid-cols-7 border-b border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-center py-2 shrink-0 transition-colors"
          >
            {DAY_NAMES_FULL.map((name, i) => (
              <div
                key={i}
                role="columnheader"
                className="text-xs font-semibold text-gray-700 dark:text-[#94A3B8] tracking-wider uppercase"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div
            role="grid"
            aria-label={`Kalender ${monthName} ${year}`}
            className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-gray-200 dark:divide-[#1E293B] border-l border-gray-200 dark:border-[#1E293B] min-h-[560px]"
          >
            {gridDays.map((cell, idx) => {
              const dateKey = formatDateKey(cell.date);
              const dayEvents = visibleEvents.filter((e) => e.date === dateKey);
              const today = isToday(cell.date);
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
                  className={`border-b border-gray-200 dark:border-[#1E293B] p-2 sm:p-2.5 flex flex-col justify-start gap-1 transition-colors relative cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:z-10 ${
                    cell.isCurrentMonth
                      ? "bg-white dark:bg-[#090D16] hover:bg-gray-50/60 dark:hover:bg-[#111827]/70"
                      : "bg-gray-50/30 dark:bg-[#0F172A]/40 hover:bg-gray-50/70 dark:hover:bg-[#0F172A]/70"
                  } ${
                    selected
                      ? "ring-1 ring-inset ring-amber-400/80 bg-amber-50/20 dark:bg-amber-950/20"
                      : ""
                  }`}
                  aria-label={`${cell.day} ${
                    MONTH_NAMES_ID[cell.date.getMonth()]
                  } ${cell.date.getFullYear()}${today ? ", Hari ini" : ""}${
                    selected ? ", Terpilih" : ""
                  }${
                    dayEvents.length > 0
                      ? `, ${dayEvents.length} jadwal kegiatan`
                      : ""
                  }`}
                >
                  {/* Date Number Badge */}
                  <div className="flex items-center justify-between">
                    {today && selected ? (
                      <span
                        className="w-6 h-6 rounded-full bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] flex items-center justify-center font-bold text-xs ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-[#090D16] dark:border dark:border-[#93C5FD]/40 shadow-2xs"
                        aria-label="Hari ini dan dipilih"
                      >
                        {cell.day}
                      </span>
                    ) : today ? (
                      <span
                        className="w-6 h-6 rounded-full bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] flex items-center justify-center font-bold text-xs dark:border dark:border-[#93C5FD]/40 shadow-2xs"
                        aria-label="Hari ini"
                      >
                        {cell.day}
                      </span>
                    ) : selected ? (
                      <span
                        className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold text-xs shadow-2xs"
                        aria-label="Tanggal dipilih"
                      >
                        {cell.day}
                      </span>
                    ) : (
                      <span
                        className={`text-xs ${
                          cell.isCurrentMonth
                            ? "text-gray-800 dark:text-[#CBD5E1] font-medium group-hover:text-gray-950 dark:group-hover:text-[#F8FAFC]"
                            : "text-gray-400 dark:text-[#64748B] font-normal"
                        }`}
                      >
                        {cell.day}
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
                        className={`w-full text-left p-2 rounded-lg transition-transform active:scale-98 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 border ${event.borderClass} ${event.bgClass} ${event.textClass}`}
                        aria-label={`${event.title}, diselenggarakan oleh ${event.organizationName}, pukul ${event.startTime} sampai ${event.endTime}`}
                      >
                        <div className="font-semibold text-xs leading-tight truncate">
                          {event.title}
                        </div>
                        <div
                          className={`text-[11px] leading-tight truncate mt-0.5 font-normal ${event.subtextClass}`}
                        >
                          {event.organizationName}
                        </div>
                        <div
                          className={`text-[11px] font-medium mt-1 leading-none ${event.subtextClass}`}
                        >
                          {event.startTime}–{event.endTime}
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
      <footer className="px-5 py-2.5 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-[#1E293B] flex items-center justify-between text-xs text-gray-500 dark:text-[#94A3B8] shrink-0 transition-colors">
        <span className="font-normal text-gray-600 dark:text-[#CBD5E1]">
          {currentMonthEventsCount} jadwal bulan ini
        </span>
        <span className="font-normal text-gray-400 dark:text-[#64748B]">
          {monthName} {year}
        </span>
      </footer>
    </div>
  );
}
