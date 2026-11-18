// [FRONTEND CHANGE START: Kontainer Registrasi Ormawa dengan Biru Soft di Dark Mode - Milestone 5 Revisi 4]
"use client";

import React from "react";
import Link from "next/link";
import { SignUpInfoPanel } from "./SignUpInfoPanel";
import { SignUpForm } from "./SignUpForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function RegisterContent() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
      {/* Brand Header + Tombol Back ke Login & Theme Toggle */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172B] dark:bg-[#1E293B] dark:border dark:border-[#93C5FD]/30 flex items-center justify-center text-[#FFFFFF] dark:text-[#93C5FD] font-bold text-base shadow-xs">
              S
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172B] dark:text-[#F8FAFC]">
              SelasarSpace
            </span>
          </div>
          <p className="text-xs font-medium text-[#62748E] dark:text-[#94A3B8] tracking-wide mt-1">
            Sistem Peminjaman Tempat
          </p>
        </div>

        {/* Right Header Actions: Theme Toggle + Tombol Back ke Login */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#314158] dark:text-[#E2E8F0] hover:text-[#2563EB] dark:hover:text-[#93C5FD] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2563EB] dark:hover:border-[#93C5FD]/40 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform text-[#62748E] dark:text-[#94A3B8] group-hover:text-[#2563EB] dark:group-hover:text-[#93C5FD]"
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
// [FRONTEND CHANGE END: Kontainer Registrasi Ormawa dengan Biru Soft di Dark Mode - Milestone 5 Revisi 4]
