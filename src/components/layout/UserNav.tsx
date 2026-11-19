"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface UserNavProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  onOpenProfile?: () => void;
  onOpenNotification?: () => void;
  onOpenSettings?: () => void;
}

export function UserNav({
  user,
  onOpenProfile,
  onOpenNotification,
  onOpenSettings,
}: UserNavProps) {
  const [showNotificationBadge] = useState(true);
  const displayName = user?.name || "Pengguna";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Notifications Button */}
      <button
        type="button"
        onClick={onOpenNotification}
        aria-label="Notifikasi peminjaman"
        className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#334155] hover:text-gray-900 dark:hover:text-[#F8FAFC] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
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
            strokeWidth={1.75}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {showNotificationBadge && (
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 dark:bg-[#93C5FD] rounded-full"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Settings Button */}
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Pengaturan kalender"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#334155] hover:text-gray-900 dark:hover:text-[#F8FAFC] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
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
            strokeWidth={1.75}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* User Avatar & Name */}
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label={`Profil pengguna: ${displayName}`}
        title={`Profil: ${displayName} (${user?.email || ""})`}
        className="h-9 px-2.5 rounded-full border border-gray-300 dark:border-[#334155] bg-gray-100 dark:bg-[#1E293B] flex items-center gap-1.5 hover:ring-2 hover:ring-gray-300 dark:hover:ring-slate-600 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold select-none">
          {initials}
        </span>
        <span className="text-xs font-semibold text-gray-700 dark:text-[#CBD5E1] max-w-[100px] truncate hidden sm:inline-block">
          {displayName}
        </span>
      </button>

      {/* Tombol Logout Jelas */}
      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/login" })}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 px-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
        title="Keluar dari akun (Logout)"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Keluar</span>
      </button>
    </div>
  );
}
