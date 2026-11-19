import type { ReactNode } from "react";
import { requireRole, requirePasswordChanged } from "@/lib/guard";

/**
 * Panel Admin Himpunan. Super Admin juga boleh masuk untuk meninjau.
 * Penjagaan di sini adalah lapisan kedua: proxy sudah menolak tamu lebih dulu,
 * tetapi keputusan akhir tetap di server.
 */
// Route ini membaca sesi, jadi tidak bisa diprerender menjadi shell statis.
// Ini jalan keluar resmi Next 16 untuk rute yang memang harus menunggu server.
export const instant = false;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole(["ADMIN", "SUPER_ADMIN"], "/admin");
  requirePasswordChanged(user);
  return <>{children}</>;
}
