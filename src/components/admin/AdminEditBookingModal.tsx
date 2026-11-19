// [FRONTEND CHANGE START: Modal Ubah & Pindahkan Jadwal Super Admin]
"use client";

import React, { useState } from "react";
import { AdminOrganizationFilter, AdminTimelineSlot } from "@/types/admin";

interface AdminEditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: AdminTimelineSlot | null;
  organizations: AdminOrganizationFilter[];
  onSave: (
    bookingId: string,
    data: {
      title?: string;
      organizationId?: string;
      date?: string; // YYYY-MM-DD
      startTime?: string; // HH:mm
      endTime?: string; // HH:mm
      pjName?: string;
      pjContact?: string;
      purpose?: string;
    },
  ) => Promise<void>;
}

export function AdminEditBookingModal({
  isOpen,
  onClose,
  slot,
  organizations,
  onSave,
}: AdminEditBookingModalProps) {
  const parseSlotTimes = () => {
    if (slot?.rawTime && slot.rawTime.includes("-")) {
      const parts = slot.rawTime.split("-").map((s) => s.trim());
      return { start: parts[0] || "08:00", end: parts[1] || "10:00" };
    }
    return { start: "08:00", end: "10:00" };
  };

  const parseSlotDateISO = () => {
    if (!slot?.date) return "";
    if (slot.date.includes("/")) {
      const [d, m, y] = slot.date.split("/");
      return `${y}-${m}-${d}`;
    }
    return slot.date;
  };

  const [title, setTitle] = useState(slot?.eventName || "");
  const [organizationId, setOrganizationId] = useState(slot?.organizationId || "");
  const [date, setDate] = useState(parseSlotDateISO());
  const [startTime, setStartTime] = useState(parseSlotTimes().start);
  const [endTime, setEndTime] = useState(parseSlotTimes().end);
  const [personInCharge, setPersonInCharge] = useState(slot?.personInCharge || "");
  const [contactPJ, setContactPJ] = useState(slot?.contactPJ || "");
  const [purpose, setPurpose] = useState(slot?.purpose || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Render-time state reset when slot changes
  const [prevSlotId, setPrevSlotId] = useState(slot?.id);
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen && (!prevOpen || slot?.id !== prevSlotId)) {
    setPrevOpen(isOpen);
    setPrevSlotId(slot?.id);
    setTitle(slot?.eventName || "");
    setOrganizationId(slot?.organizationId || organizations[0]?.id || "");
    setDate(parseSlotDateISO());
    const times = parseSlotTimes();
    setStartTime(times.start);
    setEndTime(times.end);
    setPersonInCharge(slot?.personInCharge || "");
    setContactPJ(slot?.contactPJ || "");
    setPurpose(slot?.purpose || "");
    setErrorMsg(null);
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  if (!isOpen || !slot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !personInCharge.trim() || !date) {
      setErrorMsg("Mohon lengkapi nama kegiatan, tanggal, dan penanggung jawab.");
      return;
    }

    if (startTime >= endTime) {
      setErrorMsg("Jam mulai harus lebih awal dari jam selesai.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await onSave(slot.id, {
        title: title.trim(),
        organizationId: organizationId || undefined,
        date,
        startTime,
        endTime,
        pjName: personInCharge.trim(),
        pjContact: contactPJ.trim() || undefined,
        purpose: purpose.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui jadwal.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-booking-title"
        className="w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-xl p-5 sm:p-6 transition-all"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#93C5FD]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 id="modal-edit-booking-title" className="text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Ubah & Pindahkan Jadwal Selasar
              </h3>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
                Kontrol Penuh Super Admin — Sesuaikan waktu, tanggal, atau rincian agenda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-900">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Nama Event */}
          <div>
            <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
              Nama Agenda / Kegiatan *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Grid Organisasi & Tanggal Pindah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Organisasi Penyelenggara
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Tanggal Pelaksanaan (Pindah Hari) *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                required
              />
            </div>
          </div>

          {/* Grid Jam Mulai & Jam Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Jam Mulai (HH:mm) *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Jam Selesai (HH:mm) *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                required
              />
            </div>
          </div>

          {/* Grid PJ & Kontak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Penanggung Jawab (PJ) *
              </label>
              <input
                type="text"
                value={personInCharge}
                onChange={(e) => setPersonInCharge(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Kontak WhatsApp PJ
              </label>
              <input
                type="text"
                value={contactPJ}
                onChange={(e) => setContactPJ(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Keperluan */}
          <div>
            <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
              Keperluan Peminjaman
            </label>
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Ubah & Pindahkan Jadwal Super Admin]
