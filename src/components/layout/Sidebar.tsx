"use client";

import React from "react";
import Image from "next/image";
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-[280px] bg-surface border-r border-line flex flex-col justify-between p-4 sm:p-5 overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 select-none ${
          isOpenMobile
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-line shadow-xs shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src="/hanni.jpg"
                  alt="Logo SelasarSpace"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground tracking-tight leading-none">
                  SelasarSpace
                </h1>
                <p className="text-xs font-medium text-muted mt-1 leading-none">
                  Fasilitas Selasar Utama
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-control text-muted hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
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
          <div className="pt-0.5">
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
        <div className="pt-4 mt-6 border-t border-line space-y-3.5 text-xs">
          {user && (
            <div className="flex items-center justify-between p-2.5 rounded-panel bg-surface-muted/60 border border-line">
              <div className="min-w-0 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-muted truncate leading-tight mt-0.5">
                    {user.role === "USER"
                      ? "Mahasiswa"
                      : user.role === "ADMIN"
                      ? "Admin Himpunan"
                      : "Super Admin"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/login" })}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 hover:underline px-1.5 py-0.5 cursor-pointer shrink-0"
                title="Keluar dari akun"
              >
                Keluar
              </button>
            </div>
          )}

          <div className="space-y-1">
            <div className="text-foreground font-medium text-xs">Butuh bantuan?</div>
            <button
              type="button"
              onClick={onOpenHelp}
              className="text-accent hover:underline inline-flex items-center gap-1 font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded cursor-pointer"
            >
              Hubungi pengelola fasilitas ↗
            </button>
            <div className="text-[11px] text-muted pt-1">
              SelasarSpace · Layanan Kampus
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
