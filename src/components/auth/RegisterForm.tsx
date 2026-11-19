"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Lengkapi nama, email, dan sandi.");
      return;
    }
    if (password.length < 8) {
      setError("Sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi sandi tidak sama.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Pendaftaran gagal. Coba lagi.");
        setIsSubmitting(false);
        return;
      }

      router.push("/login?terdaftar=1");
    } catch {
      setError("Tidak bisa menghubungi server. Periksa koneksi lalu coba lagi.");
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all"
      noValidate
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold text-xs">
          MHS
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Pendaftaran Mandiri
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Daftar Akun Mahasiswa</h1>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Akun ini memiliki hak akses untuk memantau jadwal dan ketersediaan selasar. Untuk pengajuan booking, koordinasikan melalui akun Admin Himpunan Anda.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Nama lengkap sesuai kartu mahasiswa"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-foreground">
            Email Kampus
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder="nama@student.kampus.ac.id"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-foreground">
              Kata Sandi
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Minimal 8 karakter"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="register-confirm" className="mb-2 block text-sm font-semibold text-foreground">
              Konfirmasi Sandi
            </label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Ulangi kata sandi"
              className={inputClass}
            />
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
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mendaftarkan akun...
            </span>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </div>
    </form>
  );
}
