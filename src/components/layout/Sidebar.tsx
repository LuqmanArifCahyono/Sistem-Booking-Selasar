"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { MiniCalendar } from "./MiniCalendar";
import { GuidancePanel } from "./GuidancePanel";
import { OrganizationFilter } from "./OrganizationFilter";
import { Organization } from "@/types";

interface SidebarProps {
  currentDate: Date;
  selectedDate: Date;
  today: Date;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (offset: number) => void;
  organizations: Organization[];
  onToggleOrg: (id: string) => void;
  onOpenHelp?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Sidebar({
  currentDate,
  selectedDate,
  today,
  onSelectDate,
  onChangeMonth,
  organizations,
  onToggleOrg,
  onOpenHelp,
  isOpenMobile = false,
  onCloseMobile,
  user,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 dark:bg-black/70 z-40 lg:hidden backdrop-blur-2xs transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-[270px] bg-white dark:bg-[#0F172A] border-r border-gray-200 dark:border-[#1E293B] flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#1E293B]">
            <div>
              <h1 className="text-xl font-bold text-gray-950 dark:text-[#F8FAFC] tracking-tight leading-none">
                SelasarSpace
              </h1>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-1 font-normal">
                Sistem Peminjaman Tempat
              </p>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1E293B] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              aria-label="Tutup menu sidebar"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mini Calendar Widget */}
          <div className="pt-1">
            <MiniCalendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              today={today}
              onSelectDate={onSelectDate}
              onChangeMonth={onChangeMonth}
            />
          </div>

          {/* Panduan Peminjaman Collapsible */}
          <div>
            <GuidancePanel />
          </div>

          {/* Penyelenggara Event Filter */}
          <div>
            <OrganizationFilter
              organizations={organizations}
              onToggleOrg={onToggleOrg}
            />
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-4 mt-6 border-t border-gray-100 dark:border-[#1E293B] space-y-3 text-xs">
          {user && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]/60 border border-gray-200/70 dark:border-[#334155]">
              <div className="min-w-0 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-[#F8FAFC] truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-[#94A3B8] truncate leading-tight">
                    {user.role === "USER" ? "Mahasiswa" : user.role === "ADMIN" ? "Admin" : "Super Admin"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/login" })}
                className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline px-1.5 py-0.5 rounded cursor-pointer shrink-0"
                title="Keluar dari sesi"
              >
                Keluar
              </button>
            </div>
          )}

          <div className="space-y-1">
            <div className="text-gray-900 dark:text-[#F8FAFC] font-medium">Butuh bantuan?</div>
            <button
              type="button"
              onClick={onOpenHelp}
              className="text-blue-600 dark:text-[#93C5FD] hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1 font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded cursor-pointer"
            >
              Hubungi pengelola fasilitas ↗
            </button>
            <div className="text-[11px] text-gray-400 dark:text-[#64748B] pt-1">
              SelasarSpace · Layanan kampus
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
