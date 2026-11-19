"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface OrganizationOption {
  id: string;
  shortName: string;
  faculty: string;
}

interface CreateAdminFormProps {
  organizations: OrganizationOption[];
}

const POSITIONS = [
  { value: "KETUA", label: "Ketua Himpunan", prefix: "kahim" },
  { value: "SEKRETARIS", label: "Sekretaris", prefix: "sekre" },
  { value: "BENDAHARA", label: "Bendahara", prefix: "bendahara" },
] as const;

/** "Himasifo" -> "asifo", "BEM FISIP" -> "bemfisip". */
function accountCode(shortName: string): string {
  const compact = shortName.toLowerCase().replace(/\s+/g, "");
  return compact.startsWith("hima") ? compact.slice(4) : compact;
}

export function CreateAdminForm({ organizations }: CreateAdminFormProps) {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [position, setPosition] = useState<(typeof POSITIONS)[number]["value"]>("KETUA");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Isi email dan sandi mengikuti pola jabatan + himpunan. */
  function fillFromPattern(nextOrgId: string, nextPosition: string) {
    const org = organizations.find((item) => item.id === nextOrgId);
    const meta = POSITIONS.find((item) => item.value === nextPosition);
    if (!org || !meta) return;
    const code = accountCode(org.shortName);
    setEmail(`${meta.prefix}${code}@gmail.com`);
    setPassword(`${meta.prefix}${code}2026`);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Lengkapi nama, email, dan sandi.");
      return;
    }
    if (password.length < 8) {
      setError("Sandi minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          organizationId,
          position,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Gagal membuat akun.");
        setIsSubmitting(false);
        return;
      }

      setNotice(`Akun ${payload.data.email} berhasil dibuat.`);
      setName("");
      setEmail("");
      setPassword("");
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("Tidak bisa menghubungi server.");
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 hover:border-line-hover";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

  if (organizations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-6 text-center text-xs text-muted">
        Belum ada data organisasi. Tambahkan organisasi terlebih dahulu.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="org" className={labelClass}>
            Himpunan
          </label>
          <select
            id="org"
            value={organizationId}
            onChange={(event) => {
              setOrganizationId(event.target.value);
              fillFromPattern(event.target.value, position);
            }}
            className={inputClass}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.shortName} ({org.faculty})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="position" className={labelClass}>
            Jabatan
          </label>
          <select
            id="position"
            value={position}
            onChange={(event) => {
              const next = event.target.value as (typeof POSITIONS)[number]["value"];
              setPosition(next);
              fillFromPattern(organizationId, next);
            }}
            className={inputClass}
          >
            {POSITIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="admin-name" className={labelClass}>
          Nama Pengurus
        </label>
        <input
          id="admin-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama lengkap pengurus"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="admin-email" className={labelClass}>
            Alamat Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="kahimasifo@gmail.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="admin-password" className={labelClass}>
            Sandi Default
          </label>
          <input
            id="admin-password"
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="kahimasifo2026"
            className={inputClass}
          />
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        Pola email dan sandi terisi otomatis mengikuti jabatan. Pengurus disarankan memperbarui sandi setelah berhasil login.
      </p>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 p-3 text-xs font-semibold text-status-cancelled animate-in fade-in duration-200"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="rounded-xl border border-status-done/30 bg-status-done/10 p-3 text-xs font-semibold text-status-done animate-in fade-in duration-200"
        >
          {notice}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-accent-foreground shadow-xs transition-all hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        {isSubmitting ? "Membuat akun..." : "Buat Akun Admin"}
      </button>
    </form>
  );
}
