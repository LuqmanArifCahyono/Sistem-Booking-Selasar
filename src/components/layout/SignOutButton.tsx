"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/login" })}
      className="inline-flex min-h-11 items-center rounded-control border border-line bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
    >
      Keluar
    </button>
  );
}
