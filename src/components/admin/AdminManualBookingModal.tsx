// [FRONTEND CHANGE START: Modal Tambah Jadwal Manual Sub-Admin - Milestone 1]
"use client";

import React, { useState } from "react";
import { AdminOrganizationFilter, AdminTimelineSlot } from "@/types/admin";

export interface AdminManualBookingSubmitData {
  title: string;
  organizationId: string;
  roomId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  pjName: string;
  pjContact: string;
  purpose?: string;
}

interface AdminManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: AdminOrganizationFilter[];
  targetSlot?: AdminTimelineSlot | null;
  activeDate?: string; // Format tampilan (e.g. 19/11/2026)
  dateISO?: string; // Format database (YYYY-MM-DD)
  userRole?: string;
  userOrganizationId?: string | null;
  onSubmit: (data: AdminManualBookingSubmitData) => Promise<boolean | void>;
}

export function AdminManualBookingModal({
  isOpen,
  onClose,
  organizations,
  targetSlot,
  activeDate = "19/11/2026",
  dateISO,
  userRole,
  userOrganizationId,
  onSubmit,
}: AdminManualBookingModalProps) {
  // Parse slot rawTime if available
  const initialTimes = () => {
    if (targetSlot?.rawTime && targetSlot.rawTime.includes("-")) {
      const parts = targetSlot.rawTime.split("-").map((s) => s.trim());
      return { start: parts[0] || "08:00", end: parts[1] || "10:00" };
    }
    return { start: "08:00", end: "10:00" };
  };

  const defaultOrgId = () => {
    if (userRole === "ADMIN" && userOrganizationId) {
      return userOrganizationId;
    }
    return organizations[0]?.id || "";
  };

  const [eventName, setEventName] = useState("");
  const [organizationId, setOrganizationId] = useState(defaultOrgId());
  const [personInCharge, setPersonInCharge] = useState("");
  const [contactPJ, setContactPJ] = useState("");
  const [startTime, setStartTime] = useState(initialTimes().start);
  const [endTime, setEndTime] = useState(initialTimes().end);
  const [purpose, setPurpose] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Render-time state reset when modal opens or targetSlot changes
  const [prevOpen, setPrevOpen] = useState(isOpen);
  const [prevTargetSlot, setPrevTargetSlot] = useState(targetSlot);

  if (isOpen && (!prevOpen || targetSlot !== prevTargetSlot)) {
    setPrevOpen(isOpen);
    setPrevTargetSlot(targetSlot);
    const times = initialTimes();
    setStartTime(times.start);
    setEndTime(times.end);
    setEventName("");
    setPersonInCharge("");
    setContactPJ("");
    setPurpose("");
    setErrorMsg(null);
    setOrganizationId(defaultOrgId());
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  if (!isOpen) return null;

  // Resolve target date in YYYY-MM-DD format
  const resolvedDateISO = () => {
    if (dateISO) return dateISO;
    if (activeDate.includes("/")) {
      const [d, m, y] = activeDate.split("/");
      return `${y}-${m}-${d}`;
    }
    return activeDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !personInCharge.trim() || !contactPJ.trim()) {
      setErrorMsg("Mohon lengkapi nama kegiatan, penanggung jawab, dan nomor kontak.");
      return;
    }

    if (!startTime || !endTime || startTime >= endTime) {
      setErrorMsg("Jam mulai harus lebih awal dari jam selesai.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await onSubmit({
        title: eventName.trim(),
        organizationId,
        date: resolvedDateISO(),
        startTime,
        endTime,
        pjName: personInCharge.trim(),
        pjContact: contactPJ.trim(),
        purpose: purpose.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan jadwal manual.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const isRestrictedAdmin = userRole === "ADMIN" && Boolean(userOrganizationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-manual-title"
        className="w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-xl p-5 sm:p-6 transition-all"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#93C5FD] font-bold">
              +
            </div>
            <div>
              <h3 id="modal-manual-title" className="text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Tambah Jadwal Manual ({activeDate})
              </h3>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
                Isi data peminjaman untuk tanggal {activeDate}
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
              Nama Event / Kegiatan *
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Contoh: Rapat Koordinasi Panitia Pameran"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Grid Organisasi & PJ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Organisasi Penyelenggara
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                disabled={isRestrictedAdmin}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {isRestrictedAdmin && (
                <span className="text-[10px] text-[#62748E] dark:text-[#94A3B8] mt-0.5 block">
                  Terkunci pada himpunan Anda
                </span>
              )}
            </div>

            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Penanggung Jawab (PJ) *
              </label>
              <input
                type="text"
                value={personInCharge}
                onChange={(e) => {
                  setPersonInCharge(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Contoh: Farhan Syahputra"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                required
              />
            </div>
          </div>

          {/* Grid Jam Mulai & Selesai */}
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

          {/* Nomor Kontak PJ */}
          <div>
            <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
              Nomor Kontak / WhatsApp PJ *
            </label>
            <input
              type="text"
              value={contactPJ}
              onChange={(e) => setContactPJ(e.target.value)}
              placeholder="Contoh: 0812-8899-1122"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Keperluan Peminjaman */}
          <div>
            <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
              Keperluan Peminjaman
            </label>
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Kegiatan organisasi di area selasar kampus..."
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
              {loading ? "Menyimpan..." : "Simpan Jadwal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Tambah Jadwal Manual Sub-Admin - Milestone 1]
