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

export function QuickPanelModal({
  type,
  events,
  organizations,
  today,
  user,
  onClose,
  onOpenHistory,
  onSaveOrganizations,
  onOpenBooking,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    organizations.filter((item) => item.checked).map((item) => item.id)
  );
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
    profile: "Akun Pengguna",
    notifications: "Jadwal Mendatang",
    settings: "Filter Penyelenggara",
    help: "Panduan Penggunaan",
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-panel-title"
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all"
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-line">
          <div>
            <h2 id="quick-panel-title" className="text-lg font-bold tracking-tight text-foreground">
              {titles[type]}
            </h2>
            <p className="mt-0.5 text-xs text-muted">SelasarSpace • Layanan Kampus Terpadu</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {type === "profile" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-line bg-surface-muted/40 p-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground text-sm font-bold shadow-xs shrink-0">
                  {(user?.name || "User").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-foreground truncate">
                    {user?.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {user?.email || "Akun SelasarSpace"}
                  </p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-accent/10 border border-accent/25 text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {user?.role === "USER"
                        ? "Mahasiswa (Lihat Jadwal)"
                        : user?.role === "ADMIN"
                        ? "Admin Himpunan"
                        : user?.role === "SUPER_ADMIN"
                        ? "Super Admin"
                        : "Mahasiswa"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {user?.role !== "USER" && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="w-full flex items-center justify-between rounded-xl border border-line bg-surface p-4 text-sm font-semibold text-foreground hover:bg-surface-muted active:scale-[0.99] transition-all cursor-pointer shadow-xs"
              >
                <span>Lihat Riwayat Peminjaman</span>
                <span className="text-muted">→</span>
              </button>
            )}

            {user?.role === "USER" && (
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs text-foreground/80 leading-relaxed">
                Akun Anda terdaftar sebagai <strong>Mahasiswa</strong> dengan akses pemantauan. Anda dapat melihat seluruh ketersediaan dan jadwal selasar kapan pun secara transparan.
              </div>
            )}

            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/login" })}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-status-cancelled hover:bg-status-cancelled/90 active:scale-[0.99] text-white px-4 py-3 text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar dari Akun (Logout)</span>
            </button>
          </div>
        )}

        {type === "notifications" && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-muted">Jadwal kegiatan terdekat yang akan berlangsung di selasar:</p>
            {nextEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-muted">
                Belum ada kegiatan terjadwal dalam waktu dekat.
              </div>
            ) : (
              nextEvents.map((event) => (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => onOpenBooking(event)}
                  className="w-full rounded-xl border border-line bg-surface p-3.5 text-left hover:bg-surface-muted active:scale-[0.99] cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold text-foreground">{event.title}</span>
                    <span className="text-xs font-semibold text-accent shrink-0">Buka →</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-foreground/80">{event.organizationName}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {formatDate(event.date)} • {event.startTime.replace(".", ":")}–{event.endTime.replace(".", ":")} WIB
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        {type === "settings" && (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-muted">
              Pilih organisasi atau himpunan yang ingin ditampilkan pada kalender:
            </p>
            <div className="space-y-2">
              {organizations.map((organization) => (
                <label
                  key={organization.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 hover:bg-surface-muted transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{organization.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(organization.id)}
                    onChange={(event) =>
                      setSelectedIds((previous) =>
                        event.target.checked
                          ? [...previous, organization.id]
                          : previous.filter((id) => id !== organization.id)
                      )
                    }
                    className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-surface-muted active:scale-[0.98] cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveOrganizations(selectedIds);
                  onClose();
                }}
                className="rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-accent-foreground hover:bg-accent-hover active:scale-[0.98] cursor-pointer shadow-xs transition-all"
              >
                Simpan Filter
              </button>
            </div>
          </div>
        )}

        {type === "help" && (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-muted">
              Tata cara dan aturan penggunaan selasar kampus:
            </p>
            <div className="space-y-2.5">
              {GUIDANCE_ITEMS.map((item) => (
                <div
                  key={item.number}
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-xs font-bold text-accent shrink-0">
                    {item.number}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-line bg-surface-muted/50 p-3.5 text-xs text-muted leading-relaxed">
              Untuk perizinan acara besar atau konfirmasi peralatan khusus, hubungi pengelola fasilitas kampus.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
