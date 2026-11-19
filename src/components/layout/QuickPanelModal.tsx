"use client";

import React, { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { BookingEvent, Organization } from "@/types";
import { GUIDANCE_ITEMS, MONTH_NAMES_ID } from "@/constants";

export type QuickPanelType = "profile" | "notifications" | "settings" | "help";

interface Props {
  type: QuickPanelType | null;
  events: BookingEvent[];
  organizations: Organization[];
  today: Date;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  onClose: () => void;
  onOpenHistory: () => void;
  onSaveOrganizations: (ids: string[]) => void;
  onOpenBooking: (event: BookingEvent) => void;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${MONTH_NAMES_ID[month - 1]} ${year}`;
}

export function QuickPanelModal({ type, events, organizations, today, user, onClose, onOpenHistory, onSaveOrganizations, onOpenBooking }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(organizations.filter((item) => item.checked).map((item) => item.id));
  const [prevType, setPrevType] = useState(type);
  const [prevOrganizations, setPrevOrganizations] = useState(organizations);

  if (type !== prevType || organizations !== prevOrganizations) {
    setPrevType(type);
    setPrevOrganizations(organizations);
    setSelectedIds(organizations.filter((item) => item.checked).map((item) => item.id));
  }

  const nextEvents = useMemo(() => {
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return events
      .filter((event) => event.status !== "dibatalkan" && event.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 5);
  }, [events, today]);

  if (!type) return null;

  const titles: Record<QuickPanelType, string> = {
    profile: "Akun pengguna",
    notifications: "Notifikasi peminjaman",
    settings: "Pengaturan kalender",
    help: "Bantuan peminjaman",
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-gray-950/45 dark:bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="quick-panel-title" className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#111827] p-5 shadow-2xl sm:p-6 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="quick-panel-title" className="text-lg font-semibold text-gray-950 dark:text-[#F8FAFC]">{titles[type]}</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-[#94A3B8]">SelasarSpace · Layanan kampus</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup panel" className="rounded-lg p-1.5 text-gray-500 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1E293B] cursor-pointer">✕</button>
        </div>

        {type === "profile" && <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold shrink-0">
                {(user?.name || "User").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-950 dark:text-[#F8FAFC] truncate">
                  {user?.name || "Pengguna"}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8] truncate">
                  {user?.email || "Akun SelasarSpace"}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                  {user?.role === "USER"
                    ? "Mahasiswa (Read-only)"
                    : user?.role === "ADMIN"
                    ? "Admin Himpunan"
                    : user?.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : "Mahasiswa"}
                </span>
              </div>
            </div>
          </div>

          {user?.role !== "USER" && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="w-full rounded-lg border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#1E293B] px-4 py-3 text-left text-sm font-medium text-gray-800 dark:text-[#CBD5E1] hover:bg-gray-100 dark:hover:bg-[#334155] cursor-pointer transition-colors"
            >
              Lihat histori peminjaman <span className="float-right">→</span>
            </button>
          )}

          {user?.role === "USER" && (
            <div className="rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-3 text-xs text-blue-700 dark:text-blue-300">
              Akun Anda berstatus <strong>Mahasiswa</strong>. Anda dapat memantau seluruh ketersediaan dan jadwal peminjaman selasar secara langsung pada kalender.
            </div>
          )}

          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/login" })}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar dari Akun (Logout)</span>
          </button>
        </div>}

        {type === "notifications" && <div className="mt-5 space-y-3">
          <p className="text-sm text-gray-600 dark:text-[#94A3B8]">Jadwal terdekat yang tercatat dalam simulasi.</p>
          {nextEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-[#334155] p-6 text-center text-sm text-gray-500 dark:text-[#64748B]">
              Belum ada jadwal mendatang.
            </div>
          ) : (
            nextEvents.map((event) => (
              <button
                type="button"
                key={event.id}
                onClick={() => onOpenBooking(event)}
                className="w-full rounded-xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-3 text-left hover:bg-gray-50 dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">{event.title}</span>
                  <span className="text-[11px] text-gray-500 dark:text-[#93C5FD]">Lihat jadwal →</span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-[#CBD5E1]">{event.organizationName}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-[#94A3B8]">
                  {formatDate(event.date)} · {event.startTime.replace(".", ":")}–{event.endTime.replace(".", ":")} WIB
                </p>
              </button>
            ))
          )}
          <p className="text-[11px] text-gray-400 dark:text-[#64748B]">Notifikasi ini dibuat dari data lokal, bukan pemberitahuan server.</p>
        </div>}

        {type === "settings" && <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-[#94A3B8]">Pilih penyelenggara event yang ingin ditampilkan pada kalender. Pengaturan ini berlaku untuk semua tampilan kalender.</p>
          <div className="space-y-2">
            {organizations.map((organization) => (
              <label
                key={organization.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-3.5 py-3 hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-[#CBD5E1]">{organization.name}</span>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(organization.id)}
                  onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...previous, organization.id] : previous.filter((id) => id !== organization.id))}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 dark:border-[#334155] px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => { onSaveOrganizations(selectedIds); onClose(); }}
              className="rounded-lg bg-blue-600 dark:bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
            >
              Simpan pengaturan
            </button>
          </div>
        </div>}

        {type === "help" && <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-[#94A3B8]">Periksa jadwal di kalender sebelum mengajukan peminjaman. Jika jadwal bentrok, pilih waktu lain yang tersedia.</p>
          <div className="space-y-3">
            {GUIDANCE_ITEMS.map((item) => (
              <div key={item.number} className="flex gap-3 rounded-lg border border-gray-100 dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-3">
                <span className="flex h-7 w-8 items-center justify-center rounded-md bg-blue-50 dark:bg-[#93C5FD]/10 text-xs font-bold text-blue-700 dark:text-[#93C5FD]">
                  {item.number}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-[#94A3B8]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-[#1E293B] p-3 text-xs text-gray-600 dark:text-[#CBD5E1]">
            Untuk bantuan lebih lanjut, hubungi pengelola fasilitas kampus.
          </div>
        </div>}
      </section>
    </div>
  );
}
