// [FRONTEND CHANGE START: Komponen Modal Pemulihan Kata Sandi - Milestone 3]
"use client";

import React, { useState, useEffect } from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIdentifier?: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  defaultIdentifier = "",
}: ForgotPasswordModalProps) {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sinkronisasi nilai default ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      setIdentifier(defaultIdentifier);
      setError(null);
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, defaultIdentifier]);

  // Listener tombol Escape untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi lokal: pastikan identitas organisasi diisi
    if (!identifier.trim()) {
      setError("Masukkan username atau email organisasi Anda.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Simulasi pengiriman permintaan ke Sub-Admin (Frontend only tanpa backend API)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      {/* Backdrop click to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
        {/* Close (X) Button Top-Right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela pemulihan kata sandi"
          className="absolute right-4 top-4 p-1.5 text-[#62748E] hover:text-[#0F172B] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase block">
            Bantuan Akses Fasilitas Kampus
          </span>
          <h2
            id="forgot-password-title"
            className="text-lg sm:text-xl font-bold text-[#0F172B] mt-1"
          >
            Atur Ulang Kata Sandi Organisasi
          </h2>
          <p className="text-xs text-[#62748E] mt-2 leading-relaxed">
            Akun organisasi kemahasiswaan dikelola secara terpusat oleh pengelola fasilitas kampus (Sub Admin). Masukkan identitas akun Anda untuk meneruskan permintaan sandi sementara.
          </p>
        </div>

        {/* Kondisi 1: Form Pengajuan Reset Sandi */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <div>
              <label
                htmlFor="reset-identifier"
                className="block text-xs font-semibold text-[#314158] mb-1.5"
              >
                Username atau Email Organisasi
              </label>
              <input
                id="reset-identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Contoh: @bem_fisip atau bem_fisip@student.kampus.ac.id"
                aria-invalid={error ? "true" : "false"}
                autoFocus
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172B] placeholder:text-[#62748E]/70 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              />
            </div>

            {/* Alert Error Validasi */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 text-xs rounded-xl bg-[#BB4D00]/10 border border-[#BB4D00]/30 text-[#BB4D00] animate-in fade-in duration-150"
              >
                <svg
                  className="w-4 h-4 text-[#BB4D00] shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="leading-snug font-medium">{error}</span>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]/70">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#314158] hover:bg-[#F1F5F9] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Mengirim permintaan...</span>
                  </>
                ) : (
                  <span>Kirim Permintaan Reset ke Sub Admin</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Kondisi 2: Feedback Berhasil Terkirim (State 2 di PDF 05) */
          <div className="mt-5 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#00BC7D]/10 border border-[#00BC7D]/30 text-[#00BC7D]">
              <div className="w-6 h-6 rounded-full bg-[#00BC7D] text-white flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-xs text-[#0F172B] leading-relaxed">
                Permintaan reset sandi telah diteruskan ke Panel Sub Admin. Silakan hubungi pengelola fasilitas untuk sandi sementara.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]/70">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F172B] hover:bg-[#1E293B] text-white shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172B]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Komponen Modal Pemulihan Kata Sandi - Milestone 3]
