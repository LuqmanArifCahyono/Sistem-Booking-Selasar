// [FRONTEND CHANGE START: Halaman Utama Panel Sub-Admin - Integrasi Database Real]
"use client";

import React, { useState, useTransition, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { AdminTimelineView } from "@/components/admin/AdminTimelineView";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { AdminSlotDetailModal } from "@/components/admin/AdminSlotDetailModal";
import { AdminManualBookingModal, AdminManualBookingSubmitData } from "@/components/admin/AdminManualBookingModal";
import { AdminEditBookingModal } from "@/components/admin/AdminEditBookingModal";
import { AdminExportModal } from "@/components/admin/AdminExportModal";
import { AdminSupportModal } from "@/components/admin/AdminSupportModal";
import { AdminLogoutModal } from "@/components/admin/AdminLogoutModal";
import { DefaultPasswordBanner } from "@/components/auth/DefaultPasswordBanner";
import {
  formatDateIndonesian,
  formatDateDMY,
} from "@/constants/admin";
import { AdminTimelineSlot, AdminActivityLogItem, AdminStats, AdminOrganizationFilter } from "@/types/admin";
import { toISO } from "@/lib/date-format";

interface AdminClientProps {
  initialSlots: AdminTimelineSlot[];
  initialStats: AdminStats;
  initialActivityLogs: AdminActivityLogItem[];
  initialOrganizations: AdminOrganizationFilter[];
  initialDateISO: string;
  room: { id: string; name: string; openTime: string; closeTime: string };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    position?: string | null;
    organizationId?: string | null;
    organizationName?: string | null;
    mustChangePassword?: boolean;
  };
}

export function AdminClient({
  initialSlots,
  initialStats,
  initialActivityLogs,
  initialOrganizations,
  initialDateISO,
  room,
  user,
}: AdminClientProps) {
  // Parsing tanggal awal dari ISO YYYY-MM-DD
  const parseInitialDate = () => {
    const [y, m, d] = initialDateISO.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const [activeNav, setActiveNav] = useState<"monitor" | "accounts">("monitor");
  const [selectedDate, setSelectedDate] = useState<Date>(parseInitialDate);
  const [organizations, setOrganizations] = useState<AdminOrganizationFilter[]>(initialOrganizations);
  const [slots, setSlots] = useState<AdminTimelineSlot[]>(initialSlots);
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLogItem[]>(initialActivityLogs);
  const [isPending, startTransition] = useTransition();

  // State modal-modal interaktif
  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState<AdminTimelineSlot | null>(null);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<AdminTimelineSlot | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [targetSlotForManual, setTargetSlotForManual] = useState<AdminTimelineSlot | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Feedback Toast Notifikasi
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastNotice(message);
    setTimeout(() => {
      setToastNotice(null);
    }, 3500);
  }, []);

  const dateDMY = formatDateDMY(selectedDate);
  const dateISO = toISO(selectedDate);

  // Muat data linimasa & statistik untuk tanggal tertentu
  const fetchTimelineData = useCallback(async (isoDateStr: string) => {
    try {
      const res = await fetch(`/api/admin/timeline?date=${isoDateStr}&roomId=${room.id}`);
      if (!res.ok) throw new Error("Gagal memuat jadwal");
      const json = await res.json();
      if (json.ok && json.data) {
        setSlots(json.data.slots);
        setStats(json.data.stats);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data jadwal:", err);
    }
  }, [room.id]);

  // Muat ulang log audit terbaru
  const refreshAuditLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/audit-logs?limit=30");
      if (!res.ok) return;
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        type RawAudit = {
          id: string;
          action: string;
          before?: string | null;
          after?: string | null;
          createdAt: string;
          actor: {
            id: string;
            name: string;
            organizationId?: string | null;
            organization?: { id: string; name: string } | null;
          };
        };

        const mapped: AdminActivityLogItem[] = json.data.map((log: RawAudit) => {
          let beforeObj: Record<string, unknown> = {};
          let afterObj: Record<string, unknown> = {};
          try { if (log.before) beforeObj = JSON.parse(log.before); } catch {}
          try { if (log.after) afterObj = JSON.parse(log.after); } catch {}

          const isBooking = log.action === "BOOKING_CREATE";
          const title = (afterObj.title as string) || (beforeObj.title as string) || "Peminjaman Selasar";
          const rawDate = (afterObj.date as string) || (beforeObj.date as string) || log.createdAt.slice(0, 10);
          const start = (afterObj.startTime as string) || (beforeObj.startTime as string) || "08:00";
          const end = (afterObj.endTime as string) || (beforeObj.endTime as string) || "10:00";

          return {
            id: log.id,
            type: isBooking ? ("booking" as const) : ("batal" as const),
            organizationId: log.actor.organizationId || "lainnya",
            organizationName: log.actor.organization?.name || "Pengelola Kampus",
            personInCharge: log.actor.name,
            eventName: title,
            date: rawDate.includes("-") ? `${rawDate.split("-")[2]}/${rawDate.split("-")[1]}/${rawDate.split("-")[0]}` : rawDate,
            timeRange: `${start.replace(":", ".")} - ${end.replace(":", ".")} WIB`,
            timestamp: new Date(log.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) + " WIB",
            slotTag: isBooking ? "Booking Baru" : "Slot Otomatis Dibuka",
            reason: (afterObj.reason as string) || "Pelepasan jadwal oleh peminjam.",
            cancellationStatus: "Pembatalan Mandiri User",
          };
        });
        setActivityLogs(mapped);
      }
    } catch (err) {
      console.error("Gagal refresh audit logs:", err);
    }
  }, []);

  // Handler pergantian tanggal dari sidebar
  const handleSelectDate = (newDate: Date) => {
    setSelectedDate(newDate);
    const newDateISO = toISO(newDate);
    startTransition(() => {
      fetchTimelineData(newDateISO);
    });
  };

  // Toggle checklist filter organisasi
  const handleToggleOrg = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, checked: !org.checked } : org))
    );
  };

  // Handler kunci / buka kunci slot waktu
  const handleLockSlot = async (slot: AdminTimelineSlot) => {
    try {
      if (slot.status === "dikunci") {
        // Buka kunci slot
        const res = await fetch(`/api/slots/lock?id=${encodeURIComponent(slot.id)}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal membuka kunci slot.");

        showToast(`Kunci slot ${slot.timeSlot} berhasil dibuka kembali.`);
      } else {
        // Kunci slot waktu
        const times = slot.rawTime.split("-").map((s) => s.trim());
        const startTime = times[0] || "08:00";
        const endTime = times[1] || "10:00";

        const res = await fetch("/api/slots/lock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: dateISO,
            startTime,
            endTime,
            reason: "Pemeliharaan & kontrol operasional selasar",
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal mengunci slot.");

        showToast(`Slot ${slot.timeSlot} berhasil dikunci oleh Pengelola.`);
      }

      await Promise.all([fetchTimelineData(dateISO), refreshAuditLogs()]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan pada kontrol slot.";
      showToast(msg);
    }
  };

  // Handler penambahan jadwal manual
  const handleManualBookingSubmit = async (data: AdminManualBookingSubmitData) => {
    const payload = {
      ...data,
      roomId: room.id,
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Gagal menyimpan jadwal manual.");
    }

    showToast(`Jadwal manual "${data.title}" berhasil disimpan ke linimasa.`);
    await Promise.all([fetchTimelineData(dateISO), refreshAuditLogs()]);
  };

  // Handler Super Admin ubah & pindahkan booking
  const handleEditBooking = async (
    bookingId: string,
    data: {
      title?: string;
      organizationId?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      pjName?: string;
      pjContact?: string;
      purpose?: string;
    },
  ) => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Gagal memperbarui jadwal.");
    }
    showToast(`Jadwal "${json.data?.title || data.title}" berhasil diperbarui.`);
    await Promise.all([fetchTimelineData(dateISO), refreshAuditLogs()]);
  };

  // Handler Super Admin hapus booking
  const handleDeleteBooking = async (slot: AdminTimelineSlot) => {
    try {
      const res = await fetch(`/api/bookings/${slot.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menghapus jadwal.");
      }
      showToast(`Jadwal "${slot.eventName}" berhasil dihapus dari linimasa.`);
      await Promise.all([fetchTimelineData(dateISO), refreshAuditLogs()]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus jadwal.";
      showToast(msg);
    }
  };

  // Filter slot berdasarkan checklist organisasi
  const visibleOrgIds = organizations.filter((o) => o.checked).map((o) => o.id);
  const visibleSlots = slots.filter((slot) => {
    if (slot.status === "tersedia" || slot.status === "dikunci") return true;
    return visibleOrgIds.includes(slot.organizationId);
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F172B] dark:text-[#F8FAFC] transition-colors duration-200 font-sans antialiased">
      {/* Toast Notifikasi Status */}
      {toastNotice && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0F172B] dark:bg-[#1E293B] text-white text-xs font-semibold shadow-lg border border-[#334155] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#00BC7D] animate-ping" />
          <span>{toastNotice}</span>
          <button
            type="button"
            onClick={() => setToastNotice(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar Navigasi Sub-Admin */}
      <AdminSidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        organizations={organizations}
        onToggleOrg={handleToggleOrg}
        onOpenHelp={() => setIsSupportModalOpen(true)}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
        accountsCount={organizations.length}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Banner Pengingat Sandi Bawaan */}
        <DefaultPasswordBanner mustChange={user.mustChangePassword} />

        {/* Header Sub-Admin */}
        <AdminHeader
          dateLabel={formatDateIndonesian(selectedDate)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenManualBooking={() => {
            setTargetSlotForManual(null);
            setIsManualBookingOpen(true);
          }}
        />

        {/* Viewport Konten Utama */}
        <main className="p-5 sm:p-7 flex flex-col gap-6 flex-1 max-w-7xl w-full mx-auto">
          {activeNav === "monitor" ? (
            <>
              {/* Baris 4 Kartu Statistik */}
              <section aria-label="Ringkasan Statistik Sub-Admin">
                <AdminStatCards stats={stats} />
              </section>

              {/* Grid 2 Kolom: Linimasa Jadwal & Log Aktivitas Audit */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
                {/* Kolom Kiri (7 Col): Linimasa Jadwal */}
                <section className="lg:col-span-7 w-full h-full relative" aria-label="Linimasa Jadwal">
                  {isPending && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/40 backdrop-blur-2xs rounded-2xl z-10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#2563EB] dark:text-[#93C5FD] animate-pulse">
                        Memperbarui linimasa...
                      </span>
                    </div>
                  )}
                  <AdminTimelineView
                    slots={visibleSlots}
                    dateFormatted={dateDMY}
                    onViewDetail={(slot) => setSelectedSlotForDetail(slot)}
                    onManualFill={(slot) => {
                      setTargetSlotForManual(slot);
                      setIsManualBookingOpen(true);
                    }}
                    onLockSlot={handleLockSlot}
                  />
                </section>

                {/* Kolom Kanan (5 Col): Log Aktivitas & Audit Pembatalan User */}
                <section className="lg:col-span-5 w-full h-full" aria-label="Log Aktivitas User">
                  <AdminActivityLog
                    logs={activityLogs}
                    selectedOrgIds={visibleOrgIds}
                  />
                </section>
              </div>
            </>
          ) : (
            /* Tampilan Monitoring Akun Organisasi */
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-center">
              <h2 className="text-lg font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Monitoring & Kelola Akun Organisasi
              </h2>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
                Tersedia {organizations.length} himpunan mahasiswa aktif terdaftar di sistem SelasarSpace.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center gap-3"
                  >
                    <span className={`w-3 h-3 rounded-full ${org.dotClass} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172B] dark:text-[#F8FAFC] truncate">
                        {org.name}
                      </p>
                      <p className="text-[10px] text-[#62748E] dark:text-[#94A3B8] truncate">
                        Status: Aktif
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveNav("monitor")}
                className="mt-6 px-4 py-2 text-xs font-bold rounded-lg bg-[#2563EB] text-white cursor-pointer hover:bg-[#1D4ED8] transition-colors"
              >
                Kembali ke Monitor Jadwal & Slot
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal Detail Jadwal */}
      <AdminSlotDetailModal
        slot={selectedSlotForDetail}
        onClose={() => setSelectedSlotForDetail(null)}
        userRole={user.role}
        onEditBooking={(slot) => setSelectedSlotForEdit(slot)}
        onDeleteBooking={handleDeleteBooking}
      />

      {/* Modal Ubah / Pindahkan Jadwal Super Admin */}
      <AdminEditBookingModal
        isOpen={Boolean(selectedSlotForEdit)}
        onClose={() => setSelectedSlotForEdit(null)}
        slot={selectedSlotForEdit}
        organizations={organizations}
        onSave={handleEditBooking}
      />

      {/* Modal Tambah Jadwal Manual */}
      <AdminManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        organizations={organizations}
        targetSlot={targetSlotForManual}
        activeDate={dateDMY}
        dateISO={dateISO}
        userRole={user.role}
        userOrganizationId={user.organizationId}
        onSubmit={handleManualBookingSubmit}
      />

      {/* Modal Ekspor Laporan */}
      <AdminExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Modal Kontak Bantuan Pengelola Fasilitas */}
      <AdminSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Modal Konfirmasi Logout Sub-Admin */}
      <AdminLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
