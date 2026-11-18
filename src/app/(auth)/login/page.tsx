// [FRONTEND CHANGE START: Penyelarasan Layout Login dengan Biru Soft di Dark Mode - Milestone 1 Revisi 4]
import type { Metadata } from "next";
import { LoginSchedulePreview } from "@/components/auth/LoginSchedulePreview";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Masuk Akun Organisasi — SelasarSpace",
  description: "Portal Akses Organisasi Kemahasiswaan Sistem Peminjaman Tempat Kampus",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Container utama diperluas agar jarak card ke tepi layar kiri dan kanan proporsional */}
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
        {/* Brand & Logo Header dengan Pengalih Tema Dark Mode */}
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

          {/* Tombol Dark Mode */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* 2-Column Grid: Card Jadwal & Card Login Sejajar di Garis Atas yang Sama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Kolom Kiri: Pratinjau Jadwal Selasar (7 Col) */}
          <section
            className="lg:col-span-7 w-full order-2 lg:order-1"
            aria-label="Pratinjau Jadwal Selasar"
          >
            <LoginSchedulePreview />
          </section>

          {/* Kolom Kanan: Card Portal Masuk Organisasi (5 Col) */}
          <section
            className="lg:col-span-5 w-full order-1 lg:order-2"
            aria-label="Portal Masuk Akun"
          >
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}
// [FRONTEND CHANGE END: Penyelarasan Layout Login dengan Biru Soft di Dark Mode - Milestone 1 Revisi 4]
