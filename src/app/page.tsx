"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MainContentPlaceholder } from "@/components/layout/MainContentPlaceholder";
import { MonthView } from "@/components/bookings/MonthView";
import { WeekView } from "@/components/bookings/WeekView";
import { DayView } from "@/components/bookings/DayView";
import { BookingFormModal, BookingFormValues } from "@/components/bookings/BookingFormModal";
import { BookingDetailModal } from "@/components/bookings/BookingDetailModal";
import { BookingEditModal } from "@/components/bookings/BookingEditModal";
import { BookingHistoryView } from "@/components/bookings/BookingHistoryView";
import { QuickPanelModal, QuickPanelType } from "@/components/layout/QuickPanelModal";
import { BookingEvent, CalendarView, Organization } from "@/types";
import { DEFAULT_ORGANIZATIONS, DUMMY_BOOKING_EVENTS } from "@/constants";

export default function Home() {
  // Application view state
  const [currentView, setCurrentView] = useState<CalendarView>("bulan");

  // Tanggal aktual dari perangkat pengguna (today)
  const [today, setToday] = useState<Date>(() => new Date(2026, 10, 17));

  // Bulan dan tahun yang sedang ditampilkan di kalender
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 10, 1));

  // Tanggal yang sedang dipilih/diklik pengguna
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2026, 10, 17));

  // Sinkronisasi tanggal aktual perangkat di sisi klien (mencegah hydration mismatch)
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  }, []);

  // Organization filter state
  const [organizations, setOrganizations] = useState<Organization[]>(
    DEFAULT_ORGANIZATIONS
  );
  const [bookingEvents, setBookingEvents] = useState<BookingEvent[]>(DUMMY_BOOKING_EVENTS);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<BookingEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  // Mobile sidebar drawer state
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Simple feedback alert message for buttons
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [quickPanel, setQuickPanel] = useState<QuickPanelType | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 3500);
  };

  // Month navigation handlers
  const handleChangeMonth = (offset: number) => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return nextDate;
    });
  };

  const handleToday = () => {
    const now = new Date();
    setToday(now);
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const handleNavigatePeriod = (offset: number) => {
    if (currentView === "mingguan") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + offset * 7);
      setSelectedDate(nextDate);
      setCurrentDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      return;
    }

    if (currentView === "harian") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + offset);
      setSelectedDate(nextDate);
      setCurrentDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      return;
    }

    handleChangeMonth(offset);
  };

  const visibleOrganizationIds = organizations
    .filter((organization) => organization.checked)
    .map((organization) => organization.id);

  const handleCreateBooking = (values: BookingFormValues) => {
    const organization = organizations.find((item) => item.id === values.organizationId);
    if (!organization) return;
    const toMinutes = (value: string) => { const [h, m] = value.split(":").map(Number); return h * 60 + m; };
    const conflict = bookingEvents.find((event) => event.status !== "dibatalkan" && event.date === values.date && toMinutes(values.startTime) < toMinutes(event.endTime.replace(".", ":")) && toMinutes(values.endTime) > toMinutes(event.startTime.replace(".", ":")));
    if (conflict) {
      setConflictMessage(`Waktu ${values.startTime}–${values.endTime} bertabrakan dengan jadwal "${conflict.title}" (${conflict.startTime.replace(".", ":")}–${conflict.endTime.replace(".", ":")}). Silakan pilih waktu lain.`);
      return;
    }

    const palette: Record<string, { bgClass: string; textClass: string; subtextClass: string; borderClass: string }> = {
      "himasifo": { bgClass: "bg-blue-100/90 hover:bg-blue-200/90 dark:bg-blue-950/60 dark:hover:bg-blue-900/60", textClass: "text-blue-950 dark:text-blue-100", subtextClass: "text-blue-800 dark:text-blue-300", borderClass: "border-blue-300 dark:border-blue-800" },
      "bem-fisip": { bgClass: "bg-purple-100/90 hover:bg-purple-200/90 dark:bg-purple-950/60 dark:hover:bg-purple-900/60", textClass: "text-purple-950 dark:text-purple-100", subtextClass: "text-purple-800 dark:text-purple-300", borderClass: "border-purple-300 dark:border-purple-800" },
      "himakom": { bgClass: "bg-emerald-100/90 hover:bg-emerald-200/90 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60", textClass: "text-emerald-950 dark:text-emerald-100", subtextClass: "text-emerald-800 dark:text-emerald-300", borderClass: "border-emerald-300 dark:border-emerald-800" },
      "himatifa": { bgClass: "bg-amber-100/90 hover:bg-amber-200/90 dark:bg-amber-950/60 dark:hover:bg-amber-900/60", textClass: "text-amber-950 dark:text-amber-100", subtextClass: "text-amber-800 dark:text-amber-300", borderClass: "border-amber-300 dark:border-amber-800" },
    };

    const colors = palette[organization.id] ?? palette.himasifo;
    const newEvent: BookingEvent = {
      id: `local-${Date.now()}`,
      title: values.title,
      organizationId: organization.id,
      organizationName: organization.name,
      date: values.date,
      startTime: values.startTime.replace(":", "."),
      endTime: values.endTime.replace(":", "."),
      personInCharge: values.personInCharge,
      purpose: values.purpose,
      notes: values.notes,
      status: "terjadwal",
      ...colors,
    };

    setBookingEvents((previous) => [...previous, newEvent]);
    const [year, month, day] = values.date.split("-").map(Number);
    const bookingDate = new Date(year, month - 1, day);
    setSelectedDate(bookingDate);
    setCurrentDate(new Date(year, month - 1, 1));
    setBookingFormOpen(false);
    setSuccessMessage(`Jadwal "${values.title}" berhasil ditambahkan ke simulasi kalender.`);
  };

  // Filter toggle handler
  const handleToggleOrg = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, checked: !org.checked } : org))
    );
  };

  return (
    <div className="dashboard-shell flex h-screen w-full bg-white dark:bg-[#090D16] overflow-hidden text-gray-900 dark:text-[#F8FAFC] font-sans transition-colors duration-200">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed bottom-4 right-4 z-60 bg-gray-900 dark:bg-[#1E293B] text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn border border-gray-700 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="ml-2 text-gray-400 hover:text-white cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Sidebar (Desktop fixed left, Mobile off-canvas drawer) */}
      <Sidebar
        currentDate={currentDate}
        selectedDate={selectedDate}
        today={today}
        onSelectDate={(date) => {
          setSelectedDate(date);
          if (
            date.getMonth() !== currentDate.getMonth() ||
            date.getFullYear() !== currentDate.getFullYear()
          ) {
            setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
          }
        }}
        onChangeMonth={handleChangeMonth}
        organizations={organizations}
        onToggleOrg={handleToggleOrg}
        onOpenHelp={() => setQuickPanel("help")}
        isOpenMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      <BookingDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onCancelBooking={(event) => {
          const cancelled = { ...event, status: "dibatalkan" as const };
          setBookingEvents((previous) => previous.map((item) => item.id === event.id ? cancelled : item));
          setSelectedEvent(null);
          showNotice(`Jadwal "${event.title}" dibatalkan dari simulasi kalender.`);
        }}
        onEditBooking={(event) => { setEditingEvent(event); setSelectedEvent(null); }}
      />

      <BookingEditModal event={editingEvent} organizations={organizations} onClose={() => setEditingEvent(null)} onSave={(updated) => {
        const toMinutes = (value: string) => { const [h,m] = value.split(".").map(Number); return h*60+m; };
        const conflict = bookingEvents.find((item) => item.id !== updated.id && item.status !== "dibatalkan" && item.date === updated.date && toMinutes(updated.startTime) < toMinutes(item.endTime) && toMinutes(updated.endTime) > toMinutes(item.startTime));
        if (conflict) { setEditingEvent(null); setConflictMessage(`Perubahan jadwal bertabrakan dengan "${conflict.title}". Silakan pilih waktu lain.`); return; }
        setBookingEvents((previous) => previous.map((item) => item.id === updated.id ? updated : item));
        setEditingEvent(null); showNotice(`Jadwal "${updated.title}" berhasil diperbarui.`);
        const [y,m,d] = updated.date.split("-").map(Number); setSelectedDate(new Date(y,m-1,d)); setCurrentDate(new Date(y,m-1,1));
      }} />

      {successMessage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-950/45 dark:bg-black/70 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="booking-success-title" className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1E293B] p-6 text-center shadow-2xl transition-colors">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-2xl text-emerald-600 dark:text-emerald-400">✓</div>
            <h2 id="booking-success-title" className="mt-4 text-lg font-semibold text-gray-950 dark:text-[#F8FAFC]">Peminjaman berhasil disimpan</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-[#CBD5E1]">{successMessage}</p>
            <p className="mt-2 text-xs text-gray-400 dark:text-[#64748B]">Data ini hanya tersimpan sementara di frontend.</p>
            <button type="button" onClick={() => setSuccessMessage(null)} className="mt-5 rounded-lg bg-gray-950 hover:bg-gray-800 dark:bg-[#2563EB] dark:hover:bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors">Kembali ke Kalender</button>
          </section>
        </div>
      )}

      {conflictMessage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-950/45 dark:bg-black/70 p-4">
          <section role="alertdialog" aria-modal="true" aria-labelledby="booking-conflict-title" className="w-full max-w-md rounded-2xl border border-red-100 dark:border-red-900/60 bg-white dark:bg-[#111827] p-6 shadow-2xl transition-colors">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50 text-2xl text-red-600 dark:text-red-400">!</div>
            <h2 id="booking-conflict-title" className="mt-4 text-center text-lg font-semibold text-gray-950 dark:text-[#F8FAFC]">Jadwal bentrok</h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-600 dark:text-[#CBD5E1]">{conflictMessage}</p>
            <button type="button" onClick={() => setConflictMessage(null)} className="mt-5 w-full rounded-lg bg-gray-950 hover:bg-gray-800 dark:bg-[#2563EB] dark:hover:bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors">Pilih Waktu Lain</button>
          </section>
        </div>
      )}

      <BookingFormModal
        open={bookingFormOpen}
        selectedDate={selectedDate}
        organizations={organizations}
        onClose={() => setBookingFormOpen(false)}
        onSubmit={handleCreateBooking}
      />

      <QuickPanelModal
        type={quickPanel}
        events={bookingEvents}
        organizations={organizations}
        today={today}
        onClose={() => setQuickPanel(null)}
        onOpenHistory={() => { setCurrentView("histori"); setQuickPanel(null); }}
        onSaveOrganizations={(ids) => setOrganizations((previous) => previous.map((item) => ({ ...item, checked: ids.includes(item.id) })))}
        onOpenBooking={(event) => { setSelectedEvent(event); setQuickPanel(null); }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          currentDate={currentDate}
          selectedDate={selectedDate}
          currentView={currentView}
          onViewChange={setCurrentView}
          onPrevPeriod={() => handleNavigatePeriod(-1)}
          onNextPeriod={() => handleNavigatePeriod(1)}
          onToday={handleToday}
          onPinjamTempat={() => setBookingFormOpen(true)}
          onToggleSidebarMobile={() => setSidebarOpenMobile((prev) => !prev)}
          onOpenProfile={() => setQuickPanel("profile")}
          onOpenNotification={() => setQuickPanel("notifications")}
          onOpenSettings={() => setQuickPanel("settings")}
        />

        {/* Viewport Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#090D16] transition-colors">
          {currentView === "bulan" ? (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              today={today}
              onSelectDate={(date) => {
                setSelectedDate(date);
                if (
                  date.getMonth() !== currentDate.getMonth() ||
                  date.getFullYear() !== currentDate.getFullYear()
                ) {
                  setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
                }
              }}
              organizations={organizations}
              events={bookingEvents}
              onEventClick={(event) => setSelectedEvent(event)}
            />
          ) : currentView === "mingguan" ? (
            <WeekView
              selectedDate={selectedDate}
              today={today}
              events={bookingEvents}
              visibleOrganizationIds={visibleOrganizationIds}
              onEventClick={(event) => setSelectedEvent(event)}
            />
          ) : currentView === "harian" ? (
            <DayView
              selectedDate={selectedDate}
              today={today}
              events={bookingEvents}
              visibleOrganizationIds={visibleOrganizationIds}
              onEventClick={(event) => setSelectedEvent(event)}
            />
          ) : currentView === "histori" ? (
            <BookingHistoryView events={bookingEvents} currentDate={currentDate} onEventClick={(event) => setSelectedEvent(event)} />
          ) : (
            <MainContentPlaceholder currentView={currentView} currentDate={currentDate} selectedDate={selectedDate} organizations={organizations} />
          )}
        </main>
      </div>
    </div>
  );
}
