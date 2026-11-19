import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { AccountTable, type AccountRowData } from "@/components/superadmin/AccountTable";
import { CreateAdminForm } from "@/components/superadmin/CreateAdminForm";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DefaultPasswordBanner } from "@/components/auth/DefaultPasswordBanner";

export const metadata: Metadata = {
  title: "Panel Super Admin — SelasarSpace",
};

// Halaman ini membaca sesi dan database, jadi tidak bisa diprerender statis.
export const instant = false;

const ACTION_TEXT: Record<string, string> = {
  BOOKING_CREATE: "Membuat jadwal",
  BOOKING_UPDATE: "Mengubah jadwal",
  BOOKING_DELETE: "Menghapus jadwal",
  BOOKING_COMPLETE: "Menandai selesai",
  BOOKING_CANCEL: "Membatalkan jadwal",
  SLOT_LOCK: "Menutup slot",
  SLOT_UNLOCK: "Membuka slot",
  USER_CREATE_ADMIN: "Membuat akun admin",
  USER_RESET_PASSWORD: "Mereset sandi",
  USER_ACTIVATE: "Mengaktifkan akun",
  USER_DEACTIVATE: "Menonaktifkan akun",
  USER_REGISTER: "Pendaftaran mahasiswa",
  USER_CHANGE_PASSWORD: "Mengganti sandi",
};

function formatDateTime(value: Date): string {
  const date = value.toISOString().slice(0, 10).split("-");
  const time = value.toISOString().slice(11, 16);
  return `${date[2]}/${date[1]}/${date[0]} ${time}`;
}

export default async function SuperAdminPage() {
  const user = await getSessionUser();

  const [accounts, organizations, activeBookings, totalBookings, mustChange, auditLogs] =
    await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          position: true,
          mustChangePassword: true,
          isActive: true,
          organization: { select: { name: true } },
        },
        orderBy: [{ role: "asc" }, { email: "asc" }],
      }),
      prisma.organization.findMany({
        where: { isActive: true },
        select: { id: true, shortName: true, faculty: true },
        orderBy: [{ faculty: "asc" }, { name: "asc" }],
      }),
      prisma.booking.count({ where: { deletedAt: null, status: "DIJADWALKAN" } }),
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { mustChangePassword: true } }),
      prisma.auditLog.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          entity: true,
          createdAt: true,
          actor: { select: { name: true, email: true } },
        },
      }),
    ]);

  const rows: AccountRowData[] = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    position: account.position,
    organizationName: account.organization?.name ?? null,
    mustChangePassword: account.mustChangePassword,
    isActive: account.isActive,
  }));

  const stats = [
    { label: "Jadwal aktif", value: activeBookings, hint: "Belum selesai, belum dibatalkan" },
    { label: "Total peminjaman", value: totalBookings, hint: "Seluruh riwayat aktif" },
    { label: "Himpunan", value: organizations.length, hint: "FIK dan FISIP" },
    { label: "Akun wajib ganti sandi", value: mustChange, hint: "Dari total " + rows.length + " akun" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DefaultPasswordBanner mustChange={user?.mustChangePassword} />
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-control bg-accent text-sm font-bold text-accent-foreground">
                S
              </span>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Panel Super Admin
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted">
              Masuk sebagai {user?.name} ({user?.email})
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center rounded-control border border-line bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
            >
              Timeline & Kontrol Admin
            </Link>
            <Link
              href="/kalender"
              className="inline-flex min-h-11 items-center rounded-control bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Buka Kalender
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
        <section aria-label="Ringkasan" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-panel border border-line bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{item.value}</p>
              <p className="mt-1 text-xs text-muted">{item.hint}</p>
            </div>
          ))}
        </section>

        <section aria-label="Akses Cepat Pengelolaan" className="rounded-panel border border-blue-500/20 bg-blue-500/5 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Kontrol Penuh Selasar & Jadwal</h2>
              <p className="mt-1 text-xs text-muted">
                Sebagai Super Admin, Anda memiliki hak penuh untuk mengubah jadwal, memindahkan jam, menandai selesai, membatalkan, hingga menghapus booking dari himpunan mana pun langsung dari <strong>Kalender</strong> atau <strong>Timeline Admin</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/kalender"
                className="inline-flex items-center rounded-control bg-foreground px-3.5 py-2 text-xs font-semibold text-background hover:opacity-90"
              >
                Ubah di Kalender
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-control border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted"
              >
                Kelola di Timeline
              </Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section aria-label="Akun pengelola" className="lg:col-span-8">
            <div className="rounded-panel border border-line bg-surface p-5">
              <h2 className="text-base font-semibold text-foreground">Akun pengelola</h2>
              <p className="mt-1 text-sm text-muted">
                Seluruh akun yang bisa masuk ke sistem, beserta status sandinya.
              </p>
              <div className="mt-4">
                <AccountTable accounts={rows} />
              </div>
            </div>
          </section>

          <section aria-label="Buat akun admin" className="lg:col-span-4">
            <div className="rounded-panel border border-line bg-surface p-5">
              <h2 className="text-base font-semibold text-foreground">Buat akun admin</h2>
              <p className="mt-1 mb-4 text-sm text-muted">
                Satu himpunan maksimal tiga akun: ketua, sekretaris, bendahara.
              </p>
              <CreateAdminForm organizations={organizations} />
            </div>
          </section>
        </div>

        <section aria-label="Jejak audit">
          <div className="rounded-panel border border-line bg-surface p-5">
            <h2 className="text-base font-semibold text-foreground">Jejak audit terakhir</h2>
            <p className="mt-1 text-sm text-muted">
              Catatan perubahan data, siapa yang melakukannya, dan kapan.
            </p>

            {auditLogs.length === 0 ? (
              <p className="mt-4 rounded-control border border-dashed border-line p-6 text-center text-sm text-muted">
                Belum ada aktivitas tercatat.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {auditLogs.map((log) => (
                  <li key={log.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {ACTION_TEXT[log.action] ?? log.action}{" "}
                        <span className="font-normal text-muted">({log.entity})</span>
                      </p>
                      <p className="text-xs text-muted">{log.actor.name}</p>
                    </div>
                    <p className="font-mono text-xs text-muted">{formatDateTime(log.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
