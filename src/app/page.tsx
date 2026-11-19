import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { homePathForRole } from "@/lib/roles";

/**
 * Pintu masuk aplikasi.
 *
 * Seluruh web diwajibkan login, jadi alamat "/" tidak menampilkan apa pun:
 * ia hanya memutuskan ke mana pengunjung harus pergi.
 */
// Route ini membaca sesi, jadi tidak bisa diprerender menjadi shell statis.
// Ini jalan keluar resmi Next 16 untuk rute yang memang harus menunggu server.
export const instant = false;

export default async function RootPage() {
  const user = await getSessionUser();

  if (!user) redirect("/login");

  redirect(homePathForRole(user.role));
}
