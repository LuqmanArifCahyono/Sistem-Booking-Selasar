// [FRONTEND CHANGE START: Modal Konfirmasi Logout Sub-Admin - Milestone 1]
"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";

interface AdminLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLogoutModal({
  isOpen,
  onClose,
}: AdminLogoutModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    try {
      setLoading(true);
      await signOut({ callbackUrl: "/login" });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-logout-title"
        className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-xl p-5 sm:p-6 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-[#DC2626] dark:text-[#EF4444] flex items-center justify-center text-lg font-bold shrink-0">
            !
          </div>
          <div>
            <h3 id="modal-logout-title" className="text-base font-bold text-[#0F172B] dark:text-[#F8FAFC]">
              Keluar dari Panel Sub-Admin?
            </h3>
            <p className="text-xs text-[#62748E] dark:text-[#94A3B8] mt-1 leading-relaxed">
              Sesi pengelola Anda akan diakhiri. Anda perlu memasukkan kembali ID dan kata sandi staf untuk mengakses panel kontrol.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#314158] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sedang keluar..." : "Ya, Keluar"}
          </button>
        </div>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Modal Konfirmasi Logout Sub-Admin - Milestone 1]
