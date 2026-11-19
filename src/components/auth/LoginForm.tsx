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
    <div className="w-full rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Masuk ke SelasarSpace
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Gunakan akun yang diberikan pengelola, atau akun mahasiswa yang kamu daftarkan sendiri.
      </p>

      {notice && (
        <div
          role="status"
          className="mt-4 rounded-control border border-status-done/30 bg-status-done/10 p-3 text-sm font-medium text-status-done"
        >
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">
            Email
          </label>
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
            className="w-full rounded-control border border-line bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-foreground">
            Sandi
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
              placeholder="Masukkan sandi"
              aria-invalid={error ? "true" : "false"}
              className="w-full rounded-control border border-line bg-surface py-3 pl-3.5 pr-12 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-control text-muted hover:text-foreground"
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
          {isSubmitting ? "Memeriksa akun..." : "Masuk"}
        </button>
      </form>

      <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
        Belum punya akun mahasiswa?{" "}
        <Link href="/register" className="font-semibold text-accent hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
