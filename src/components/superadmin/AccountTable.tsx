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
      `Sandi baru untuk ${account.email}\n(minimal 8 karakter)\n\nAkun ini akan wajib mengganti sandi saat login berikutnya.`,
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
        setNotice(`Sandi ${account.email} sudah direset.`);
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
      <p className="rounded-panel border border-dashed border-line p-6 text-center text-sm text-muted">
        Belum ada akun terdaftar.
      </p>
    );
  }

  return (
    <div>
      {notice && (
        <p className="mb-3 rounded-control border border-status-done/30 bg-status-done/10 p-3 text-sm font-medium text-status-done">
          {notice}
        </p>
      )}
      {error && (
        <p className="mb-3 rounded-control border border-status-cancelled/30 bg-status-cancelled/10 p-3 text-sm font-medium text-status-cancelled">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-3 font-semibold">Email</th>
              <th className="py-2 pr-3 font-semibold">Peran</th>
              <th className="py-2 pr-3 font-semibold">Himpunan</th>
              <th className="py-2 pr-3 font-semibold">Status</th>
              <th className="py-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-b border-line/60 last:border-0">
                <td className="py-3 pr-3">
                  <span className="block font-medium text-foreground">{account.email}</span>
                  <span className="text-xs text-muted">{account.name}</span>
                </td>
                <td className="py-3 pr-3 text-foreground">
                  {ROLE_TEXT[account.role] ?? account.role}
                  {account.position && (
                    <span className="block text-xs text-muted">
                      {POSITION_TEXT[account.position] ?? account.position}
                    </span>
                  )}
                </td>
                <td className="py-3 pr-3 text-foreground">{account.organizationName ?? "-"}</td>
                <td className="py-3 pr-3">
                  {!account.isActive ? (
                    <span className="rounded-control bg-status-cancelled/10 px-2 py-1 text-xs font-semibold text-status-cancelled">
                      Nonaktif
                    </span>
                  ) : account.mustChangePassword ? (
                    <span className="rounded-control bg-status-expired/10 px-2 py-1 text-xs font-semibold text-status-expired">
                      Wajib ganti sandi
                    </span>
                  ) : (
                    <span className="rounded-control bg-status-done/10 px-2 py-1 text-xs font-semibold text-status-done">
                      Aktif
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => resetPassword(account)}
                    disabled={busyId === account.id}
                    className="min-h-9 rounded-control border border-line px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted disabled:opacity-60"
                  >
                    {busyId === account.id ? "Memproses..." : "Reset sandi"}
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
