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
    "mt-1 w-full rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-3 py-2.5 text-sm text-gray-900 dark:text-[#F8FAFC] placeholder-gray-400 dark:placeholder-[#64748B] outline-none focus:border-blue-500 dark:focus:border-[#93C5FD] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-700 dark:text-[#CBD5E1]";

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
      className="fixed inset-0 z-[130] flex items-center justify-center bg-gray-950/45 dark:bg-black/70 p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-edit-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#111827] shadow-2xl transition-colors"
      >
        <header className="flex items-start justify-between border-b border-gray-100 dark:border-[#1E293B] px-5 py-4">
          <div>
            <h2 id="booking-edit-title" className="text-lg font-semibold text-gray-950 dark:text-[#F8FAFC]">
              Edit Peminjaman Tempat
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-[#94A3B8]">
              Perbarui informasi jadwal peminjaman.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 text-gray-500 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1E293B] cursor-pointer"
          >
            ✕
          </button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div>
              <label className={labelClass} htmlFor="edit-title">
                Nama event
              </label>
              <input
                id="edit-title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
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
                  Penanggung jawab
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
                  Mulai
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
                  Selesai
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
                Keperluan peminjaman
              </label>
              <textarea
                id="edit-purpose"
                className={`${inputClass} min-h-20 resize-y`}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-notes">
                Catatan tambahan
              </label>
              <textarea
                id="edit-notes"
                className={`${inputClass} min-h-16 resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-300"
              >
                {error}
              </p>
            )}
          </div>

          <footer className="flex justify-end gap-2 border-t border-gray-100 dark:border-[#1E293B] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 dark:border-[#334155] px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 dark:bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
            >
              Simpan perubahan
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
