// [FRONTEND CHANGE START: Halaman Registrasi Akun Ormawa dengan Dark Mode - Milestone 5 Revisi 3]
import type { Metadata } from "next";
import { RegisterContent } from "@/components/auth/RegisterContent";

export const metadata: Metadata = {
  title: "Buat Akun Organisasi — SelasarSpace",
  description: "Portal Registrasi Mandiri Akun Organisasi Kemahasiswaan Sistem Peminjaman Tempat",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
      <RegisterContent />
    </main>
  );
}
// [FRONTEND CHANGE END: Halaman Registrasi Akun Ormawa dengan Dark Mode - Milestone 5 Revisi 3]
