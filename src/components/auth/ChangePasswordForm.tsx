"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ChangePasswordFormProps {
  mustChange: boolean;
  email: string;
  fallbackPath: string;
}

export function ChangePasswordForm({ mustChange, email, fallbackPath }: ChangePasswordFormProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword) {
      setError("Isi sandi saat ini dan sandi baru.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi sandi tidak sama.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const payload = await response.json();

      // 401 berarti sesi menunjuk akun yang sudah tidak ada (misal data
      // di-seed ulang). Jangan tampilkan error membingungkan, cukup keluar.
      if (response.status === 401) {
        await signOut({ redirectTo: "/login?sesi=habis" });
        return;
      }

      if (!response.ok) {
        setError(payload?.error ?? "Gagal menyimpan sandi baru.");
        setIsSubmitting(false);
        return;
      }

      setDone(true);
      // JWT lama masih membawa tanda wajib-ganti, jadi sesi diakhiri dan
      // pengguna masuk ulang dengan sandi baru. Navigasi keras (bukan router)
      // dipakai supaya cookie benar-benar terhapus sebelum halaman login dimuat.
      setTimeout(async () => {
        // redirectTo membuat Auth.js menghapus cookie lalu memuat ulang halaman
        // secara penuh, sehingga JWT lama tidak terbawa ke form login.
        await signOut({ redirectTo: "/login?ganti=1" });
      }, 1200);
    } catch {
      setError("Tidak bisa menghubungi server. Coba lagi.");
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-control border border-line bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  if (done) {
    return (
      <div className="rounded-panel border border-line bg-surface p-6 text-center sm:p-8">
        <p className="text-base font-semibold text-foreground">Sandi berhasil diganti</p>
        <p className="mt-2 text-sm text-muted">
          Anda akan diarahkan ke halaman masuk untuk memakai sandi baru.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        {mustChange ? "Ganti sandi sebelum melanjutkan" : "Ganti sandi"}
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {mustChange
          ? `Akun ${email} masih memakai sandi awal buatan pengelola. Sandi awal mudah ditebak, jadi wajib diganti sebelum panel bisa dipakai.`
          : `Masuk sebagai ${email}. Masukkan sandi saat ini untuk menetapkan sandi baru.`}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="current" className="mb-1.5 block text-sm font-semibold text-foreground">
            Sandi saat ini
          </label>
          <input
            id="current"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              if (error) setError(null);
            }}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new" className="mb-1.5 block text-sm font-semibold text-foreground">
              Sandi baru
            </label>
            <input
              id="new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Minimal 8 karakter"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-foreground">
              Ulangi sandi baru
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (error) setError(null);
              }}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-control border border-status-cancelled/30 bg-status-cancelled/10 p-3 text-sm font-medium text-status-cancelled"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-11 w-full items-center justify-center rounded-control bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan sandi baru"}
        </button>

        {!mustChange && (
          <button
            type="button"
            onClick={() => router.push(fallbackPath)}
            className="min-h-11 w-full rounded-control border border-line px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            Batal
          </button>
        )}
      </form>
    </div>
  );
}
