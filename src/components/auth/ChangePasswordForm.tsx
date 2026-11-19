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
      setTimeout(async () => {
        await signOut({ redirectTo: "/login?ganti=1" });
      }, 1200);
    } catch {
      setError("Tidak bisa menghubungi server. Coba lagi.");
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover";

  if (done) {
    return (
      <div className="rounded-2xl border border-status-done/30 bg-surface p-6 text-center sm:p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-status-done/10 text-status-done mx-auto flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-bold text-foreground">Sandi Berhasil Diperbarui</p>
        <p className="mt-2 text-xs text-muted">
          Anda akan diarahkan ke halaman masuk untuk autentikasi menggunakan kata sandi baru.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold text-xs">
          KEY
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Keamanan Akun
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {mustChange ? "Perbarui Kata Sandi Anda" : "Ganti Kata Sandi"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {mustChange
          ? `Akun ${email} masih menggunakan kata sandi bawaan. Demi privasi dan keamanan jadwal, silakan tentukan kata sandi baru Anda.`
          : `Masuk sebagai ${email}. Masukkan kata sandi saat ini untuk menetapkan kata sandi baru.`}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="current" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
            Kata Sandi Saat Ini
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
            placeholder="Masukkan sandi lama"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Kata Sandi Baru
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
            <label htmlFor="confirm" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Konfirmasi Sandi Baru
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
              placeholder="Ulangi sandi baru"
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 p-3.5 text-xs font-semibold text-status-cancelled animate-in fade-in duration-200"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-xs transition-all hover:bg-accent-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? "Menyimpan sandi baru..." : "Simpan Kata Sandi"}
        </button>

        {!mustChange && (
          <button
            type="button"
            onClick={() => router.push(fallbackPath)}
            className="min-h-11 w-full rounded-xl border border-line px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted active:scale-[0.99] cursor-pointer transition-all"
          >
            Batal
          </button>
        )}
      </form>
    </div>
  );
}
