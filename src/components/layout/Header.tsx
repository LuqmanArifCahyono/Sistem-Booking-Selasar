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
    <header className="w-full bg-surface border-b border-line px-5 py-3.5 shrink-0 transition-colors z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Left Side: Mobile Menu Button + Date Navigator + Period Title */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-control text-foreground hover:bg-surface-muted border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer transition-colors"
            aria-label="Buka menu navigasi"
          >
            <svg
              className="w-5 h-5 text-muted"
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

          {/* Date Navigator Controls */}
          <div className="inline-flex items-center rounded-control border border-line bg-surface p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={onPrevPeriod}
              aria-label="Periode sebelumnya"
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none cursor-pointer"
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
              className="px-2.5 h-8 flex items-center justify-center rounded-md text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none cursor-pointer"
            >
              Hari Ini
            </button>

            <button
              type="button"
              onClick={onNextPeriod}
              aria-label="Periode berikutnya"
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none cursor-pointer"
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
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight ml-1">
            {getHeaderTitle()}
          </h2>
        </div>

        {/* Center & Right Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
          {/* View Switcher Segmented Control */}
          <div
            role="tablist"
            aria-label="Pilihan tampilan kalender"
            className="flex items-center bg-surface-muted border border-line p-1 rounded-control shadow-2xs"
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                    isActive
                      ? "bg-surface text-foreground font-semibold shadow-xs border border-line"
                      : "text-muted hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          {/* Quick Nav Links (Panel Super Admin / Timeline Admin) */}
          {backLink && (
            <a
              href={backLink.href}
              className="inline-flex h-9 items-center gap-1.5 rounded-control border border-line bg-surface px-3 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span>{backLink.label}</span>
            </a>
          )}

          {secondaryBackLink && (
            <a
              href={secondaryBackLink.href}
              className="inline-flex h-9 items-center gap-1.5 rounded-control border border-line bg-surface px-3 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{secondaryBackLink.label}</span>
            </a>
          )}

          {/* Pinjam Tempat Button: Hanya untuk pengguna berhak (Super Admin / Admin) */}
          {onPinjamTempat && (
            <button
              type="button"
              onClick={onPinjamTempat}
              className="inline-flex h-9 items-center gap-1.5 rounded-control bg-accent hover:bg-accent-hover text-white px-3.5 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <span className="text-base leading-none font-bold">+</span>
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
