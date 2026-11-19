"use client";

import React from "react";
import { CalendarView } from "@/types";
import { DAY_NAMES_FULL, MONTH_NAMES_ID } from "@/constants";
import { UserNav } from "./UserNav";

interface HeaderProps {
  currentDate: Date;
  selectedDate: Date;
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onToday: () => void;
  /** Hanya diisi bila pengguna berhak membuat jadwal. Kalau kosong, tombolnya tidak dirender. */
  onPinjamTempat?: () => void;
  onToggleSidebarMobile: () => void;
  onOpenProfile?: () => void;
  onOpenNotification?: () => void;
  onOpenSettings?: () => void;
  /** Tautan kembali ke panel, dipakai kalau halaman ini dibuka dari panel. */
  backLink?: { href: string; label: string };
  secondaryBackLink?: { href: string; label: string };
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Header({
  currentDate,
  selectedDate,
  currentView,
  onViewChange,
  onPrevPeriod,
  onNextPeriod,
  onToday,
  onPinjamTempat,
  onToggleSidebarMobile,
  onOpenProfile,
  onOpenNotification,
  onOpenSettings,
  backLink,
  secondaryBackLink,
  user,
}: HeaderProps) {
  const monthName = MONTH_NAMES_ID[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const formatDate = (date: Date) =>
    `${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`;

  const getHeaderTitle = () => {
    if (currentView === "harian") {
      const weekday = DAY_NAMES_FULL[(selectedDate.getDay() + 6) % 7];
      return `${weekday}, ${formatDate(selectedDate)}`;
    }

    if (currentView === "mingguan") {
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const day = start.getDay();
      start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.getDate()}–${end.getDate()} ${MONTH_NAMES_ID[end.getMonth()]} ${end.getFullYear()}`;
      }

      return `${formatDate(start)} – ${formatDate(end)}`;
    }

    return `${monthName} ${year}`;
  };

  const canViewHistory = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const views: { id: CalendarView; label: string }[] = [
    { id: "mingguan", label: "Mingguan" },
    { id: "harian", label: "Harian" },
    { id: "bulan", label: "Bulan" },
    ...(canViewHistory ? [{ id: "histori" as const, label: "Histori" }] : []),
  ];

  return (
    <header className="w-full bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-[#1E293B] px-4 py-3 shrink-0 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Date Navigator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-100 dark:hover:bg-[#1E293B] border border-gray-200 dark:border-[#334155] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
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
              onClick={onPrevPeriod}
              aria-label="Periode sebelumnya"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] text-gray-600 dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-[#F8FAFC] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
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
              className="px-3 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] text-xs font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-[#F8FAFC] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
            >
              Hari Ini
            </button>

            <button
              type="button"
              onClick={onNextPeriod}
              aria-label="Periode berikutnya"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] text-gray-600 dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-[#F8FAFC] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
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
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-[#F8FAFC] tracking-tight ml-1">
            {getHeaderTitle()}
          </h2>
        </div>

        {/* Center & Right Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap">
          {/* View Switcher Segmented Control */}
          <div
            role="tablist"
            aria-label="Pilihan tampilan kalender"
            className="flex items-center bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-[#1E293B] p-0.5 rounded-lg"
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
                  className={`px-3 py-1.5 text-xs transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none rounded-md cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-[#1E293B] text-gray-950 dark:text-[#F8FAFC] font-medium shadow-2xs border border-gray-200/80 dark:border-slate-700"
                      : "text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-[#F8FAFC]"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          {backLink && (
            <a
              href={backLink.href}
              className="flex h-11 items-center rounded-control border border-line px-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
            >
              {backLink.label}
            </a>
          )}

          {secondaryBackLink && (
            <a
              href={secondaryBackLink.href}
              className="flex h-11 items-center rounded-control border border-line px-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
            >
              {secondaryBackLink.label}
            </a>
          )}

          {/* Pinjam Tempat Button: hanya muncul untuk pengguna yang berhak */}
          {onPinjamTempat && (
            <button
              type="button"
              onClick={onPinjamTempat}
              className="flex h-11 items-center gap-1.5 rounded-control bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              <span className="text-base leading-none">+</span>
              <span>Pinjam Tempat</span>
            </button>
          )}

          {/* User Nav and Quick Actions */}
          <div className="pl-1">
            <UserNav
              user={user}
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
