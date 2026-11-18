"use client";

import React from "react";
import { DAY_NAMES_SHORT, MONTH_NAMES_ID } from "@/constants";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  today: Date;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (offset: number) => void;
}

export function MiniCalendar({
  currentDate,
  selectedDate,
  today,
  onSelectDate,
  onChangeMonth,
}: MiniCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calculate days for the month view (Monday as first day of week)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Convert Sunday (0) to 7 so Monday is 1, Sunday is 7
  let startDay = firstDayOfMonth.getDay();
  startDay = startDay === 0 ? 7 : startDay;

  const totalDays = lastDayOfMonth.getDate();
  const daysFromPrevMonth = startDay - 1;

  // Prev month end date
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Previous month trailing days
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    days.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month - 1, d),
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    days.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d),
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remaining = (7 - (days.length % 7)) % 7;
  const targetTotal = days.length + remaining < 42 ? 42 : days.length + remaining;
  const additional = targetTotal - days.length;
  for (let d = 1; d <= additional; d++) {
    days.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isTodayDate = (d: Date) => {
    return isSameDay(d, today);
  };

  // Format tanggal secara lokal agar tidak bergeser karena konversi zona waktu.
  const formatDateInput = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDatePickerChange = (value: string) => {
    if (!value) return;
    const [selectedYear, selectedMonth, selectedDay] = value.split("-").map(Number);
    if (!selectedYear || !selectedMonth || !selectedDay) return;
    onSelectDate(new Date(selectedYear, selectedMonth - 1, selectedDay));
  };

  return (
    <div className="w-full">
      {/* Direct Date Picker */}
      <div className="mb-3 px-1">
        <label
          htmlFor="sidebar-calendar-date-picker"
          className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-[#94A3B8]"
        >
          Pilih tanggal
        </label>
        <input
          id="sidebar-calendar-date-picker"
          type="date"
          value={formatDateInput(selectedDate)}
          onChange={(event) => handleDatePickerChange(event.target.value)}
          className="h-9 w-full rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#111827] px-2.5 text-sm text-gray-700 dark:text-[#F8FAFC] outline-none transition-colors hover:border-gray-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-[#93C5FD] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 cursor-pointer"
          aria-label="Pilih tanggal untuk ditampilkan di kalender"
        />
      </div>

      {/* Month Navigator Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">
          {MONTH_NAMES_ID[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-[#1E293B] text-gray-600 dark:text-[#94A3B8] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            aria-label="Bulan berikutnya"
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-[#1E293B] text-gray-600 dark:text-[#94A3B8] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAY_NAMES_SHORT.map((name, i) => (
          <span
            key={i}
            className="text-[11px] font-medium text-gray-400 dark:text-[#64748B] py-1 select-none"
          >
            {name}
          </span>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((item, idx) => {
          const isSelected = isSameDay(item.date, selectedDate);
          const isCurrentToday = isTodayDate(item.date);

          let dateStyle = "text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-100 dark:hover:bg-[#1E293B]";
          if (!item.isCurrentMonth) {
            dateStyle = "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-[#1E293B]/40";
          }

          if (isCurrentToday && isSelected) {
            // Hari ini dan sedang dipilih: badge dengan ring amber
            dateStyle = "bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] font-bold ring-2 ring-amber-400 shadow-xs dark:border dark:border-[#93C5FD]/40";
          } else if (isCurrentToday) {
            // Hari ini tetapi tidak sedang dipilih
            dateStyle = "bg-gray-950 dark:bg-[#1E293B] text-white dark:text-[#93C5FD] font-bold shadow-2xs hover:bg-gray-800 dark:hover:bg-[#334155] dark:border dark:border-[#93C5FD]/40";
          } else if (isSelected) {
            // Dipilih tetapi bukan hari ini: badge amber
            dateStyle = "bg-amber-500 text-white font-semibold shadow-xs hover:bg-amber-600";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer ${dateStyle}`}
              aria-label={`${item.day} ${MONTH_NAMES_ID[item.date.getMonth()]} ${item.date.getFullYear()}${isCurrentToday ? " (Hari ini)" : ""}${isSelected ? " (Dipilih)" : ""}`}
              aria-pressed={isSelected}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
