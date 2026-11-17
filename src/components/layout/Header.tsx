"use client";

import React from "react";
import { CalendarView } from "@/types";
import { MONTH_NAMES_ID } from "@/constants";
import { UserNav } from "./UserNav";

interface HeaderProps {
  currentDate: Date;
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onPinjamTempat: () => void;
  onToggleSidebarMobile: () => void;
  onOpenProfile?: () => void;
  onOpenNotification?: () => void;
  onOpenSettings?: () => void;
}

export function Header({
  currentDate,
  currentView,
  onViewChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onPinjamTempat,
  onToggleSidebarMobile,
  onOpenProfile,
  onOpenNotification,
  onOpenSettings,
}: HeaderProps) {
  const monthName = MONTH_NAMES_ID[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const views: { id: CalendarView; label: string }[] = [
    { id: "mingguan", label: "Mingguan" },
    { id: "harian", label: "Harian" },
    { id: "bulan", label: "Bulan" },
    { id: "histori", label: "Histori" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3 shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Date Navigator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Buka menu navigasi"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Date Navigator Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrevMonth}
              aria-label="Periode sebelumnya"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
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
              onClick={onToday}
              className="px-3 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
            >
              Hari Ini
            </button>

            <button
              type="button"
              onClick={onNextMonth}
              aria-label="Periode berikutnya"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
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

          {/* Month & Year Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight ml-1">
            {monthName} {year}
          </h2>
        </div>

        {/* Center & Right Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          {/* View Switcher Segmented Control */}
          <div
            role="tablist"
            aria-label="Pilihan tampilan kalender"
            className="flex items-center bg-gray-50 border border-gray-200 p-0.5 rounded-lg"
          >
            {views.map((v) => {
              const isActive = currentView === v.id;
              return (
                <button
                  key={v.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => onViewChange(v.id)}
                  className={`px-3 py-1.5 text-xs transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none rounded-md ${
                    isActive
                      ? "bg-white text-gray-950 font-medium shadow-2xs border border-gray-200/80"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          {/* Pinjam Tempat Button */}
          <button
            type="button"
            onClick={onPinjamTempat}
            className="h-9 px-4 rounded-full bg-gray-950 hover:bg-gray-800 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-98 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
          >
            <span className="text-base leading-none font-semibold">+</span>
            <span>Pinjam Tempat</span>
          </button>

          {/* User Nav and Quick Actions */}
          <div className="hidden sm:block pl-1">
            <UserNav
              onOpenProfile={onOpenProfile}
              onOpenNotification={onOpenNotification}
              onOpenSettings={onOpenSettings}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
