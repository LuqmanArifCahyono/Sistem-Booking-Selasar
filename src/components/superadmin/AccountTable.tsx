"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface AccountRowData {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string | null;
  organizationName: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
}

interface AccountTableProps {
  accounts: AccountRowData[];
}

const ROLE_TEXT: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin Himpunan",
  USER: "Mahasiswa",
};

const POSITION_TEXT: Record<string, string> = {
  KETUA: "Ketua",
  SEKRETARIS: "Sekretaris",
  BENDAHARA: "Bendahara",
};

export function AccountTable({ accounts }: AccountTableProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resetPassword(account: AccountRowData) {
    const newPassword = window.prompt(
      `Sandi baru untuk ${account.email}\n(minimal 8 karakter)\n\nAkun ini akan diminta memperbarui sandi saat login berikutnya.`,
      "",
    );
    if (!newPassword) return;

    if (newPassword.length < 8) {
      setError("Sandi minimal 8 karakter.");
      return;
    }

    setBusyId(account.id);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/users/${account.id}/reset-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Gagal mereset sandi.");
      } else {
        setNotice(`Sandi untuk ${account.email} berhasil direset.`);
        router.refresh();
      }
    } catch {
      setError("Tidak bisa menghubungi server.");
    } finally {
      setBusyId(null);
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-center text-xs text-muted">
        Belum ada akun pengelola yang terdaftar di sistem.
      </div>
    );
  }

  return (
    <div>
      {notice && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-status-done/30 bg-status-done/10 p-3.5 text-xs font-semibold text-status-done flex items-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 p-3.5 text-xs font-semibold text-status-cancelled flex items-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-surface-muted/60 border-b border-line text-xs uppercase tracking-wider text-muted font-semibold">
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Peran Akses</th>
              <th className="py-3 px-4">Organisasi</th>
              <th className="py-3 px-4">Status Akun</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-foreground">{account.email}</span>
                  <span className="text-xs text-muted">{account.name}</span>
                </td>
                <td className="py-3.5 px-4 text-foreground">
                  <span className="font-medium text-xs sm:text-sm">{ROLE_TEXT[account.role] ?? account.role}</span>
                  {account.position && (
                    <span className="block text-xs text-muted">
                      {POSITION_TEXT[account.position] ?? account.position}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-foreground text-xs sm:text-sm">
                  {account.organizationName ? (
                    <span className="font-medium">{account.organizationName}</span>
                  ) : (
                    <span className="text-muted">–</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {!account.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-status-cancelled/10 border border-status-cancelled/25 px-2.5 py-1 text-xs font-semibold text-status-cancelled">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-cancelled" />
                      Nonaktif
                    </span>
                  ) : account.mustChangePassword ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-status-expired/10 border border-status-expired/25 px-2.5 py-1 text-xs font-semibold text-status-expired">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-expired" />
                      Password Default
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-status-done/10 border border-status-done/25 px-2.5 py-1 text-xs font-semibold text-status-done">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-done" />
                      Aktif
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => resetPassword(account)}
                    disabled={busyId === account.id}
                    className="inline-flex min-h-9 items-center justify-center rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                  >
                    {busyId === account.id ? "Memproses..." : "Reset Sandi"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
