// [FRONTEND CHANGE START: Halaman Utama Panel Sub-Admin - Milestone 1 & 2]
"use client";

import React, { useState, useMemo } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { AdminTimelineView } from "@/components/admin/AdminTimelineView";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { AdminSlotDetailModal } from "@/components/admin/AdminSlotDetailModal";
import { AdminManualBookingModal } from "@/components/admin/AdminManualBookingModal";
import { AdminExportModal } from "@/components/admin/AdminExportModal";
import { AdminSupportModal } from "@/components/admin/AdminSupportModal";
import { AdminLogoutModal } from "@/components/admin/AdminLogoutModal";
import {
  INITIAL_ADMIN_ORGANIZATIONS,
  INITIAL_ADMIN_STATS,
  INITIAL_TIMELINE_SLOTS,
  INITIAL_ACTIVITY_LOGS,
  formatDateIndonesian,
  formatDateDMY,
  formatMonthYear,
  getSlotsForDate,
  calculateStatsForSlots,
} from "@/constants/admin";
import { AdminTimelineSlot, AdminActivityLogItem, SlotStatus } from "@/types/admin";

export default function AdminPage() {
  // State navigasi aktif panel
  const [activeNav, setActiveNav] = useState<"monitor" | "accounts">("monitor");

  // State tanggal aktif (default Kamis, 12/11/2026)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 10, 12));

  // State filter organisasi
  const [organizations, setOrganizations] = useState(INITIAL_ADMIN_ORGANIZATIONS);

  // [FRONTEND CHANGE START: Multi-Date Schedule Cache - Milestone 2]
  // Dictionary untuk menyimpan state slot jadwal per tanggal
  const [modifiedSlotsByDate, setModifiedSlotsByDate] = useState<
    Record<string, AdminTimelineSlot[]>
  >({
    "12/11/2026": INITIAL_TIMELINE_SLOTS,
  });

  // Format DMY untuk query tanggal aktif
  const dateDMY = formatDateDMY(selectedDate);

  // Ambil slot jadwal aktif berdasarkan tanggal yang dipilih
  const currentSlots = useMemo(() => {
    return modifiedSlotsByDate[dateDMY] || getSlotsForDate(dateDMY);
  }, [dateDMY, modifiedSlotsByDate]);
  // [FRONTEND CHANGE END: Multi-Date Schedule Cache - Milestone 2]

  // State log aktivitas dan audit pembatalan
  const [activityLogs, setActivityLogs] = useState<AdminActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);

  // [FRONTEND CHANGE START: Dynamic Stats Synchronization - Milestone 2]
  // Ringkasan 4 statistik dihitung dinamis berdasarkan tanggal dan slot aktif
  const stats = useMemo(() => {
    return calculateStatsForSlots(dateDMY, currentSlots, formatMonthYear(selectedDate));
  }, [dateDMY, currentSlots, selectedDate]);
  // [FRONTEND CHANGE END: Dynamic Stats Synchronization - Milestone 2]

  // State modal-modal interaktif
  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState<AdminTimelineSlot | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [targetSlotForManual, setTargetSlotForManual] = useState<AdminTimelineSlot | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Feedback Toast Notifikasi
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastNotice(message);
    setTimeout(() => {
      setToastNotice(null);
    }, 3500);
  };

  // Toggle checklist filter organisasi
  const handleToggleOrg = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, checked: !org.checked } : org))
    );
  };

  // Handler kunci / buka kunci slot waktu
  const handleLockSlot = (slot: AdminTimelineSlot) => {
    const updated: AdminTimelineSlot[] = currentSlots.map((s) => {
      if (s.id === slot.id) {
        const newStatus: SlotStatus = s.status === "dikunci" ? "tersedia" : "dikunci";
        return { ...s, status: newStatus };
      }
      return s;
    });

    setModifiedSlotsByDate((prev) => ({
      ...prev,
      [dateDMY]: updated,
    }));

    const isNowLocked = slot.status !== "dikunci";
    showToast(
      isNowLocked
        ? `Slot ${slot.timeSlot} berhasil dikunci oleh Sub-Admin.`
        : `Kunci slot ${slot.timeSlot} berhasil dibuka kembali.`
    );
  };

  // Handler penambahan jadwal manual
  const handleManualBookingSubmit = (newSlotData: Partial<AdminTimelineSlot>) => {
    const exists = currentSlots.some((s) => s.id === newSlotData.id);
    const updated: AdminTimelineSlot[] = exists
      ? currentSlots.map((s) =>
          s.id === newSlotData.id ? ({ ...s, ...newSlotData } as AdminTimelineSlot) : s
        )
      : [...currentSlots, newSlotData as AdminTimelineSlot];

    setModifiedSlotsByDate((prev) => ({
      ...prev,
      [dateDMY]: updated,
    }));

    // Tambah ke activity log
    const newLogItem: AdminActivityLogItem = {
      id: `log-${Date.now()}`,
      type: "booking",
      organizationId: newSlotData.organizationId || "manual",
      organizationName: newSlotData.organizationName || "Manual Booking",
      personInCharge: newSlotData.personInCharge || "Sub-Admin",
      eventName: newSlotData.eventName || "Kegiatan Manual",
      date: dateDMY,
      timeRange: newSlotData.timeSlot || "18.00 - 20.00 WIB",
      timestamp: `${dateDMY} • 12:00 WIB`,
      slotTag: "Booking Baru (Sub-Admin)",
    };

    setActivityLogs((prev) => [newLogItem, ...prev]);
    showToast(`Jadwal manual "${newSlotData.eventName}" berhasil disimpan ke linimasa.`);
  };

  // Handler simulasi user batal
  const handleSimulateUserCancel = () => {
    // Cari slot aktif untuk dibatalkan dalam simulasi
    const slotToCancel = currentSlots.find((s) => s.status === "dipesan");

    if (slotToCancel) {
      const updated: AdminTimelineSlot[] = currentSlots.map((s) =>
        s.id === slotToCancel.id
          ? {
              ...s,
              status: "tersedia" as SlotStatus,
              eventName: "Waktu tersedia (Dilepas User)",
              organizationName: "",
              personInCharge: "",
            }
          : s
      );

      setModifiedSlotsByDate((prev) => ({
        ...prev,
        [dateDMY]: updated,
      }));

      // Tambahkan log pembatalan baru
      const cancelLog: AdminActivityLogItem = {
        id: `log-${Date.now()}`,
        type: "batal",
        organizationId: slotToCancel.organizationId || "user",
        organizationName: slotToCancel.organizationName || "Ormawa",
        personInCharge: slotToCancel.personInCharge || "PJ Ormawa",
        eventName: slotToCancel.eventName,
        date: dateDMY,
        timeRange: slotToCancel.timeSlot,
        timestamp: `${dateDMY} • 11:45 WIB`,
        slotTag: "Slot Otomatis Dibuka",
        reason: "Pengalihan format kegiatan atau perubahan jadwal mandiri oleh panitia.",
        cancellationStatus: "Pembatalan Mandiri User",
      };

      setActivityLogs((prev) => [cancelLog, ...prev]);
      showToast(
        `Simulasi berhasil: Jadwal "${slotToCancel.eventName}" dibatalkan oleh user. Slot otomatis dibuka.`
      );
    } else {
      showToast("Tidak ada jadwal dipesan yang dapat dibatalkan pada tanggal ini.");
    }
  };

  // Filter slot berdasarkan checklist organisasi
  const visibleOrgIds = organizations.filter((o) => o.checked).map((o) => o.id);
  const visibleSlots = currentSlots.filter((slot) => {
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
        onSelectDate={setSelectedDate}
        organizations={organizations}
        onToggleOrg={handleToggleOrg}
        onOpenHelp={() => setIsSupportModalOpen(true)}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Header Sub-Admin */}
        <AdminHeader
          dateLabel={formatDateIndonesian(selectedDate)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenManualBooking={() => {
            setTargetSlotForManual(null);
            setIsManualBookingOpen(true);
          }}
          onOpenHtmlModal={() => {
            showToast("Pratinjau berkas HTML Sub-Admin aktif.");
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
                {/* Kolom Kiri (7 Col): Linimasa Jadwal 08.00 - 20.00 WIB */}
                <section className="lg:col-span-7 w-full h-full" aria-label="Linimasa Jadwal">
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
            /* Tampilan Placeholder Menu Monitoring Akun Organisasi (Akan dikembangkan di Milestone 6) */
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-center">
              <h2 className="text-lg font-bold text-[#0F172B] dark:text-[#F8FAFC]">
                Monitoring & Kelola Akun Organisasi
              </h2>
              <p className="text-xs text-[#62748E] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
                Menu ini akan memuat tabel status kredensial dan kontrol akun ormawa sesuai referensi PDF 06.
              </p>
              <button
                type="button"
                onClick={() => setActiveNav("monitor")}
                className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-[#2563EB] text-white cursor-pointer"
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
      />

      {/* Modal Tambah Jadwal Manual */}
      <AdminManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        organizations={organizations}
        targetSlot={targetSlotForManual}
        activeDate={dateDMY}
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
// [FRONTEND CHANGE END: Halaman Utama Panel Sub-Admin - Milestone 1]
