"use client";

import React, { useEffect, useState } from "react";
import { BookingEvent } from "@/types";

interface BookingDetailModalProps {
  event: BookingEvent | null;
  onClose: () => void;
  onCancelBooking: (event: BookingEvent) => void;
  onEditBooking: (event: BookingEvent) => void;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(year, month - 1, day));
}

export function BookingDetailModal({ event, onClose, onCancelBooking, onEditBooking }: BookingDetailModalProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  useEffect(() => { setConfirmCancel(false); }, [event?.id]);
  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [event, onClose]);
  if (!event) return null;
  const time = (v: string) => v.replace(".", ":");
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-3 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="booking-detail-title" className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div><h2 id="booking-detail-title" className="text-lg font-semibold text-gray-950">Detail Jadwal Peminjaman</h2><p className="mt-1 text-xs text-gray-500">Informasi kegiatan pada kalender SelasarSpace</p></div>
          <button type="button" onClick={onClose} aria-label="Tutup detail" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">✕</button>
        </header>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div><p className="text-xs font-medium text-gray-500">Nama kegiatan</p><h3 className="mt-1 text-xl font-semibold text-gray-950">{event.title}</h3><span className={`mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-medium ${event.bgClass} ${event.textClass} ${event.borderClass}`}>{event.organizationName}</span></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><p className="text-xs text-gray-500">Tanggal</p><p className="mt-1 text-sm font-medium text-gray-900">{formatDate(event.date)}</p></div>
            <div><p className="text-xs text-gray-500">Waktu</p><p className="mt-1 text-sm font-medium text-gray-900">{time(event.startTime)} – {time(event.endTime)} WIB</p></div>
            <div><p className="text-xs text-gray-500">Penyelenggara</p><p className="mt-1 text-sm font-medium text-gray-900">{event.organizationName}</p></div>
            <div><p className="text-xs text-gray-500">Penanggung jawab</p><p className="mt-1 text-sm font-medium text-gray-900">{event.personInCharge || "Belum dicantumkan"}</p></div>
          </div>
          <div><p className="text-xs text-gray-500">Keperluan peminjaman</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{event.purpose || "Informasi keperluan belum tersedia untuk jadwal contoh."}</p></div>
          {event.notes && <div><p className="text-xs text-gray-500">Catatan tambahan</p><p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{event.notes}</p></div>}
          {confirmCancel && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3"><p className="text-sm font-semibold text-red-800">Batalkan jadwal ini?</p><p className="mt-1 text-xs text-red-700">Jadwal akan dihapus dari simulasi kalender lokal.</p><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => setConfirmCancel(false)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs">Kembali</button><button type="button" onClick={() => onCancelBooking(event)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Ya, batalkan</button></div></div>}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6"><div className="flex items-center gap-4"><button type="button" onClick={() => onEditBooking(event)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Edit Jadwal</button><button type="button" onClick={() => setConfirmCancel(true)} className="text-xs font-semibold text-red-600 hover:text-red-700">Batalkan Jadwal</button></div><button type="button" onClick={onClose} className="rounded-lg bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-800">Tutup</button></footer>
      </section>
    </div>
  );
}
