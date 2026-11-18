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
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function BookingDetailModal({
  event,
  onClose,
  onCancelBooking,
  onEditBooking,
}: BookingDetailModalProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    setConfirmCancel(false);
  }, [event?.id]);

  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [event, onClose]);

  if (!event) return null;
  const time = (v: string) => v.replace(".", ":");

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 dark:bg-black/70 p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#111827] text-gray-900 dark:text-[#F8FAFC] shadow-2xl transition-colors"
      >
        <header className="flex items-start justify-between border-b border-gray-100 dark:border-[#1E293B] px-5 py-4 sm:px-6">
          <div>
            <h2 id="booking-detail-title" className="text-lg font-semibold text-gray-950 dark:text-[#F8FAFC]">
              Detail Jadwal Peminjaman
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-[#94A3B8]">
              Informasi kegiatan pada kalender SelasarSpace
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="rounded-lg p-2 text-gray-500 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1E293B] cursor-pointer"
          >
            ✕
          </button>
        </header>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-[#94A3B8]">Nama kegiatan</p>
            <h3 className="mt-1 text-xl font-semibold text-gray-950 dark:text-[#F8FAFC]">{event.title}</h3>
            <span
              className={`mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-medium ${event.bgClass} ${event.textClass} ${event.borderClass}`}
            >
              {event.organizationName}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Tanggal</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-[#F8FAFC]">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Waktu</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-[#F8FAFC]">
                {time(event.startTime)} – {time(event.endTime)} WIB
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Penyelenggara</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-[#F8FAFC]">{event.organizationName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Penanggung jawab</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-[#F8FAFC]">
                {event.personInCharge || "Belum dicantumkan"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Keperluan peminjaman</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-[#CBD5E1]">
              {event.purpose || "Informasi keperluan belum tersedia untuk jadwal contoh."}
            </p>
          </div>

          {event.notes && (
            <div>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8]">Catatan tambahan</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-[#CBD5E1]">{event.notes}</p>
            </div>
          )}

          {confirmCancel && (
            <div role="alert" className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-3">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">Batalkan jadwal ini?</p>
              <p className="mt-1 text-xs text-red-700 dark:text-red-400">Jadwal akan dihapus dari simulasi kalender lokal.</p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-xs text-gray-700 dark:text-[#CBD5E1] cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => onCancelBooking(event)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                >
                  Ya, batalkan
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-[#1E293B] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onEditBooking(event)}
              className="text-xs font-semibold text-blue-600 dark:text-[#93C5FD] hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
            >
              Edit Jadwal
            </button>
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
            >
              Batalkan Jadwal
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-950 hover:bg-gray-800 dark:bg-[#1E293B] dark:hover:bg-[#334155] dark:border dark:border-slate-700 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </footer>
      </section>
    </div>
  );
}
