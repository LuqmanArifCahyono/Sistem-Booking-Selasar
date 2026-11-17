"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Organization } from "@/types";

export interface BookingFormValues {
  title: string;
  organizationId: string;
  personInCharge: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  notes: string;
}

interface BookingFormModalProps {
  open: boolean;
  selectedDate: Date;
  organizations: Organization[];
  onClose: () => void;
  onSubmit: (values: BookingFormValues) => void;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingFormModal({
  open,
  selectedDate,
  organizations,
  onClose,
  onSubmit,
}: BookingFormModalProps) {
  const [title, setTitle] = useState("");
  const [organizationId, setOrganizationId] = useState(
    organizations[0]?.id ?? ""
  );
  const [personInCharge, setPersonInCharge] = useState("Jonathan");
  const [date, setDate] = useState(toDateInputValue(selectedDate));
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(toDateInputValue(selectedDate));
    setOrganizationId(organizations[0]?.id ?? "");
    setError("");
  }, [open, selectedDate, organizations]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !personInCharge.trim() || !purpose.trim()) {
      setError("Lengkapi nama event, penanggung jawab, dan keperluan peminjaman.");
      return;
    }
    if (endTime <= startTime) {
      setError("Waktu selesai harus setelah waktu mulai.");
      return;
    }
    if (!organizationId) {
      setError("Pilih organisasi penyelenggara.");
      return;
    }

    onSubmit({
      title: title.trim(),
      organizationId,
      personInCharge: personInCharge.trim(),
      date,
      startTime,
      endTime,
      purpose: purpose.trim(),
      notes: notes.trim(),
    });
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "block text-xs font-medium text-gray-700";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/45 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-form-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 id="booking-form-title" className="text-lg font-semibold text-gray-950">
              Form Peminjaman Tempat
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Lengkapi informasi kegiatan yang akan diajukan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label htmlFor="booking-title" className={labelClass}>Nama event</label>
              <input id="booking-title" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Rapat Kerja Tahunan" required maxLength={100} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-organization" className={labelClass}>Penyelenggara</label>
                <select id="booking-organization" className={inputClass} value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} required>
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>{organization.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="booking-person" className={labelClass}>Nama penanggung jawab</label>
                <input id="booking-person" className={inputClass} value={personInCharge} onChange={(e) => setPersonInCharge(e.target.value)} required maxLength={100} />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Tanggal dan jam peminjaman</legend>
              <div className="mt-1.5 grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label htmlFor="booking-date" className="text-[11px] text-gray-500">Tanggal</label>
                  <input id="booking-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="booking-start" className="text-[11px] text-gray-500">Mulai</label>
                  <input id="booking-start" type="time" className={inputClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="booking-end" className="text-[11px] text-gray-500">Selesai</label>
                  <input id="booking-end" type="time" className={inputClass} value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
              </div>
            </fieldset>

            <div>
              <label htmlFor="booking-purpose" className={labelClass}>Keperluan peminjaman</label>
              <textarea id="booking-purpose" className={`${inputClass} min-h-24 resize-y`} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Jelaskan tujuan dan kegiatan yang akan dilaksanakan." required maxLength={500} />
            </div>

            <div>
              <label htmlFor="booking-notes" className={labelClass}>Catatan tambahan <span className="font-normal text-gray-400">(opsional)</span></label>
              <textarea id="booking-notes" className={`${inputClass} min-h-20 resize-y`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Kebutuhan ruang, peralatan, atau informasi tambahan." maxLength={500} />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
            )}
            <p className="text-[11px] leading-relaxed text-gray-500">
              Ini merupakan simulasi frontend. Data pengajuan hanya disimpan sementara pada tampilan aplikasi dan belum dikirim ke server.
            </p>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              Batal
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
              Simpan jadwal
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
