"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { homePathForRole } from "@/lib/roles";
import type { Role } from "@/types/domain";

/**
 * Form masuk yang benar-benar memanggil Auth.js.
 *
 * Setelah sesi terbentuk, klien membaca /api/auth/session untuk tahu peran
 * pengguna, lalu diarahkan ke panel yang sesuai. Tujuan pengalihan tidak
 * pernah diambil dari input pengguna, hanya dari data sesi di server.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Pesan dari halaman sebelumnya, supaya pengguna tahu aksinya berhasil. */
  const notice = searchParams.get("ganti")
    ? "Sandi berhasil diganti. Masuk kembali memakai sandi baru."
    : searchParams.get("terdaftar")
      ? "Akun berhasil dibuat. Masuk memakai email dan sandi yang kamu daftarkan."
      : searchParams.get("sesi")
        ? "Sesi sebelumnya sudah tidak berlaku. Silakan masuk kembali."
        : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Isi email dan sandi terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email atau sandi tidak cocok. Periksa kembali.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const session = await response.json();

      if (!session?.user) {
        setError("Sesi gagal dibuat. Coba lagi.");
        setIsSubmitting(false);
        return;
      }

      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.replace(callbackUrl);
      } else {
        router.replace(homePathForRole(session.user.role as Role));
      }
      router.refresh();
    } catch {
      setError("Tidak bisa menghubungi server. Periksa koneksi lalu coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold text-xs">
          ID
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Autentikasi Akun
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Masuk ke SelasarSpace
      </h1>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Gunakan akun pengelola himpunan atau akun mahasiswa yang telah Anda daftarkan.
      </p>

      {notice && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-status-done/30 bg-status-done/10 p-3.5 text-sm font-medium text-status-done flex items-start gap-2.5"
        >
          <svg className="h-5 w-5 shrink-0 text-status-done mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
            Alamat Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
              placeholder="nama@student.kampus.ac.id"
              aria-invalid={error ? "true" : "false"}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-foreground">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Masukkan kata sandi"
              aria-invalid={error ? "true" : "false"}
              className="w-full rounded-xl border border-line bg-surface py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 p-3.5 text-sm font-medium text-status-cancelled flex items-start gap-2.5 animate-in fade-in duration-200"
          >
            <svg className="h-5 w-5 shrink-0 text-status-cancelled mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-xs transition-all hover:bg-accent-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-accent-foreground" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memeriksa akun...
            </span>
          ) : (
            "Masuk ke Sistem"
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-4 flex items-center justify-between text-sm">
        <span className="text-muted">Belum punya akun?</span>
        <Link
          href="/register"
          className="font-semibold text-accent hover:underline inline-flex items-center gap-1 group"
        >
          Daftar Mahasiswa
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
