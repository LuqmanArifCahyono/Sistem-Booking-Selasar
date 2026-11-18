// [FRONTEND CHANGE START: Modal Tambah Jadwal Manual Sub-Admin - Milestone 1]
"use client";

import React, { useState } from "react";
import { AdminOrganizationFilter, AdminTimelineSlot } from "@/types/admin";

interface AdminManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: AdminOrganizationFilter[];
  targetSlot?: AdminTimelineSlot | null;
  activeDate?: string;
  onSubmit: (newSlot: Partial<AdminTimelineSlot>) => void;
}

export function AdminManualBookingModal({
  isOpen,
  onClose,
  organizations,
  targetSlot,
  activeDate = "12/11/2026",
  onSubmit,
}: AdminManualBookingModalProps) {
  const [eventName, setEventName] = useState("");
  const [organizationId, setOrganizationId] = useState("himasifo");
  const [personInCharge, setPersonInCharge] = useState("");
  const [contactPJ, setContactPJ] = useState("");
  const [timeSlot, setTimeSlot] = useState(targetSlot?.timeSlot || "18.00 - 20.00 WIB");
  const [purpose, setPurpose] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !personInCharge.trim()) {
      setErrorMsg("Mohon lengkapi nama event dan penanggung jawab.");
      return;
    }

    const org = organizations.find((o) => o.id === organizationId);
    onSubmit({
      id: targetSlot ? targetSlot.id : `slot-${Date.now()}`,
      eventName,
      organizationId,
      organizationName: org?.name || "Organisasi Mahasiswa",
      personInCharge,
      contactPJ: contactPJ || "0812-0000-1111",
      purpose: purpose || "Kegiatan peminjaman manual area selasar kampus oleh Sub-Admin.",
      timeSlot,
      status: "dipesan",
      date: activeDate,
      isManual: true,
    });

    onClose();
  };

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
                Tambah Jadwal Manual (12/11/2026)
              </h3>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
                Isi data peminjaman untuk tanggal 12/11/2026
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
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
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
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
                <option value="lainnya">Komunitas / UKM Lainnya</option>
              </select>
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

          {/* Grid Slot Jam & Kontak PJ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Pilih Slot Jam (08.00 - 20.00 WIB)
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="08.00 - 10.00 WIB">08.00 - 10.00 WIB</option>
                <option value="10.00 - 12.00 WIB">10.00 - 12.00 WIB</option>
                <option value="12.00 - 14.00 WIB">12.00 - 14.00 WIB</option>
                <option value="13.00 - 15.00 WIB">13.00 - 15.00 WIB</option>
                <option value="15.00 - 17.00 WIB">15.00 - 17.00 WIB</option>
                <option value="18.00 - 20.00 WIB">18.00 - 20.00 WIB</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#0F172B] dark:text-[#F8FAFC] block mb-1">
                Nomor Kontak / WhatsApp PJ
              </label>
              <input
                type="text"
                value={contactPJ}
                onChange={(e) => setContactPJ(e.target.value)}
                placeholder="Contoh: 0812-8899-1122"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
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
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors cursor-pointer"
            >
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Tambah Jadwal Manual Sub-Admin - Milestone 1]
