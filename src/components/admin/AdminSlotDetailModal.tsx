// [FRONTEND CHANGE START: Modal Detail Jadwal Panel Sub-Admin - Milestone 1]
"use client";

import React, { useState } from "react";
import { AdminTimelineSlot } from "@/types/admin";
import { DAY_NAMES_ID } from "@/constants/admin";

function formatSlotDateWithDay(dateStr: string): string {
  if (!dateStr) return "-";
  let d: Date | null = null;
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/").map(Number);
    d = new Date(year, month - 1, day);
  } else if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-").map(Number);
    d = new Date(year, month - 1, day);
  }
  if (!d || isNaN(d.getTime())) return dateStr;
  return `${DAY_NAMES_ID[d.getDay()]}, ${dateStr}`;
}

interface AdminSlotDetailModalProps {
  slot: AdminTimelineSlot | null;
  onClose: () => void;
  userRole?: string;
  onEditBooking?: (slot: AdminTimelineSlot) => void;
  onDeleteBooking?: (slot: AdminTimelineSlot) => void;
}

export function AdminSlotDetailModal({
  slot,
  onClose,
  userRole,
  onEditBooking,
  onDeleteBooking,
}: AdminSlotDetailModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Render-time state reset when slot changes
  const [prevSlotId, setPrevSlotId] = useState(slot?.id);
  if (slot?.id !== prevSlotId) {
    setPrevSlotId(slot?.id);
    setConfirmDelete(false);
  }

  if (!slot) return null;

  const isBentrok = slot.status === "bentrok";
  const isDipesan = slot.status === "dipesan";
  const isTersedia = slot.status === "tersedia";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDeleteBooking?.(slot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-slot-title"
        className="w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-xl p-5 sm:p-6 transition-all"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#93C5FD]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 id="modal-slot-title" className="text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Detail Jadwal Selasar
              </h3>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
                Informasi lengkap slot dan peminjam ormawa
              </p>
            </div>
          </div>

          {/* Badge Status */}
          <div>
            {isDipesan && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Dipesan
              </span>
            )}
            {isBentrok && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-100 text-red-700 border border-red-300">
                Bentrok
              </span>
            )}
            {isTersedia && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                Tersedia
              </span>
            )}
          </div>
        </div>

        {/* Isi Rincian Kegiatan */}
        <div className="mt-4 space-y-3.5 text-xs">
          {/* Organisasi & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider block">
                Organisasi Penyelenggara
              </span>
              <span className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC] mt-1 block">
                {slot.organizationName || "Selasar Umum"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider block">
                Nama Agenda / Event
              </span>
              <span className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC] mt-1 block">
                {slot.eventName}
              </span>
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider block">
                Tanggal Terpilih
              </span>
              <span className="text-xs font-semibold text-[#0F172B] dark:text-[#F8FAFC] mt-1 block">
                {formatSlotDateWithDay(slot.date)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider block">
                Waktu Pelaksanaan
              </span>
              <span className="text-xs font-bold text-[#2563EB] dark:text-[#93C5FD] mt-1 block">
                {slot.timeSlot}
              </span>
            </div>
          </div>

          {/* Penanggung Jawab & Kontak */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider">
                Penanggung Jawab (PJ)
              </span>
              <span className="text-[11px] text-[#2563EB] dark:text-[#93C5FD] font-mono">
                {slot.contactPJ || "Kontak tersedia di akun ormawa"}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#0F172B] dark:text-[#F8FAFC] mt-1 block">
              {slot.personInCharge || "Belum ditentukan"}
            </span>
          </div>

          {/* Keperluan Peminjaman */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B]">
            <span className="text-[10px] font-bold text-[#62748E] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
              Keperluan Peminjaman
            </span>
            <p className="text-xs text-[#314158] dark:text-[#CBD5E1] leading-relaxed">
              {slot.purpose || "Kegiatan rutin organisasi mahasiswa di area selasar kampus."}
            </p>
          </div>

          {/* Info Audit / Super Admin Badge */}
          {isSuperAdmin ? (
            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200 flex items-start gap-2">
              <span className="text-sm shrink-0">🛡️</span>
              <span>
                <strong>Kontrol Super Admin:</strong> Anda memiliki wewenang penuh untuk mengubah detail, memindahkan tanggal/jam kegiatan, atau menghapus jadwal ini langsung dari panel.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <span className="text-sm shrink-0">⚠️</span>
              <span>
                <strong>Ketentuan Sub-Admin:</strong> Pembatalan jadwal hanya dilakukan secara mandiri oleh akun ormawa yang bersangkutan melalui formulir pembatalan berlandaskan alasan valid.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between gap-2 flex-wrap">
          {/* Tombol Super Admin (Ubah & Hapus) */}
          {isSuperAdmin && isDipesan ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditBooking?.(slot);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>✏️</span>
                <span>Ubah / Pindah Jadwal</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  confirmDelete
                    ? "bg-[#DC2626] hover:bg-[#B91C1C] text-white animate-pulse"
                    : "border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                }`}
              >
                <span>🗑️</span>
                <span>{confirmDelete ? "Yakin Hapus Jadwal?" : "Hapus Jadwal"}</span>
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#0F172B] dark:bg-[#1E293B] hover:bg-[#334155] text-white transition-all cursor-pointer shadow-xs"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Detail Jadwal Panel Sub-Admin - Milestone 1]
