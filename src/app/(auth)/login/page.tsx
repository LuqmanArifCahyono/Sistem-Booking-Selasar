import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginSchedulePreview } from "@/components/auth/LoginSchedulePreview";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getSessionUser } from "@/lib/session";
import { homePathForRole } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Masuk — SelasarSpace",
  description: "Portal masuk Sistem Peminjaman Selasar Kampus",
};

export const instant = false;

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(homePathForRole(user.role));
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
        {/* Brand & Logo Header dengan Pengalih Tema */}
        <header className="flex items-center justify-between gap-4 mb-6">
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
              Sistem Peminjaman Selasar Kampus
            </p>
          </div>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* 2-Column Grid: Pratinjau Ketersediaan Sebelum Login (Kiri) & Form Masuk (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Kolom Kiri: Pratinjau Ketersediaan & Jadwal Selasar (Bisa dilihat siapa saja sebelum login) */}
          <section
            className="lg:col-span-7 w-full order-2 lg:order-1"
            aria-label="Pratinjau Ketersediaan Jadwal Selasar"
          >
            <LoginSchedulePreview />
          </section>

          {/* Kolom Kanan: Card Masuk Akun Mahasiswa / Admin / Super Admin */}
          <section
            className="lg:col-span-5 w-full order-1 lg:order-2"
            aria-label="Formulir Masuk Akun"
          >
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}
