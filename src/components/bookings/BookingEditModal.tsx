"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { BookingEvent, Organization } from "@/types";

interface Props {
  event: BookingEvent | null;
  organizations: Organization[];
  onClose: () => void;
  onSave: (event: BookingEvent) => void;
}

export function BookingEditModal({ event, organizations, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [pjContact, setPjContact] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const [prevEvent, setPrevEvent] = useState(event);

  if (event !== prevEvent) {
    setPrevEvent(event);
    if (event) {
      setTitle(event.title);
      setOrganizationId(event.organizationId);
      setPersonInCharge(event.personInCharge ?? "");
      setPjContact(event.pjContact ?? "");
      setDate(event.date);
      setStartTime(event.startTime.replace(".", ":"));
      setEndTime(event.endTime.replace(".", ":"));
      setPurpose(event.purpose ?? "");
      setNotes(event.notes ?? "");
      setError("");
    }
  }

  useEffect(() => {
    if (!event) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [event, onClose]);

  if (!event) return null;

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-muted";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !personInCharge.trim() || !organizationId) {
      setError("Lengkapi seluruh informasi wajib.");
      return;
    }
    if (endTime <= startTime) {
      setError("Waktu selesai harus setelah waktu mulai.");
      return;
    }
    const org = organizations.find((item) => item.id === organizationId);
    if (!org) {
      setError("Organisasi tidak ditemukan.");
      return;
    }
    onSave({
      ...event,
      title: title.trim(),
      organizationId,
      organizationName: org.name,
      personInCharge: personInCharge.trim(),
      pjContact: pjContact.trim() || event.pjContact || "081234567890",
      date,
      startTime: startTime.replace(":", "."),
      endTime: endTime.replace(":", "."),
      purpose: purpose.trim(),
      notes: notes.trim(),
      status: "terjadwal",
    });
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 transition-all"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-edit-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all"
      >
        <header className="flex items-start justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 id="booking-edit-title" className="text-lg font-bold tracking-tight text-foreground">
                Edit Jadwal Peminjaman
              </h2>
              <p className="text-xs text-muted">Perbarui rincian waktu dan agenda kegiatan selasar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <div>
              <label className={labelClass} htmlFor="edit-title">
                Nama Kegiatan
              </label>
              <input
                id="edit-title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                placeholder="Contoh: Diskusi Terbuka Himpunan"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="edit-org">
                  Penyelenggara
                </label>
                <select
                  id="edit-org"
                  className={inputClass}
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-pic">
                  Penanggung Jawab
                </label>
                <input
                  id="edit-pic"
                  className={inputClass}
                  value={personInCharge}
                  onChange={(e) => setPersonInCharge(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-contact">
                  Kontak / WhatsApp
                </label>
                <input
                  id="edit-contact"
                  className={inputClass}
                  value={pjContact}
                  placeholder="081234567890"
                  onChange={(e) => setPjContact(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="edit-date">
                  Tanggal
                </label>
                <input
                  id="edit-date"
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-start">
                  Jam Mulai
                </label>
                <input
                  id="edit-start"
                  type="time"
                  className={inputClass}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-end">
                  Jam Selesai
                </label>
                <input
                  id="edit-end"
                  type="time"
                  className={inputClass}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-purpose">
                Keperluan Peminjaman
              </label>
              <textarea
                id="edit-purpose"
                className={`${inputClass} min-h-20 resize-y`}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                placeholder="Tuliskan tujuan dan keperluan penggunaan selasar..."
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-notes">
                Catatan Tambahan <span className="font-normal text-muted lowercase">(opsional)</span>
              </label>
              <textarea
                id="edit-notes"
                className={`${inputClass} min-h-16 resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Kebutuhan listrik, penataan meja, dan catatan lainnya..."
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

          <footer className="flex justify-end gap-2.5 border-t border-line bg-surface-muted/30 px-6 py-4">
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
              Simpan Perubahan
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
