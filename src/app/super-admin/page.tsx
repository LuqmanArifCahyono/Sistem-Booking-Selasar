import type { Metadata } from "next";
import Image from "next/image";
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
    { label: "Jadwal Aktif", value: activeBookings, hint: "Belum selesai & belum dibatalkan" },
    { label: "Total Peminjaman", value: totalBookings, hint: "Seluruh riwayat jadwal tercatat" },
    { label: "Himpunan Terdaftar", value: organizations.length, hint: "Fakultas FIK dan FISIP" },
    { label: "Password Default", value: mustChange, hint: `Dari total ${rows.length} akun terdaftar` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DefaultPasswordBanner mustChange={user?.mustChangePassword} />
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-line shadow-xs shrink-0 ring-1 ring-black/5 dark:ring-white/10">
              <Image
                src="/hanni.jpg"
                alt="Logo SelasarSpace"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                  Panel Super Admin
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-accent/10 text-accent border border-accent/25">
                  Akses Penuh
                </span>
              </div>
              <p className="text-xs text-muted">
                Masuk sebagai {user?.name} ({user?.email})
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex min-h-10 items-center rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted active:scale-[0.98] transition-all"
            >
              Timeline & Kontrol
            </Link>
            <Link
              href="/kalender"
              className="inline-flex min-h-10 items-center rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent-hover active:scale-[0.98] shadow-xs transition-all"
            >
              Buka Kalender
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
        {/* Ringkasan Statistik */}
        <section aria-label="Ringkasan" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-surface p-5 shadow-xs transition-all">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-foreground">{item.value}</p>
              <p className="mt-1 text-xs text-muted">{item.hint}</p>
            </div>
          ))}
        </section>

        {/* Akses Cepat Pengelolaan */}
        <section aria-label="Akses Cepat Pengelolaan" className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-sm font-bold text-foreground">Kontrol Penuh Selasar & Penjadwalan</h2>
              </div>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Sebagai Super Admin, Anda memiliki wewenang penuh untuk mengubah jadwal, memindahkan jam, menandai selesai, membatalkan, hingga menghapus booking dari himpunan mana pun secara langsung.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/kalender"
                className="inline-flex items-center rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xs"
              >
                Ubah di Kalender
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted active:scale-[0.98] transition-all"
              >
                Kelola di Timeline
              </Link>
            </div>
          </div>
        </section>

        {/* Akun Pengelola & Buat Akun */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <section aria-label="Akun pengelola" className="lg:col-span-8">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
              <div className="pb-4 border-b border-line mb-4">
                <h2 className="text-base font-bold text-foreground">Akun Pengelola</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Daftar seluruh akun yang memiliki hak akses masuk ke sistem, beserta status kredensialnya.
                </p>
              </div>
              <AccountTable accounts={rows} />
            </div>
          </section>

          <section aria-label="Buat akun admin" className="lg:col-span-4">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
              <div className="pb-4 border-b border-line mb-4">
                <h2 className="text-base font-bold text-foreground">Buat Akun Admin</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Maksimal 3 pengurus per himpunan: ketua, sekretaris, dan bendahara.
                </p>
              </div>
              <CreateAdminForm organizations={organizations} />
            </div>
          </section>
        </div>

        {/* Jejak Audit */}
        <section aria-label="Jejak audit">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
            <div className="pb-4 border-b border-line">
              <h2 className="text-base font-bold text-foreground">Jejak Audit Aktivitas Terakhir</h2>
              <p className="mt-0.5 text-xs text-muted">
                Catatan riwayat perubahan data, pelaksana aktivitas, dan waktu terjadinya tindakan.
              </p>
            </div>

            {auditLogs.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-line p-8 text-center text-xs text-muted">
                Belum ada aktivitas yang tercatat.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line/60">
                {auditLogs.map((log) => (
                  <li key={log.id} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-surface-muted/30 px-2 rounded-xl transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {ACTION_TEXT[log.action] ?? log.action}{" "}
                        <span className="font-normal text-muted text-xs">({log.entity})</span>
                      </p>
                      <p className="text-xs text-muted">{log.actor.name} ({log.actor.email})</p>
                    </div>
                    <span className="font-mono text-xs font-medium text-muted bg-surface-muted px-2.5 py-1 rounded-lg border border-line/60 self-start sm:self-center">
                      {formatDateTime(log.createdAt)}
                    </span>
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
