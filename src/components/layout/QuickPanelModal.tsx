"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BookingEvent, Organization } from "@/types";
import { CURRENT_USER, GUIDANCE_ITEMS, MONTH_NAMES_ID } from "@/constants";

export type QuickPanelType = "profile" | "notifications" | "settings" | "help";

interface Props {
  type: QuickPanelType | null;
  events: BookingEvent[];
  organizations: Organization[];
  today: Date;
  onClose: () => void;
  onOpenHistory: () => void;
  onSaveOrganizations: (ids: string[]) => void;
  onOpenBooking: (event: BookingEvent) => void;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${MONTH_NAMES_ID[month - 1]} ${year}`;
}

export function QuickPanelModal({ type, events, organizations, today, onClose, onOpenHistory, onSaveOrganizations, onOpenBooking }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(organizations.filter((item) => item.checked).map((item) => item.id));
  useEffect(() => {
    setSelectedIds(organizations.filter((item) => item.checked).map((item) => item.id));
  }, [organizations, type]);

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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-gray-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="quick-panel-title" className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="quick-panel-title" className="text-lg font-semibold text-gray-950">{titles[type]}</h2><p className="mt-1 text-xs text-gray-500">SelasarSpace · Layanan kampus</p></div>
          <button type="button" onClick={onClose} aria-label="Tutup panel" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">✕</button>
        </div>

        {type === "profile" && <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">{CURRENT_USER.name.slice(0, 2).toUpperCase()}</div><div><p className="text-sm font-semibold text-gray-950">{CURRENT_USER.name}</p><p className="text-xs text-gray-500">{CURRENT_USER.role}</p></div></div></div>
          <button type="button" onClick={onOpenHistory} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-100">Lihat histori peminjaman <span className="float-right">→</span></button>
        </div>}

        {type === "notifications" && <div className="mt-5 space-y-3">
          <p className="text-sm text-gray-600">Jadwal terdekat yang tercatat dalam simulasi.</p>
          {nextEvents.length === 0 ? <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">Belum ada jadwal mendatang.</div> : nextEvents.map((event) => <button type="button" key={event.id} onClick={() => onOpenBooking(event)} className="w-full rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50"><div className="flex items-start justify-between gap-3"><span className="text-sm font-semibold text-gray-900">{event.title}</span><span className="text-[11px] text-gray-500">Lihat jadwal →</span></div><p className="mt-1 text-xs text-gray-600">{event.organizationName}</p><p className="mt-1 text-xs text-gray-500">{formatDate(event.date)} · {event.startTime.replace(".", ":")}–{event.endTime.replace(".", ":")} WIB</p></button>)}
          <p className="text-[11px] text-gray-400">Notifikasi ini dibuat dari data lokal, bukan pemberitahuan server.</p>
        </div>}

        {type === "settings" && <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-600">Pilih penyelenggara event yang ingin ditampilkan pada kalender. Pengaturan ini berlaku untuk semua tampilan kalender.</p>
          <div className="space-y-2">{organizations.map((organization) => <label key={organization.id} className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-3.5 py-3 hover:bg-gray-50"><span className="text-sm font-medium text-gray-800">{organization.name}</span><input type="checkbox" checked={selectedIds.includes(organization.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...previous, organization.id] : previous.filter((id) => id !== organization.id))} className="h-4 w-4 rounded border-gray-300 accent-blue-600" /></label>)}</div>
          <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Batal</button><button type="button" onClick={() => { onSaveOrganizations(selectedIds); onClose(); }} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">Simpan pengaturan</button></div>
        </div>}

        {type === "help" && <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-600">Periksa jadwal di kalender sebelum mengajukan peminjaman. Jika jadwal bentrok, pilih waktu lain yang tersedia.</p>
          <div className="space-y-3">{GUIDANCE_ITEMS.map((item) => <div key={item.number} className="flex gap-3 rounded-lg border border-gray-100 p-3"><span className="flex h-7 w-8 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-700">{item.number}</span><div><p className="text-sm font-semibold text-gray-900">{item.title}</p><p className="mt-0.5 text-xs text-gray-500">{item.description}</p></div></div>)}</div>
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">Untuk bantuan lebih lanjut, hubungi pengelola fasilitas kampus.</div>
        </div>}
      </section>
    </div>
  );
}
