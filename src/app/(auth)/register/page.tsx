import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getSessionUser } from "@/lib/session";
import { homePathForRole } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Daftar Akun Mahasiswa — SelasarSpace",
  description: "Pendaftaran akun mahasiswa untuk melihat jadwal Selasar",
};

// Route ini membaca sesi, jadi tidak bisa diprerender menjadi shell statis.
// Ini jalan keluar resmi Next 16 untuk rute yang memang harus menunggu server.
export const instant = false;

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-base font-bold text-accent-foreground shadow-xs">
                S
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SelasarSpace
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-muted tracking-wide">
              Sistem Peminjaman Selasar Kampus
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors"
            >
              ← Kembali ke Masuk
            </Link>
          </div>
        </header>

        <RegisterForm />

        <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-muted">
          Pendaftaran ini khusus untuk akun mahasiswa dengan hak akses pemantauan (lihat jadwal). Akun Admin Himpunan dan Super Admin dikelola langsung oleh pihak institusi kampus.
        </p>
      </div>
    </main>
  );
}
