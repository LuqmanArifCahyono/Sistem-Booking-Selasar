"use client";

import React from "react";
import { BookingEvent } from "@/types";
import { MONTH_NAMES_ID } from "@/constants";

interface Props {
  events: BookingEvent[];
  onEventClick: (event: BookingEvent) => void;
  currentDate: Date;
}

function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return `${d} ${MONTH_NAMES_ID[m - 1]} ${y}`;
}

function statusOf(event: BookingEvent, today: Date) {
  if (event.status === "dibatalkan") return "Dibatalkan";
  const [y, m, d] = event.date.split("-").map(Number);
  const day = new Date(y, m - 1, d);
  day.setHours(0, 0, 0, 0);
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  return day < now ? "Selesai" : "Terjadwal";
}

export function BookingHistoryView({ events, onEventClick, currentDate }: Props) {
  const today = new Date();
  const rows = [...events].sort(
    (a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime)
  );
  const completed = rows.filter((e) => statusOf(e, today) === "Selesai").length;
  const scheduled = rows.filter((e) => statusOf(e, today) === "Terjadwal").length;
  const cancelled = rows.filter((e) => statusOf(e, today) === "Dibatalkan").length;

  const stats = [
    { label: "Total peminjaman", value: rows.length, cls: "text-gray-950 dark:text-[#F8FAFC]" },
    { label: "Selesai", value: completed, cls: "text-emerald-600 dark:text-emerald-400" },
    { label: "Dibatalkan", value: cancelled, cls: "text-red-600 dark:text-red-400" },
    { label: "Terjadwal", value: scheduled, cls: "text-blue-600 dark:text-[#93C5FD]" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#090D16] p-4 sm:p-6 space-y-6 transition-colors">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-[#F8FAFC]">Histori peminjaman</h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-[#94A3B8]">
          Daftar peminjaman pada simulasi SelasarSpace.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#111827] p-4 transition-colors"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-[#94A3B8]">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#111827] transition-colors">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1E293B] bg-gray-50/60 dark:bg-[#0F172A] px-4 py-3">
          <span className="text-xs font-semibold text-gray-900 dark:text-[#F8FAFC]">
            Daftar peminjaman
          </span>
          <span className="text-xs text-gray-500 dark:text-[#94A3B8]">
            {MONTH_NAMES_ID[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500 dark:text-[#64748B]">
            Belum ada data peminjaman.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-white dark:bg-[#111827] text-gray-500 dark:text-[#94A3B8]">
                <tr>
                  {["Tanggal kegiatan", "Nama kegiatan", "Penyelenggara", "Penanggung jawab", "Waktu", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="border-b border-gray-100 dark:border-[#1E293B] px-4 py-3 font-medium"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1E293B]">
                {rows.map((event) => {
                  const status = statusOf(event, today);
                  return (
                    <tr
                      key={event.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1E293B]/60 transition-colors"
                      onClick={() => onEventClick(event)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-[#CBD5E1]">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-[#F8FAFC]">
                        {event.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#94A3B8]">
                        {event.organizationName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#94A3B8]">
                        {event.personInCharge || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-[#94A3B8]">
                        {event.startTime.replace(".", ":")}–{event.endTime.replace(".", ":")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                            status === "Selesai"
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : status === "Dibatalkan"
                              ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                              : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-[#93C5FD] border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 dark:text-[#64748B]">
        Riwayat ini menggunakan data lokal frontend dan tidak tersimpan setelah halaman dimuat ulang.
      </p>
    </div>
  );
}
