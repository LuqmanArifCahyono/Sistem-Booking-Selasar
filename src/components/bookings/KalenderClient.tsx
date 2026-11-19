"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MainContentPlaceholder } from "@/components/layout/MainContentPlaceholder";
import { MonthView } from "@/components/bookings/MonthView";
import { WeekView } from "@/components/bookings/WeekView";
import { DayView } from "@/components/bookings/DayView";
import { BookingDetailModal } from "@/components/bookings/BookingDetailModal";
import { BookingEditModal } from "@/components/bookings/BookingEditModal";
import { BookingFormModal, BookingFormValues } from "@/components/bookings/BookingFormModal";
import { BookingHistoryView } from "@/components/bookings/BookingHistoryView";
import { QuickPanelModal, QuickPanelType } from "@/components/layout/QuickPanelModal";
import { DefaultPasswordBanner } from "@/components/auth/DefaultPasswordBanner";
import { BookingEvent, CalendarView, Organization } from "@/types";

interface KalenderClientProps {
  todayIso: string;
  events: BookingEvent[];
  organizations: Organization[];
  roomId?: string;
  backLink?: { href: string; label: string };
  secondaryBackLink?: { href: string; label: string };
  mustChangePassword?: boolean;
  canCreate?: boolean;
  userRole?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function KalenderClient({
  todayIso,
  events,
  organizations: initialOrgs,
  roomId = "default-room",
  backLink,
  secondaryBackLink,
  mustChangePassword,
  canCreate = false,
  user,
}: KalenderClientProps) {
  const router = useRouter();
  const today = parseIsoDate(todayIso);

  const [eventList, setEventList] = useState<BookingEvent[]>(events);
  const [currentView, setCurrentView] = useState<CalendarView>("bulan");
  const [currentDate, setCurrentDate] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrgs);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<BookingEvent | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [quickPanel, setQuickPanel] = useState<QuickPanelType | null>(null);

  const [prevEvents, setPrevEvents] = useState(events);
  if (events !== prevEvents) {
    setPrevEvents(events);
    setEventList(events);
  }

  const handleChangeMonth = (offset: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleNavigatePeriod = (offset: number) => {
    if (currentView === "mingguan") {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + offset * 7);
      setSelectedDate(next);
      setCurrentDate(new Date(next.getFullYear(), next.getMonth(), 1));
      return;
    }
    if (currentView === "harian") {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + offset);
      setSelectedDate(next);
      setCurrentDate(new Date(next.getFullYear(), next.getMonth(), 1));
      return;
    }
    handleChangeMonth(offset);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const handleToggleOrg = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, checked: !org.checked } : org)),
    );
  };

  const visibleOrganizationIds = organizations
    .filter((organization) => organization.checked)
    .map((organization) => organization.id);

  // Handler: Buka modal edit
  const handleEditBooking = (event: BookingEvent) => {
    setSelectedEvent(null);
    setEditingEvent(event);
  };

  // Handler: Simpan perubahan jadwal (Super Admin & Pembuat)
  const handleSaveEditBooking = async (updated: BookingEvent) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updated.title,
          organizationId: updated.organizationId,
          date: updated.date,
          startTime: updated.startTime.replace(".", ":"),
          endTime: updated.endTime.replace(".", ":"),
          pjName: updated.personInCharge,
          pjContact: updated.pjContact || "081234567890",
          purpose: updated.purpose,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal memperbarui jadwal.");
        return;
      }

      setEventList((prev) =>
        prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      );
      setEditingEvent(null);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan saat menyimpan jadwal.");
    } finally {
      setBusy(false);
    }
  };

  // Handler: Batalkan jadwal
  const handleCancelBooking = async (event: BookingEvent) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${event.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DIBATALKAN",
          reason: "Dibatalkan melalui kalender selasar",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal membatalkan jadwal.");
        return;
      }

      setEventList((prev) =>
        prev.map((item) => (item.id === event.id ? { ...item, status: "dibatalkan" } : item)),
      );
      setSelectedEvent(null);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan saat membatalkan jadwal.");
    } finally {
      setBusy(false);
    }
  };

  // Handler: Tandai selesai
  const handleCompleteBooking = async (event: BookingEvent) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${event.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SELESAI" }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menandai jadwal selesai.");
        return;
      }

      setEventList((prev) =>
        prev.map((item) => (item.id === event.id ? { ...item, status: "selesai" } : item)),
      );
      setSelectedEvent(null);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setBusy(false);
    }
  };

  // Handler: Hapus jadwal permanen (Soft Delete)
  const handleDeleteBooking = async (event: BookingEvent) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${event.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menghapus jadwal.");
        return;
      }

      setEventList((prev) => prev.filter((item) => item.id !== event.id));
      setSelectedEvent(null);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus jadwal.");
    } finally {
      setBusy(false);
    }
  };

  // Handler: Buat booking baru via modal kalender
  const handleCreateBooking = async (values: BookingFormValues) => {
    setBusy(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          organizationId: values.organizationId,
          roomId: roomId,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          pjName: values.personInCharge,
          pjContact: "081234567890",
          purpose: values.purpose,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal membuat jadwal baru.");
        return;
      }

      setIsBookingFormOpen(false);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan saat membuat jadwal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dashboard-shell flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-foreground">
      <DefaultPasswordBanner mustChange={mustChangePassword} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          today={today}
          onSelectDate={handleSelectDate}
          onChangeMonth={handleChangeMonth}
          organizations={organizations}
          onToggleOrg={handleToggleOrg}
          onOpenHelp={() => setQuickPanel("help")}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
          user={user}
        />

        {/* Modal Detail Jadwal dengan tombol Aksi jika berhak (Super Admin & Author) */}
        <BookingDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEditBooking={selectedEvent?.canMutate ? handleEditBooking : undefined}
          onCancelBooking={selectedEvent?.canMutate ? handleCancelBooking : undefined}
          onCompleteBooking={selectedEvent?.canMutate ? handleCompleteBooking : undefined}
          onDeleteBooking={selectedEvent?.canMutate ? handleDeleteBooking : undefined}
          busy={busy}
        />

        {/* Modal Edit Jadwal (Ubah tanggal, jam, judul, dll) */}
        {editingEvent && (
          <BookingEditModal
            event={editingEvent}
            organizations={organizations}
            onClose={() => setEditingEvent(null)}
            onSave={handleSaveEditBooking}
          />
        )}

        {/* Modal Pinjam Tempat Baru */}
        {isBookingFormOpen && (
          <BookingFormModal
            open={isBookingFormOpen}
            selectedDate={selectedDate}
            organizations={organizations}
            onClose={() => setIsBookingFormOpen(false)}
            onSubmit={handleCreateBooking}
          />
        )}

        <QuickPanelModal
          type={quickPanel}
          events={eventList}
          organizations={organizations}
          today={today}
          user={user}
          onClose={() => setQuickPanel(null)}
          onOpenHistory={() => {
            if (user?.role !== "USER") {
              setCurrentView("histori");
            }
            setQuickPanel(null);
          }}
          onSaveOrganizations={(ids) =>
            setOrganizations((previous) =>
              previous.map((item) => ({ ...item, checked: ids.includes(item.id) })),
            )
          }
          onOpenBooking={(event) => {
            setSelectedEvent(event);
            setQuickPanel(null);
          }}
        />

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            currentDate={currentDate}
            selectedDate={selectedDate}
            currentView={currentView}
            onViewChange={setCurrentView}
            onPrevPeriod={() => handleNavigatePeriod(-1)}
            onNextPeriod={() => handleNavigatePeriod(1)}
            onToday={handleToday}
            onPinjamTempat={canCreate ? () => setIsBookingFormOpen(true) : undefined}
            onToggleSidebarMobile={() => setSidebarOpenMobile((prev) => !prev)}
            onOpenProfile={() => setQuickPanel("profile")}
            onOpenNotification={() => setQuickPanel("notifications")}
            onOpenSettings={() => setQuickPanel("settings")}
            backLink={backLink}
            secondaryBackLink={secondaryBackLink}
            user={user}
          />

          <main className="flex flex-1 flex-col overflow-hidden bg-background">
            {currentView === "bulan" ? (
              <MonthView
                currentDate={currentDate}
                selectedDate={selectedDate}
                today={today}
                onSelectDate={handleSelectDate}
                organizations={organizations}
                events={eventList}
                onEventClick={setSelectedEvent}
              />
            ) : currentView === "mingguan" ? (
              <WeekView
                selectedDate={selectedDate}
                today={today}
                events={eventList}
                visibleOrganizationIds={visibleOrganizationIds}
                onEventClick={setSelectedEvent}
              />
            ) : currentView === "harian" ? (
              <DayView
                selectedDate={selectedDate}
                today={today}
                events={eventList}
                visibleOrganizationIds={visibleOrganizationIds}
                onEventClick={setSelectedEvent}
              />
            ) : currentView === "histori" && user?.role !== "USER" ? (
              <BookingHistoryView
                events={eventList}
                currentDate={currentDate}
                onEventClick={setSelectedEvent}
              />
            ) : (
              <MainContentPlaceholder
                currentView={currentView}
                currentDate={currentDate}
                selectedDate={selectedDate}
                organizations={organizations}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
