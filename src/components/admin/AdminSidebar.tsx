"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminOrganizationFilter } from "@/types/admin";
import { formatDateDMY, MONTH_NAMES_ID } from "@/constants/admin";

interface AdminSidebarProps {
  activeNav: "monitor" | "accounts";
  onNavChange: (nav: "monitor" | "accounts") => void;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  organizations: AdminOrganizationFilter[];
  onToggleOrg: (id: string) => void;
  onOpenHelp: () => void;
  onOpenLogout: () => void;
  accountsCount?: number;
  user?: {
    name: string;
    email: string;
    role: string;
    position?: string | null;
    organizationName?: string | null;
  };
}

export function AdminSidebar({
  activeNav,
  onNavChange,
  selectedDate,
  onSelectDate,
  organizations,
  onToggleOrg,
  onOpenHelp,
  onOpenLogout,
  accountsCount = 6,
  user,
}: AdminSidebarProps) {
  const [viewMonthDate, setViewMonthDate] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(selectedDate);

  if (
    selectedDate.getFullYear() !== prevSelectedDate.getFullYear() ||
    selectedDate.getMonth() !== prevSelectedDate.getMonth()
  ) {
    setPrevSelectedDate(selectedDate);
    setViewMonthDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }

  const viewYear = viewMonthDate.getFullYear();
  const viewMonth = viewMonthDate.getMonth();
  const monthLabel = `${MONTH_NAMES_ID[viewMonth]} ${viewYear}`;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const isSameMonth =
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth;
  const activeDay = isSameMonth ? selectedDate.getDate() : -1;

  const handlePrevMonth = () => {
    setViewMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (dayNumber: number) => {
    onSelectDate(new Date(viewYear, viewMonth, dayNumber));
  };

  const handleTodayClick = () => {
    const todayDate = new Date(2026, 10, 12);
    setViewMonthDate(new Date(2026, 10, 1));
    onSelectDate(todayDate);
  };

  return (
    <aside className="w-64 sm:w-72 shrink-0 bg-surface border-r border-line flex flex-col justify-between h-screen sticky top-0 overflow-y-auto select-none transition-colors">
      <div className="p-4 sm:p-5 flex flex-col gap-5">
        {/* Brand & Badge Panel Sub-Admin */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-lg font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              SelasarSpace
            </Link>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-accent/10 text-accent border border-accent/25">
              Panel Admin
            </span>
          </div>
          <p className="text-xs font-medium text-muted mt-0.5">
            Sistem Peminjaman Fasilitas Kampus
          </p>
        </div>

        {/* Navigasi Panel */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
            Navigasi Panel
          </span>

          {/* Menu 1: Monitor Jadwal & Slot */}
          <button
            type="button"
            onClick={() => onNavChange("monitor")}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeNav === "monitor"
                ? "bg-accent/10 text-accent border border-accent/30 font-bold"
                : "text-foreground/80 hover:bg-surface-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Monitor Jadwal & Slot</span>
            </div>
          </button>

          {/* Menu 2: Monitoring Akun Organisasi */}
          <button
            type="button"
            onClick={() => onNavChange("accounts")}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeNav === "accounts"
                ? "bg-accent/10 text-accent border border-accent/30 font-bold"
                : "text-foreground/80 hover:bg-surface-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Monitoring Akun Organisasi</span>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-surface-muted border border-line text-foreground">
              {accountsCount}
            </span>
          </button>

          {/* Menu Tautan: Kalender Selasar */}
          <Link
            href="/kalender"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-foreground/80 hover:bg-surface-muted transition-all"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Buka Kalender Selasar</span>
            </div>
            <span className="text-xs text-muted font-bold">›</span>
          </Link>

          {/* Menu Khusus Super Admin */}
          {user?.role === "SUPER_ADMIN" && (
            <Link
              href="/super-admin"
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-accent bg-accent/5 hover:bg-accent/10 border border-accent/20 transition-all mt-1"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-accent text-[9px] font-bold text-accent-foreground">
                  S
                </span>
                <span>Panel Super Admin</span>
              </div>
              <span className="text-xs font-bold">›</span>
            </Link>
          )}
        </div>

        {/* Kalender Lintas Periode */}
        <div className="p-3.5 rounded-2xl border border-line bg-surface-muted/30 flex flex-col gap-2.5">
          {/* Header Kalender */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Pilih Tanggal
            </span>
            <button
              type="button"
              onClick={handleTodayClick}
              className="text-xs font-bold text-accent hover:underline cursor-pointer"
            >
              Hari ini
            </button>
          </div>

          {/* Month & Arrow Navigation */}
          <div className="flex items-center justify-between text-xs font-bold text-foreground px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Bulan sebelumnya"
              className="text-muted hover:text-foreground px-2 py-1 rounded-lg hover:bg-surface-muted cursor-pointer transition-colors"
            >
              ‹
            </button>
            <span className="font-bold tracking-tight">{monthLabel}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Bulan berikutnya"
              className="text-muted hover:text-foreground px-2 py-1 rounded-lg hover:bg-surface-muted cursor-pointer transition-colors"
            >
              ›
            </button>
          </div>

          {/* Day of Week Headers (S S R K J S M) */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
            <span>S</span>
            <span>S</span>
            <span>R</span>
            <span>K</span>
            <span>J</span>
            <span>S</span>
            <span>M</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {[...Array(startDayOffset)].map((_, i) => (
              <span key={`empty-${i}`} className="h-6 w-6" />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const dNum = i + 1;
              const isSelected = dNum === activeDay;
              return (
                <button
                  key={`day-${dNum}`}
                  type="button"
                  onClick={() => handleDayClick(dNum)}
                  className={`h-6 w-6 mx-auto flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-xs font-bold"
                      : "text-foreground/80 hover:bg-surface-muted"
                  }`}
                >
                  {dNum}
                </button>
              );
            })}
          </div>

          {/* Tanggal Aktif Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-line text-xs text-muted">
            <span>
              Aktif: <strong className="text-foreground">{formatDateDMY(selectedDate)}</strong>
            </span>
            <button
              type="button"
              onClick={handleTodayClick}
              title="Reset ke hari ini"
              aria-label="Reset ke hari ini"
              className="text-accent hover:rotate-180 transition-transform duration-300 cursor-pointer p-0.5"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Filter Penyelenggara Event */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
              Penyelenggara
            </span>
          </div>

          <div className="flex flex-col gap-1.5 mt-0.5">
            {organizations.map((org) => (
              <label
                key={org.id}
                className="flex items-center gap-2.5 text-xs font-medium text-foreground/85 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={org.checked}
                  onChange={() => onToggleOrg(org.id)}
                  className="rounded border-line text-accent focus:ring-accent cursor-pointer"
                />
                <span className={`w-2 h-2 rounded-full ${org.dotClass} shrink-0`} />
                <span className="group-hover:text-foreground transition-colors">
                  {org.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Sidebar: Profil Sub-Admin & Keluar */}
      <div className="p-4 border-t border-line flex flex-col gap-3 bg-surface">
        <button
          type="button"
          onClick={onOpenHelp}
          className="text-left text-xs font-semibold text-accent hover:underline flex items-center justify-between cursor-pointer group"
        >
          <div>
            <span className="block text-xs text-muted font-normal">
              Butuh bantuan?
            </span>
            <span>Hubungi pengelola fasilitas</span>
          </div>
          <span className="text-sm font-bold text-muted group-hover:translate-x-0.5 transition-transform">
            ›
          </span>
        </button>

        {/* Profile Card & Logout */}
        <div className="pt-2 border-t border-line flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-foreground truncate block leading-tight">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-muted truncate block leading-tight">
                {user?.organizationName
                  ? `${user.organizationName}`
                  : user?.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : "Admin Himpunan"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLogout}
            className="text-xs font-semibold text-status-cancelled hover:opacity-80 px-2.5 py-1 rounded-lg hover:bg-status-cancelled/10 transition-colors cursor-pointer"
            title="Keluar dari Panel Admin"
          >
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
