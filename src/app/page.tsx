"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MainContentPlaceholder } from "@/components/layout/MainContentPlaceholder";
import { MonthView } from "@/components/bookings/MonthView";
import { CalendarView, Organization } from "@/types";
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

  // Mobile sidebar drawer state
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Simple feedback alert message for buttons
  const [actionNotice, setActionNotice] = useState<string | null>(null);

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
    // Mengarahkan kalender ke bulan aktual dan memilih tanggal aktual
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Filter toggle handler
  const handleToggleOrg = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, checked: !org.checked } : org))
    );
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-gray-900 font-sans">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed bottom-4 right-4 z-60 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn border border-gray-700">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="ml-2 text-gray-400 hover:text-white"
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
        onOpenHelp={() =>
          showNotice("Bantuan fasilitas: Hubungi Bagian Kemahasiswaan & Sarpras.")
        }
        isOpenMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          currentDate={currentDate}
          currentView={currentView}
          onViewChange={setCurrentView}
          onPrevMonth={() => handleChangeMonth(-1)}
          onNextMonth={() => handleChangeMonth(1)}
          onToday={handleToday}
          onPinjamTempat={() =>
            showNotice("Formulir Pinjam Tempat akan dibuka pada tahap formulir & modal berikutnya.")
          }
          onToggleSidebarMobile={() => setSidebarOpenMobile((prev) => !prev)}
          onOpenProfile={() =>
            showNotice("Pengguna: Jonathan (Layanan Kampus).")
          }
          onOpenNotification={() =>
            showNotice("Notifikasi: Tidak ada pengajuan yang tertunda.")
          }
          onOpenSettings={() =>
            showNotice("Pengaturan kalender aktif.")
          }
        />

        {/* Viewport Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
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
              events={DUMMY_BOOKING_EVENTS}
              onEventClick={(event) => {
                showNotice(
                  `${event.title} (${event.organizationName}) • ${event.startTime}–${event.endTime} WIB`
                );
              }}
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
  );
}
