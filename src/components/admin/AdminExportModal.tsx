// [FRONTEND CHANGE START: Modal Ekspor Laporan Statistik Pemakaian - Milestone 1]
"use client";

import React, { useState } from "react";

interface AdminExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminExportModal({
  isOpen,
  onClose,
}: AdminExportModalProps) {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (format: "CSV" | "PDF") => {
    setDownloadNotice(`Mengunduh file laporan statistik (${format})...`);
    setTimeout(() => {
      setDownloadNotice(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-export-title"
        className="w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-xl p-5 sm:p-6 transition-all"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div>
            <h3 id="modal-export-title" className="text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
              Ekspor Laporan Statistik Pemakaian
            </h3>
            <p className="text-xs text-[#62748E] dark:text-[#94A3B8] mt-0.5">
              Rekapitulasi peminjaman per organisasi s.d. tanggal 12/11/2026
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Feedback Alert */}
        {downloadNotice && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
            {downloadNotice}
          </div>
        )}

        {/* Daftar Ringkasan Penggunaan Ormawa */}
        <div className="mt-4 divide-y divide-[#E2E8F0]/70 dark:divide-[#1E293B] text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0F172B] dark:text-[#F8FAFC] block">Himasifo</span>
              <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">@himasifo_upn</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">5 Sesi</span>
              <span className="text-[11px] text-[#DC2626] ml-2">1 Batal</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0F172B] dark:text-[#F8FAFC] block">BEM FISIP</span>
              <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">@bemfisip_upn</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">4 Sesi</span>
              <span className="text-[11px] text-[#62748E] ml-2">0 Batal</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0F172B] dark:text-[#F8FAFC] block">Himakom</span>
              <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">@himakom_upn</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">4 Sesi</span>
              <span className="text-[11px] text-[#62748E] ml-2">0 Batal</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0F172B] dark:text-[#F8FAFC] block">Himatifa</span>
              <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">@himatifa_upn</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">3 Sesi</span>
              <span className="text-[11px] text-[#62748E] ml-2">0 Batal</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0F172B] dark:text-[#F8FAFC] block">Hima Bisnis Digital</span>
              <span className="text-[11px] text-[#62748E] dark:text-[#94A3B8]">@himabisdig_upn</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">1 Sesi</span>
              <span className="text-[11px] text-[#62748E] ml-2">0 Batal</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => handleDownload("CSV")}
            className="px-3.5 py-2 text-xs font-bold rounded-lg border border-[#2563EB]/40 bg-[#2563EB]/5 text-[#2563EB] dark:text-[#93C5FD] hover:bg-[#2563EB]/15 transition-colors cursor-pointer"
          >
            Unduh CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownload("PDF")}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors cursor-pointer"
          >
            Unduh PDF
          </button>
        </div>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Ekspor Laporan Statistik Pemakaian - Milestone 1]
