// [FRONTEND CHANGE START: Modal Bantuan Pengelola Fasilitas - Milestone 1]
"use client";

import React from "react";

interface AdminSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSupportModal({
  isOpen,
  onClose,
}: AdminSupportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-support-title"
        className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-xl p-5 sm:p-6 transition-all"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <h3 id="modal-support-title" className="text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
            Hubungi Pengelola Fasilitas
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs leading-relaxed">
          <p className="text-[#62748E] dark:text-[#94A3B8]">
            Biro Umum & Sarana Prasarana Kampus:
          </p>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
            <span className="font-bold text-[#0F172B] dark:text-[#F8FAFC] block text-sm">
              Layanan Terpadu Fasilitas Selasar
            </span>
            <p className="text-[#314158] dark:text-[#CBD5E1]">
              WhatsApp Helpdesk: <strong className="text-[#2563EB] dark:text-[#93C5FD]">0812-8890-2026</strong>
            </p>
            <p className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">
              Jam Pelayanan: Senin – Jumat pukul 08.00 – 16.00 WIB
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#0F172B] dark:bg-[#1E293B] hover:bg-[#334155] text-white transition-all cursor-pointer shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Bantuan Pengelola Fasilitas - Milestone 1]
