"use client";

import React from "react";
import { BookingEvent } from "@/types";
import { MONTH_NAMES_ID } from "@/constants";

interface Props { events: BookingEvent[]; onEventClick: (event: BookingEvent) => void; currentDate: Date; }
function formatDate(value: string) { const [y,m,d]=value.split("-").map(Number); return `${d} ${MONTH_NAMES_ID[m-1]} ${y}`; }
function statusOf(event: BookingEvent, today: Date) {
  if (event.status === "dibatalkan") return "Dibatalkan";
  const [y,m,d]=event.date.split("-").map(Number);
  const day = new Date(y,m-1,d); day.setHours(0,0,0,0);
  const now = new Date(today); now.setHours(0,0,0,0);
  return day < now ? "Selesai" : "Terjadwal";
}
export function BookingHistoryView({ events, onEventClick, currentDate }: Props) {
  const today = new Date();
  const rows = [...events].sort((a,b)=>b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime));
  const completed = rows.filter(e=>statusOf(e,today)==="Selesai").length;
  const scheduled = rows.filter(e=>statusOf(e,today)==="Terjadwal").length;
  const cancelled = rows.filter(e=>statusOf(e,today)==="Dibatalkan").length;
  const stats = [{label:"Total peminjaman",value:rows.length,cls:"text-gray-950"},{label:"Selesai",value:completed,cls:"text-emerald-600"},{label:"Dibatalkan",value:cancelled,cls:"text-red-600"},{label:"Terjadwal",value:scheduled,cls:"text-blue-600"}];
  return <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 space-y-6">
    <div><h2 className="text-xl font-bold text-gray-950">Histori peminjaman</h2><p className="mt-1 text-xs text-gray-500">Daftar peminjaman pada simulasi SelasarSpace.</p></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(s=><div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-xs font-medium text-gray-500">{s.label}</p><p className={`mt-2 text-2xl font-bold ${s.cls}`}>{s.value}</p></div>)}</div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/60 px-4 py-3"><span className="text-xs font-semibold text-gray-900">Daftar peminjaman</span><span className="text-xs text-gray-500">{MONTH_NAMES_ID[currentDate.getMonth()]} {currentDate.getFullYear()}</span></div>
      {rows.length===0 ? <div className="p-10 text-center text-sm text-gray-500">Belum ada data peminjaman.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="bg-white text-gray-500"><tr>{["Tanggal kegiatan","Nama kegiatan","Penyelenggara","Penanggung jawab","Waktu","Status"].map(h=><th key={h} className="border-b border-gray-100 px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{rows.map(event=>{const status=statusOf(event,today);return <tr key={event.id} className="cursor-pointer hover:bg-gray-50" onClick={()=>onEventClick(event)}><td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatDate(event.date)}</td><td className="px-4 py-3 font-semibold text-gray-900">{event.title}</td><td className="px-4 py-3 text-gray-600">{event.organizationName}</td><td className="px-4 py-3 text-gray-600">{event.personInCharge || "—"}</td><td className="whitespace-nowrap px-4 py-3 text-gray-600">{event.startTime.replace(".",":")}–{event.endTime.replace(".",":")}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${status==="Selesai"?"bg-emerald-50 text-emerald-700":status==="Dibatalkan"?"bg-red-50 text-red-700":"bg-blue-50 text-blue-700"}`}>{status}</span></td></tr>})}</tbody></table></div>}
    </div><p className="text-[11px] text-gray-400">Riwayat ini menggunakan data lokal frontend dan tidak tersimpan setelah halaman dimuat ulang.</p>
  </div>;
}
