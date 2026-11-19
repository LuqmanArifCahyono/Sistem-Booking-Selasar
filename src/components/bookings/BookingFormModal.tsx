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
  const [personInCharge, setPersonInCharge] = useState("");
  const [date, setDate] = useState(toDateInputValue(selectedDate));
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

  if (open && (!prevOpen || selectedDate !== prevSelectedDate)) {
    setPrevOpen(open);
    setPrevSelectedDate(selectedDate);
    setDate(toDateInputValue(selectedDate));
    setOrganizationId(organizations[0]?.id ?? "");
    setError("");
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

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
    "mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-muted";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 transition-all"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-form-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all"
      >
        <header className="flex items-start justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 id="booking-form-title" className="text-lg font-bold tracking-tight text-foreground">
                Tambah Peminjaman Selasar
              </h2>
              <p className="text-xs text-muted">Ajukan jadwal kegiatan untuk organisasi atau himpunan Anda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <div>
              <label htmlFor="booking-title" className={labelClass}>Nama Kegiatan</label>
              <input
                id="booking-title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Rapat Kerja Pengurus Himpunan"
                required
                maxLength={100}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-organization" className={labelClass}>Penyelenggara</label>
                <select
                  id="booking-organization"
                  className={inputClass}
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  required
                >
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>{organization.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="booking-person" className={labelClass}>Penanggung Jawab</label>
                <input
                  id="booking-person"
                  className={inputClass}
                  value={personInCharge}
                  onChange={(e) => setPersonInCharge(e.target.value)}
                  placeholder="Nama ketua atau koordinator pelaksana"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Tanggal dan Jam Kegiatan</legend>
              <div className="mt-1.5 grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label htmlFor="booking-date" className="text-xs text-muted">Tanggal</label>
                  <input id="booking-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="booking-start" className="text-xs text-muted">Jam Mulai</label>
                  <input id="booking-start" type="time" className={inputClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="booking-end" className="text-xs text-muted">Jam Selesai</label>
                  <input id="booking-end" type="time" className={inputClass} value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
              </div>
            </fieldset>

            <div>
              <label htmlFor="booking-purpose" className={labelClass}>Keperluan Peminjaman</label>
              <textarea
                id="booking-purpose"
                className={`${inputClass} min-h-24 resize-y`}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Jelaskan tujuan dan rangkaian kegiatan yang akan dilaksanakan di selasar..."
                required
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="booking-notes" className={labelClass}>Catatan Tambahan <span className="font-normal text-muted lowercase">(opsional)</span></label>
              <textarea
                id="booking-notes"
                className={`${inputClass} min-h-20 resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Kebutuhan listrik, perlengkapan suara, atau informasi tambahan..."
                maxLength={500}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 p-3.5 text-xs font-semibold text-status-cancelled animate-in fade-in duration-200"
              >
                {error}
              </p>
            )}
          </div>

          <footer className="flex items-center justify-end gap-2.5 border-t border-line bg-surface-muted/30 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-surface-muted active:scale-[0.98] transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-accent-foreground shadow-xs hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer"
            >
              Simpan Jadwal
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
