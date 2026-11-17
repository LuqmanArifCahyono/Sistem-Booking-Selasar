// [FRONTEND CHANGE START: Panel Informasi Registrasi Statis & Permanen - Milestone 5]
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
    title: "Pantau Slot Selasar Secara Real-time",
    description:
      "Lihat jadwal terisi dan slot jam kosong hari ini tanpa birokrasi berbelit.",
  },
  {
    number: "03",
    title: "Booking & Kelola Jadwal Mandiri",
    description:
      "Kunci slot kegiatan ormawa dan batalkan jadwal mandiri jika agenda berubah.",
  },
];

export function SignUpInfoPanel() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Kartu Informasi Registrasi Utama */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs">
        {/* Header Panel Informasi */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E2E8F0]/70">
          <div>
            <span className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase block">
              Portal Registrasi Mandiri
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172B] mt-1">
              Daftarkan Akun Organisasi Kampus
            </h2>
          </div>

          {/* Badge Kalender Aktif */}
          <div className="flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-[#00BC7D]/10 border border-[#00BC7D]/30 text-[#00BC7D] text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BC7D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BC7D]"></span>
            </span>
            <span>Kalender Aktif</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#62748E] mt-3.5 leading-relaxed">
          Satu akun resmi digunakan pengurus organisasi untuk memantau dan meminjam selasar secara real-time.
        </p>

        {/* 3 Kartu Informasi Fitur: Tampilan Tetap, Konsisten, dan Tanpa Berubah Centang */}
        <div className="mt-5 space-y-3">
          {SIGNUP_FEATURE_POINTS.map((feature) => (
            <div
              key={feature.number}
              className="rounded-xl border border-[#E2E8F0] border-b-2 border-b-[#2563EB] bg-[#FFFFFF] p-3.5 shadow-2xs hover:border-b-[#1D4ED8] transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Shape Nomor 01-03 Diperbesar (w-8 h-8 & font text-sm font-bold) */}
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm font-bold tracking-tight">
                    {feature.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172B]">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#62748E] mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding Line */}
      <div className="pt-2 text-xs text-[#62748E] border-t border-[#E2E8F0]/70">
        <p>
          <span className="font-semibold text-[#314158]">SelasarSpace</span> Layanan kampus • Ruang kampus, lebih teratur.
        </p>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Panel Informasi Registrasi Statis & Permanen - Milestone 5]
