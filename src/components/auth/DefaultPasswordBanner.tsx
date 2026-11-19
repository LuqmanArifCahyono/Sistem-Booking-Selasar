"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DefaultPasswordBannerProps {
  mustChange?: boolean;
}

export function DefaultPasswordBanner({ mustChange = true }: DefaultPasswordBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!mustChange || dismissed) {
    return null;
  }

  return (
    <aside
      role="alert"
      aria-live="polite"
      className="w-full border-b border-amber-300/40 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-950 transition-colors dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-[11px] font-bold text-amber-800 dark:bg-amber-900/80 dark:text-amber-300">
            !
          </span>
          <p className="leading-snug">
            <strong className="font-semibold">Perhatian:</strong> Akun Anda masih menggunakan kata
            sandi bawaan pengelola. Demi keamanan akun dan privasi kegiatan organisasi, sangat
            disarankan untuk mengganti kata sandi Anda.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/ganti-sandi"
            className="rounded-lg bg-amber-600 px-3 py-1 font-semibold text-white shadow-2xs transition-colors hover:bg-amber-700 dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-400"
          >
            Ganti Sandi
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Tutup peringatan ganti sandi"
            className="p-1 text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
