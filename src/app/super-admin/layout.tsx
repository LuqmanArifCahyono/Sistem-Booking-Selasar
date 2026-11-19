import type { ReactNode } from "react";
import { requireRole, requirePasswordChanged } from "@/lib/guard";

/** Panel Super Admin. Hanya peran SUPER_ADMIN. */
// Route ini membaca sesi, jadi tidak bisa diprerender menjadi shell statis.
// Ini jalan keluar resmi Next 16 untuk rute yang memang harus menunggu server.
export const instant = false;

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole(["SUPER_ADMIN"], "/super-admin");
  requirePasswordChanged(user);
  return <>{children}</>;
}
