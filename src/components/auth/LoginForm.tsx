// [FRONTEND CHANGE START: Integrasi Modal Lupa Kata Sandi - Milestone 3]
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QUICK_ACCOUNTS } from "@/constants/auth";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

export function LoginForm() {
  const router = useRouter();

  // Form input states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & status states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Modal Forgot Password state (Milestone 3)
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Quick account fill handler
  const handleQuickFill = (accId: string) => {
    const account = QUICK_ACCOUNTS.find((acc) => acc.id === accId);
    if (!account) return;

    setIdentifier(account.identifier);
    setPassword(account.passwordDemo);
    setValidationError(null);
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation: pastikan kolom username dan sandi terisi
    if (!identifier.trim() || !password.trim()) {
      setValidationError(
        "Lengkapi username atau email kampus dan kata sandi untuk masuk."
      );
      return;
    }

    setValidationError(null);
    setIsVerifying(true);

    // Simulasi respons autentikasi client-side tanpa panggilan backend
    setTimeout(() => {
      setIsVerifying(false);
      setSuccessInfo(
        "Login Berhasil! Mengalihkan ke Kalender Peminjaman SelasarSpace..."
      );

      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 800);
  };

  return (
    <>
      <div className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs">
        {/* Category Eyebrow */}
        <span className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
          Portal Akses Organisasi Kemahasiswaan
        </span>

        {/* Main Heading & Subtitle */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172B] mt-1">
          Masuk Akun Organisasi
        </h1>
        <p className="text-xs sm:text-sm text-[#62748E] mt-1 leading-relaxed">
          Gunakan Username Akun atau Email Kampus yang telah terdaftar.
        </p>

        {/* Quick Account Fill Chips dengan Warna 2563EB & Hover Effect */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0]/70">
          <span className="text-xs font-medium text-[#62748E] block mb-2">
            Isi cepat akun:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickFill(acc.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#2563EB]/40 bg-[#2563EB]/5 text-[#2563EB] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] hover:shadow-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                {acc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          {/* Username / Email Field */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold text-[#314158] mb-1.5"
            >
              Username Akun atau Email Kampus
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: @robotika_upn atau robotika_upn@student.kampus.ac.id"
              aria-invalid={validationError ? "true" : "false"}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172B] placeholder:text-[#62748E]/70 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
          </div>

          {/* Password Field with Visibility Toggle & Cursor Pointer */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#314158] mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Masukkan kata sandi"
                aria-invalid={validationError ? "true" : "false"}
                className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#0F172B] placeholder:text-[#62748E]/70 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#62748E] hover:text-[#2563EB] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md transition-colors"
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Session with Cursor Pointer & Forgot Password Modal Trigger */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#314158] hover:text-[#0F172B]">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 rounded border-[#CAD5E2] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
              <span>Ingat sesi saya</span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
            >
              Lupa kata sandi?
            </button>
          </div>

          {/* Validation Error Message Alert */}
          {validationError && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 text-xs rounded-xl bg-[#BB4D00]/10 border border-[#BB4D00]/30 text-[#BB4D00] animate-in fade-in duration-200"
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
              <span className="leading-snug font-medium">{validationError}</span>
            </div>
          )}

          {/* Success Redirect Feedback */}
          {successInfo && (
            <div
              role="status"
              className="flex items-start gap-2 p-3 text-xs rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-in fade-in duration-200"
            >
              <svg
                className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-semibold text-emerald-900">{successInfo}</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Sesi terverifikasi sebagai {identifier}.
                </p>
              </div>
            </div>
          )}

          {/* Primary Submit Button dengan Warna #2563EB, Hover Effect, dan Cursor Pointer */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] shadow-sm hover:shadow-md hover:scale-[1.008] active:scale-[0.99] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FFFFFF]"
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
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Kalender Selasar</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>

          {/* Register / Sign Up Navigation Link */}
          <div className="text-center pt-3 border-t border-[#E2E8F0]/70">
            <p className="text-xs text-[#62748E]">
              Organisasi Anda belum terdaftar?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
              >
                Buat Akun Organisasi
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal Dialog Lupa Kata Sandi (Milestone 3) */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultIdentifier={identifier}
      />
    </>
  );
}
// [FRONTEND CHANGE END: Integrasi Modal Lupa Kata Sandi - Milestone 3]
