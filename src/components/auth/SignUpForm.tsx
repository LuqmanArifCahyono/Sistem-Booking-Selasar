// [FRONTEND CHANGE START: Form Registrasi Akun Ormawa dengan Biru Soft di Dark Mode - Milestone 5 Revisi 4]
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const router = useRouter();

  // Form input states
  const [formData, setFormData] = useState({
    organizationName: "",
    username: "",
    personInCharge: "",
    phone: "",
    campusEmail: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Submission states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Tanggal otomatis pendaftaran (Format DMY: DD/MM/YYYY)
  const [registrationDateFormatted, setRegistrationDateFormatted] = useState("18/11/2026");

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    setRegistrationDateFormatted(`${day}/${month}/${year}`);
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  // Validasi Frontend & Simulasi Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validasi kelengkapan kolom wajib & persetujuan tata tertib
    if (
      !formData.organizationName.trim() ||
      !formData.username.trim() ||
      !formData.personInCharge.trim() ||
      !formData.phone.trim() ||
      !formData.campusEmail.trim()
    ) {
      setValidationError("Lengkapi seluruh kolom identitas organisasi dan penanggung jawab.");
      return;
    }

    // 2. Validasi format email kampus
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.campusEmail.trim())) {
      setValidationError("Format email kampus tidak valid. Gunakan email resmi organisasi / kampus.");
      return;
    }

    // 3. Validasi nomor telepon / WhatsApp
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setValidationError("Nomor telepon/WhatsApp minimal 10 digit.");
      return;
    }

    // 4. Validasi kata sandi & konfirmasi
    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setValidationError("Lengkapi kata sandi dan konfirmasi kata sandi.");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Kata sandi minimal 6 karakter demi keamanan akun organisasi.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Konfirmasi kata sandi tidak cocok. Pastikan kedua kata sandi sama.");
      return;
    }

    // 5. Validasi persetujuan tata tertib
    if (!formData.termsAccepted) {
      setValidationError("Setujui pernyataan tata tertib pemakaian fasilitas kampus.");
      return;
    }

    // Lolos seluruh validasi: mulai simulasi pendaftaran
    setValidationError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Simulasi pengalihan kembali ke halaman Login setelah sukses
      setTimeout(() => {
        router.push("/login");
      }, 1400);
    }, 900);
  };

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs transition-colors">
      {/* Header Form dengan Tombol Back Ringkas untuk Mobile */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#93C5FD] tracking-wider uppercase">
          PORTAL AKSES ORGANISASI KEMAHASISWAAN
        </span>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#62748E] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#93C5FD] transition-colors cursor-pointer sm:hidden"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali</span>
        </Link>
      </div>

      {/* Main Heading & Subtitle */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172B] dark:text-[#F8FAFC] mt-1">
        Buat Akun Organisasi
      </h1>
      <p className="text-xs sm:text-sm text-[#62748E] dark:text-[#94A3B8] mt-1 leading-relaxed">
        Isi data organisasi dan penanggung jawab sesuai database kampus.
      </p>

      {/* Form Pendaftaran */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
        {/* Row 1: Nama Organisasi & Username Akun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="reg-org-name"
              className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
            >
              Nama Organisasi
            </label>
            <input
              id="reg-org-name"
              type="text"
              value={formData.organizationName}
              onChange={(e) => handleChange("organizationName", e.target.value)}
              placeholder="Contoh: Komunitas Robotika"
              className="w-full px-3 py-2 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="reg-username"
              className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
            >
              Username Akun
            </label>
            <input
              id="reg-username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Contoh: @robotika_upn"
              className="w-full px-3 py-2 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Nama PJ & Nomor Telepon / WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="reg-pj-name"
              className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
            >
              Nama Penanggung Jawab (PJ)
            </label>
            <input
              id="reg-pj-name"
              type="text"
              value={formData.personInCharge}
              onChange={(e) => handleChange("personInCharge", e.target.value)}
              placeholder="Contoh: Bagas Adi Nugroho"
              className="w-full px-3 py-2 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="reg-phone"
              className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
            >
              Nomor Telepon / WhatsApp
            </label>
            <input
              id="reg-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Contoh: 0813-4455-8899"
              className="w-full px-3 py-2 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
            />
          </div>
        </div>

        {/* Row 3: Email Kampus */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
          >
            Email Kampus
          </label>
          <input
            id="reg-email"
            type="email"
            value={formData.campusEmail}
            onChange={(e) => handleChange("campusEmail", e.target.value)}
            placeholder="Contoh: robotika_upn@student.kampus.ac.id"
            className="w-full px-3 py-2 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
          />
        </div>

        {/* Row 4: Kata Sandi & Konfirmasi Kata Sandi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-3 py-2 pr-9 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#62748E] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#93C5FD] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md transition-colors"
              >
                {showPassword ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-confirm-password"
              className="block text-xs font-semibold text-[#314158] dark:text-[#CBD5E1] mb-1"
            >
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full px-3 py-2 pr-9 text-xs sm:text-sm text-[#0F172B] dark:text-[#F8FAFC] placeholder:text-[#62748E]/70 dark:placeholder:text-[#64748B] bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#93C5FD] focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Sembunyikan konfirmasi sandi" : "Tampilkan konfirmasi sandi"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#62748E] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#93C5FD] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Informasi Format Tanggal Otomatis (DD/MM/YYYY) */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#62748E] dark:text-[#94A3B8]">
          <svg className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#93C5FD] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            Tanggal pendaftaran tercatat otomatis oleh sistem (Format DMY: <strong className="font-semibold text-[#314158] dark:text-[#E2E8F0]">{registrationDateFormatted}</strong>).
          </span>
        </div>

        {/* Checkbox Persetujuan Tata Tertib */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#314158] dark:text-[#CBD5E1] hover:text-[#0F172B] dark:hover:text-[#F8FAFC]">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => handleChange("termsAccepted", e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#CAD5E2] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer shrink-0"
            />
            <span className="leading-snug">
              Saya menyatakan data organisasi & PJ benar serta mematuhi tata tertib pemakaian fasilitas kampus.
            </span>
          </label>
        </div>

        {/* Alert Error Validasi */}
        {validationError && (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 text-xs rounded-xl bg-[#BB4D00]/10 dark:bg-[#FE9A00]/15 border border-[#BB4D00]/30 dark:border-[#FE9A00]/30 text-[#BB4D00] dark:text-[#FE9A00] animate-in fade-in duration-200"
          >
            <svg
              className="w-4 h-4 text-[#BB4D00] dark:text-[#FE9A00] shrink-0 mt-0.5"
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

        {/* Feedback Sukses Pendaftaran */}
        {isSuccess && (
          <div
            role="status"
            className="flex items-start gap-2.5 p-3 text-xs rounded-xl bg-[#00BC7D]/10 dark:bg-[#00BC7D]/15 border border-[#00BC7D]/30 text-[#00BC7D] animate-in fade-in duration-200"
          >
            <svg
              className="w-4 h-4 text-[#00BC7D] shrink-0 mt-0.5"
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
            <div>
              <p className="font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Akun organisasi berhasil didaftarkan! Mengalihkan ke halaman Login...
              </p>
              <p className="text-[11px] text-[#62748E] dark:text-[#94A3B8] mt-0.5">
                Simulasi pendaftaran berhasil dicatat untuk {formData.organizationName}.
              </p>
            </div>
          </div>
        )}

        {/* Tombol Submit Pendaftaran: Tetap Biru Solid Sesuai Ketentuan (Selain Button) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-[#FFFFFF] shadow-sm hover:shadow-md hover:scale-[1.008] active:scale-[0.99] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
                <span>Mendaftarkan akun...</span>
              </>
            ) : (
              <>
                <span>Daftarkan Akun Organisasi</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>

        {/* Tautan Kembali ke Login dengan Biru Soft di Dark Mode */}
        <div className="text-center pt-3 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <p className="text-xs text-[#62748E] dark:text-[#94A3B8]">
            Sudah memiliki akun organisasi?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#2563EB] dark:text-[#93C5FD] hover:text-[#1D4ED8] dark:hover:text-[#BFDBFE] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
// [FRONTEND CHANGE END: Form Registrasi Akun Ormawa dengan Biru Soft di Dark Mode - Milestone 5 Revisi 4]
