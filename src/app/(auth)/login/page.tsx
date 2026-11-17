// [FRONTEND CHANGE START: Penyesuaian Lebar Kontainer & Padding Halaman Login - Milestone 1]
import type { Metadata } from "next";
import { LoginSchedulePreview } from "@/components/auth/LoginSchedulePreview";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Masuk Akun Organisasi — SelasarSpace",
  description: "Portal Akses Organisasi Kemahasiswaan Sistem Peminjaman Tempat Kampus",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Container utama diperluas agar jarak card ke tepi layar kiri dan kanan tidak terlalu lebar */}
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
        {/* Brand & Logo Header */}
        <div className="flex flex-col mb-5">
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
// [FRONTEND CHANGE END: Penyesuaian Lebar Kontainer & Padding Halaman Login - Milestone 1]
