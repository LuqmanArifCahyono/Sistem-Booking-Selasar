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
    "w-full rounded-control border border-line bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl rounded-panel border border-line bg-surface p-6 sm:p-8"
      noValidate
    >
      <h1 className="text-xl font-bold tracking-tight text-foreground">Daftar akun mahasiswa</h1>
      <p className="mt-1.5 text-sm text-muted">
        Akun ini hanya bisa melihat jadwal. Untuk mencatat peminjaman, gunakan akun Admin
        Himpunan dari pengelola.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-foreground">
            Nama lengkap
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
            placeholder="Nama sesuai kartu mahasiswa"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-foreground">
            Email kampus
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
            <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-foreground">
              Sandi
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
            <label htmlFor="register-confirm" className="mb-1.5 block text-sm font-semibold text-foreground">
              Ulangi sandi
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
              placeholder="Ulangi sandi"
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
          {isSubmitting ? "Mendaftarkan..." : "Daftar"}
        </button>
      </div>
    </form>
  );
}
