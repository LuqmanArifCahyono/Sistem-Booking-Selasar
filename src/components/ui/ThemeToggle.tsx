"use client";

import React, { useCallback, useSyncExternalStore } from "react";

/**
 * Pengalih tema terang/gelap.
 *
 * Keadaan tema dibaca langsung dari kelas `dark` pada <html> lewat
 * useSyncExternalStore, bukan disalin ke state lokal. Alasannya: skrip
 * inisialisasi di layout sudah menetapkan kelas sebelum React hidup, dan
 * menyalinnya ke state akan membuat dua sumber kebenaran yang bisa berbeda
 * (itulah penyebab error "setState di dalam effect" sebelumnya).
 */

const THEME_KEY = "selasar_theme";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** Di server belum ada tema, jadi anggap terang (sesuai default produk). */
function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // localStorage bisa diblokir (mode privat). Tema tetap berlaku untuk sesi ini.
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
    >
      {isDark ? (
        <>
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-status-expired"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="hidden sm:inline">Mode terang</span>
        </>
      ) : (
        <>
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span className="hidden sm:inline">Mode gelap</span>
        </>
      )}
    </button>
  );
}
