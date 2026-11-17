// [FRONTEND CHANGE START: Kontainer Registrasi Ormawa Statis dengan Tombol Back - Milestone 5]
"use client";

import React from "react";
import Link from "next/link";
import { SignUpInfoPanel } from "./SignUpInfoPanel";
import { SignUpForm } from "./SignUpForm";

export function RegisterContent() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
      {/* Brand Header + Tombol Back ke Login */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172B] flex items-center justify-center text-[#FFFFFF] font-bold text-base shadow-xs">
              S
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172B]">
              SelasarSpace
            </span>
          </div>
          <p className="text-xs font-medium text-[#62748E] tracking-wide mt-1">
            Sistem Peminjaman Tempat
          </p>
        </div>

        {/* Tombol Back ke Halaman Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#314158] hover:text-[#2563EB] bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform text-[#62748E] group-hover:text-[#2563EB]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Kembali ke Login</span>
        </Link>
      </div>

      {/* 2-Column Grid: Panel Informasi (Kiri) & Formulir Pendaftaran (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Kolom Kiri: Panel Informasi Fitur Registrasi (7 Col) */}
        <section
          className="lg:col-span-7 w-full order-2 lg:order-1"
          aria-label="Informasi Pendaftaran Organisasi"
        >
          <SignUpInfoPanel />
        </section>

        {/* Kolom Kanan: Form Pendaftaran Akun Organisasi (5 Col) */}
        <section
          className="lg:col-span-5 w-full order-1 lg:order-2"
          aria-label="Formulir Pendaftaran Akun"
        >
          <SignUpForm />
        </section>
      </div>
    </div>
  );
}
// [FRONTEND CHANGE END: Kontainer Registrasi Ormawa Statis dengan Tombol Back - Milestone 5]
