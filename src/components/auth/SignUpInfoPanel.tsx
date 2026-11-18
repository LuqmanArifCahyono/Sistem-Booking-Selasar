// [FRONTEND CHANGE START: Panel Informasi Registrasi dengan Biru Soft di Dark Mode - Milestone 5 Revisi 4]
"use client";

import React from "react";

const SIGNUP_FEATURE_POINTS = [
  {
    number: "01",
    title: "Lengkapi Identitas Organisasi & PJ",
    description:
      "Daftarkan nama organisasi dan kontak ketua/PJ aktif untuk verifikasi izin peminjaman.",
  },
  {
    number: "02",
    title: "Pantau Jam Terisi Selasar Secara Real-time",
    description:
      "Lihat jam-jam yang sedang terpakai ormawa dan slot waktu yang tersedia tanpa birokrasi berbelit.",
  },
  {
    number: "03",
    title: "Booking & Kelola Jadwal Mandiri",
    description:
      "Kunci jam kegiatan ormawa dan batalkan jadwal mandiri langsung dari dasbor jika agenda berubah.",
  },
];

export function SignUpInfoPanel() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Kartu Informasi Registrasi Utama */}
      <div className="bg-[#FFFFFF] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-7 shadow-xs transition-colors">
        {/* Header Panel Informasi */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E2E8F0]/70 dark:border-[#1E293B]">
          <div>
            <span className="text-xs font-semibold text-[#2563EB] dark:text-[#93C5FD] tracking-wider uppercase block">
              Portal Registrasi Mandiri
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172B] dark:text-[#F8FAFC] mt-1">
              Daftarkan Akun Organisasi Kampus
            </h2>
          </div>

          {/* Badge Kalender Aktif */}
          <div className="flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-[#00BC7D]/10 dark:bg-[#00BC7D]/15 border border-[#00BC7D]/30 text-[#00BC7D] text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BC7D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BC7D]"></span>
            </span>
            <span>Kalender Aktif</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#62748E] dark:text-[#94A3B8] mt-3.5 leading-relaxed">
          Satu akun resmi digunakan pengurus organisasi untuk memantau dan meminjam selasar secara real-time.
        </p>

        {/* 3 Kartu Informasi Fitur dengan Biru Soft di Dark Mode */}
        <div className="mt-5 space-y-3">
          {SIGNUP_FEATURE_POINTS.map((feature) => (
            <div
              key={feature.number}
              className="rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] border-b-2 border-b-[#2563EB] dark:border-b-[#93C5FD]/50 bg-[#FFFFFF] dark:bg-[#111827] p-3.5 shadow-2xs hover:border-b-[#1D4ED8] dark:hover:border-b-[#93C5FD] transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Shape Nomor 01-03 Diperbesar dengan Aksen Biru Soft di Dark Mode */}
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#93C5FD]/10 border border-[#2563EB]/20 dark:border-[#93C5FD]/20 text-[#2563EB] dark:text-[#93C5FD] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm font-bold tracking-tight">
                    {feature.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#62748E] dark:text-[#94A3B8] mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding Line */}
      <div className="pt-2 text-xs text-[#62748E] dark:text-[#94A3B8] border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
        <p>
          <span className="font-semibold text-[#314158] dark:text-[#CBD5E1]">SelasarSpace</span> Layanan kampus • Ruang kampus, lebih teratur.
        </p>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Panel Informasi Registrasi dengan Biru Soft di Dark Mode - Milestone 5 Revisi 4]
