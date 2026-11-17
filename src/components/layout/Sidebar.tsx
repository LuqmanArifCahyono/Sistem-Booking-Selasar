"use client";

import React from "react";
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
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-2xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-[270px] bg-white border-r border-gray-200 flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h1 className="text-xl font-bold text-gray-950 tracking-tight leading-none">
                SelasarSpace
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-normal">
                Sistem Peminjaman Tempat
              </p>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
        <div className="pt-6 mt-6 border-t border-gray-100 space-y-1 text-xs">
          <div className="text-gray-900 font-medium">Butuh bantuan?</div>
          <button
            type="button"
            onClick={onOpenHelp}
            className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
          >
            Hubungi pengelola fasilitas ↗
          </button>
          <div className="text-[11px] text-gray-400 pt-2">
            SelasarSpace · Layanan kampus
          </div>
        </div>
      </aside>
    </>
  );
}
