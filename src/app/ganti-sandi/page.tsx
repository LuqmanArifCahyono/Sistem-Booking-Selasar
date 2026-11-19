import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getSessionUser } from "@/lib/session";
import { homePathForRole } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Ganti Sandi — SelasarSpace",
};

// Route ini membaca sesi, jadi tidak bisa diprerender menjadi shell statis.
// Ini jalan keluar resmi Next 16 untuk rute yang memang harus menunggu server.
export const instant = false;

export default async function ChangePasswordPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-line shadow-xs shrink-0 ring-1 ring-black/5 dark:ring-white/10">
              <Image
                src="/hanni.jpg"
                alt="Logo SelasarSpace"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">SelasarSpace</span>
          </div>
          <ThemeToggle />
        </header>

        <ChangePasswordForm
          mustChange={user.mustChangePassword}
          email={user.email}
          fallbackPath={homePathForRole(user.role)}
        />
      </div>
    </main>
  );
}
