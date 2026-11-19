import type { ReactNode } from "react";
import { requireUser, requirePasswordChanged } from "@/lib/guard";

/**
 * Kalender hanya untuk pengguna yang sudah masuk. Peran apa pun boleh melihat,
 * karena halaman ini memang bersifat baca saja.
 */
// Route ini membaca sesi, jadi tidak bisa diprerender menjadi shell statis.
// Ini jalan keluar resmi Next 16 untuk rute yang memang harus menunggu server.
export const instant = false;

export default async function KalenderLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("/kalender");
  requirePasswordChanged(user);
  return <>{children}</>;
}
