// [FRONTEND CHANGE START: Sidebar Navigasi Panel Sub-Admin - Milestone 1 & 2]
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
  // [FRONTEND CHANGE START: Navigasi Kalender Antarbulan - Milestone 2]
  const [viewMonthDate, setViewMonthDate] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(selectedDate);

  // Sinkronisasi bila selectedDate berubah di luar sidebar (render-time state adjustment)
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

  // Hitung jumlah hari dalam bulan aktif
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Hitung hari pertama bulan (Senin = 0 s.d. Minggu = 6)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  // Cek apakah tanggal yang dipilih berada di bulan yang sedang ditampilkan
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
  // [FRONTEND CHANGE END: Navigasi Kalender Antarbulan - Milestone 2]

  return (
    <aside className="w-64 sm:w-72 shrink-0 bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-[#1E293B] flex flex-col justify-between h-screen sticky top-0 overflow-y-auto select-none transition-colors">
      <div className="p-4 sm:p-5 flex flex-col gap-5">
        {/* Brand & Badge Panel Sub-Admin */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-lg font-bold tracking-tight text-[#0F172B] dark:text-[#F8FAFC] hover:opacity-90 transition-opacity"
            >
              SelasarSpace
            </Link>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md bg-[#2563EB]/10 dark:bg-[#93C5FD]/15 text-[#2563EB] dark:text-[#93C5FD] border border-[#2563EB]/25 dark:border-[#93C5FD]/30">
              Panel Sub-Admin
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#62748E] dark:text-[#94A3B8] mt-0.5">
            Sistem Peminjaman Tempat
          </p>
        </div>

        {/* Navigasi Panel */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
            Navigasi Panel
          </span>

          {/* Menu 1: Monitor Jadwal & Slot */}
          <button
            type="button"
            onClick={() => onNavChange("monitor")}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeNav === "monitor"
                ? "bg-[#2563EB]/10 dark:bg-[#93C5FD]/15 text-[#2563EB] dark:text-[#93C5FD] border border-[#2563EB]/30 dark:border-[#93C5FD]/30"
                : "text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
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
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeNav === "accounts"
                ? "bg-[#2563EB]/10 dark:bg-[#93C5FD]/15 text-[#2563EB] dark:text-[#93C5FD] border border-[#2563EB]/30 dark:border-[#93C5FD]/30"
                : "text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Monitoring Akun Organisasi</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E2E8F0] dark:bg-[#334155] text-[#314158] dark:text-[#F8FAFC]">
              {accountsCount}
            </span>
          </button>

          {/* Menu Tautan: Kalender Selasar */}
          <Link
            href="/kalender"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#2563EB] dark:text-[#93C5FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Buka Kalender Selasar</span>
            </div>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] font-bold">›</span>
          </Link>

          {/* Menu Khusus Super Admin: Panel Super Admin */}
          {user?.role === "SUPER_ADMIN" && (
            <Link
              href="/super-admin"
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-[#2563EB] dark:text-[#93C5FD] bg-[#2563EB]/5 hover:bg-[#2563EB]/10 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#2563EB] text-[9px] font-bold text-white">
                  S
                </span>
                <span>Panel Super Admin</span>
              </div>
              <span className="text-[10px] font-bold">›</span>
            </Link>
          )}
        </div>

        {/* Kalender Lintas Periode */}
        <div className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col gap-2.5">
          {/* Header Kalender */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
              Kalender Lintas Periode
            </span>
            <button
              type="button"
              onClick={handleTodayClick}
              className="text-[10px] font-bold text-[#2563EB] dark:text-[#93C5FD] hover:underline cursor-pointer"
            >
              Hari ini
            </button>
          </div>

          {/* Month & Arrow Navigation */}
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC] px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Bulan sebelumnya"
              className="text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-white px-2 py-1 rounded hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
            >
              ‹
            </button>
            <span className="font-bold tracking-tight">{monthLabel}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Bulan berikutnya"
              className="text-[#62748E] dark:text-[#94A3B8] hover:text-[#0F172B] dark:hover:text-white px-2 py-1 rounded hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
            >
              ›
            </button>
          </div>

          {/* Day of Week Headers (S S R K J S M) */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#62748E] dark:text-[#94A3B8]">
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
            {/* Empty slots for start offset */}
            {[...Array(startDayOffset)].map((_, i) => (
              <span key={`empty-${i}`} className="h-6 w-6" />
            ))}

            {/* Days in Month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dNum = i + 1;
              const isSelected = dNum === activeDay;
              return (
                <button
                  key={`day-${dNum}`}
                  type="button"
                  onClick={() => handleDayClick(dNum)}
                  className={`h-6 w-6 mx-auto flex items-center justify-center rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2563EB] text-white shadow-xs font-bold"
                      : "text-[#314158] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B]"
                  }`}
                >
                  {dNum}
                </button>
              );
            })}
          </div>

          {/* Tanggal Aktif Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] text-[10px] text-[#62748E] dark:text-[#94A3B8]">
            <span>
              Tanggal aktif:{" "}
              <strong className="text-[#0F172B] dark:text-[#F8FAFC]">
                {formatDateDMY(selectedDate)}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleTodayClick}
              title="Reset ke tanggal hari ini (12/11/2026)"
              aria-label="Reset ke hari ini"
              className="text-[#2563EB] dark:text-[#93C5FD] hover:rotate-180 transition-transform duration-300 cursor-pointer p-0.5"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Filter Penyelenggara Event */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider block">
              Penyelenggara Event
            </span>
            <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] font-normal">
              Pilih yang tampil di jadwal & log
            </span>
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            {organizations.map((org) => (
              <label
                key={org.id}
                className="flex items-center gap-2 text-xs font-medium text-[#314158] dark:text-[#CBD5E1] cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={org.checked}
                  onChange={() => onToggleOrg(org.id)}
                  className="rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
                <span className={`w-2 h-2 rounded-full ${org.dotClass} shrink-0`} />
                <span className="group-hover:text-[#0F172B] dark:group-hover:text-white transition-colors">
                  {org.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Sidebar: Bantuan & Profil Sub-Admin */}
      <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-col gap-3 bg-[#FFFFFF] dark:bg-[#111827]">
        {/* Help Link */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="text-left text-xs font-semibold text-[#2563EB] dark:text-[#93C5FD] hover:underline flex items-center justify-between cursor-pointer group"
        >
          <div>
            <span className="block text-[10px] text-[#62748E] dark:text-[#94A3B8] font-normal">
              Butuh bantuan?
            </span>
            <span>Hubungi pengelola fasilitas</span>
          </div>
          <span className="text-sm font-bold text-[#62748E] group-hover:translate-x-0.5 transition-transform">
            ›
          </span>
        </button>

        <p className="text-[10px] text-[#62748E] dark:text-[#94A3B8]">
          SelasarSpace · Layanan kampus
        </p>

        {/* Profile Card & Logout */}
        <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AF"}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC] truncate block leading-tight">
                {user?.name || "Admin Fasilitas"}
              </span>
              <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] truncate block leading-tight">
                {user?.organizationName
                  ? `${user.organizationName}`
                  : user?.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : "(Sub-Admin)"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLogout}
            className="text-[11px] font-semibold text-[#DC2626] hover:text-[#B91C1C] dark:hover:text-[#F87171] px-2 py-1 rounded hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/30 transition-colors cursor-pointer"
            title="Keluar dari Panel Sub-Admin"
          >
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
// [FRONTEND CHANGE END: Sidebar Navigasi Panel Sub-Admin - Milestone 1]
