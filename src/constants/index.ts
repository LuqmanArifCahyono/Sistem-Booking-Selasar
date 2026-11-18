import { BookingEvent, GuidanceItem, Organization, UserProfile } from "@/types";

export const DEFAULT_ORGANIZATIONS: Organization[] = [
  {
    id: "himasifo",
    name: "Himasifo",
    colorHex: "#2563EB",
    badgeClass: "bg-blue-600 text-white",
    textClass: "text-blue-700",
    borderClass: "border-blue-500",
    checked: true,
  },
  {
    id: "bem-fisip",
    name: "BEM FISIP",
    colorHex: "#9333EA",
    badgeClass: "bg-purple-600 text-white",
    textClass: "text-purple-700",
    borderClass: "border-purple-500",
    checked: true,
  },
  {
    id: "himakom",
    name: "Himakom",
    colorHex: "#059669",
    badgeClass: "bg-emerald-600 text-white",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-500",
    checked: true,
  },
  {
    id: "himatifa",
    name: "Himatifa",
    colorHex: "#D97706",
    badgeClass: "bg-amber-500 text-white",
    textClass: "text-amber-800",
    borderClass: "border-amber-500",
    checked: true,
  },
];

export const DUMMY_BOOKING_EVENTS: BookingEvent[] = [
  {
    id: "evt-1",
    title: "Rapat Kerja",
    organizationId: "himasifo",
    organizationName: "Himasifo",
    date: "2026-11-09",
    startTime: "09.00",
    endTime: "11.00",
    bgClass: "bg-blue-100/90 hover:bg-blue-200/90 dark:bg-blue-950/60 dark:hover:bg-blue-900/60",
    textClass: "text-blue-950 dark:text-blue-100",
    subtextClass: "text-blue-800 dark:text-blue-300",
    borderClass: "border-blue-300 dark:border-blue-800",
  },
  {
    id: "evt-2",
    title: "Rabes BEM",
    organizationId: "bem-fisip",
    organizationName: "BEM FISIP",
    date: "2026-11-10",
    startTime: "13.00",
    endTime: "15.00",
    bgClass: "bg-purple-100/90 hover:bg-purple-200/90 dark:bg-purple-950/60 dark:hover:bg-purple-900/60",
    textClass: "text-purple-950 dark:text-purple-100",
    subtextClass: "text-purple-800 dark:text-purple-300",
    borderClass: "border-purple-300 dark:border-purple-800",
  },
  {
    id: "evt-3",
    title: "Welcome Party",
    organizationId: "himakom",
    organizationName: "Himakom",
    date: "2026-11-12",
    startTime: "10.00",
    endTime: "12.00",
    bgClass: "bg-emerald-100/90 hover:bg-emerald-200/90 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60",
    textClass: "text-emerald-950 dark:text-emerald-100",
    subtextClass: "text-emerald-800 dark:text-emerald-300",
    borderClass: "border-emerald-300 dark:border-emerald-800",
  },
  {
    id: "evt-4",
    title: "Rapat Fiksasi",
    organizationId: "himatifa",
    organizationName: "Himatifa",
    date: "2026-11-13",
    startTime: "15.00",
    endTime: "17.00",
    bgClass: "bg-amber-100/90 hover:bg-amber-200/90 dark:bg-amber-950/60 dark:hover:bg-amber-900/60",
    textClass: "text-amber-950 dark:text-amber-100",
    subtextClass: "text-amber-800 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-800",
  },
];

export const GUIDANCE_ITEMS: GuidanceItem[] = [
  {
    number: "01",
    title: "Ajukan lebih awal",
    description: "Minimal 2 hari sebelum kegiatan.",
  },
  {
    number: "02",
    title: "Lengkapi informasi",
    description: "Isi data acara dan penanggung jawab.",
  },
  {
    number: "03",
    title: "Jaga ruang bersama",
    description: "Kembalikan ruang dalam kondisi rapi.",
  },
];

export const CURRENT_USER: UserProfile = {
  name: "Jonathan",
  role: "Layanan kampus",
};

export const MONTH_NAMES_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const DAY_NAMES_SHORT = ["S", "S", "R", "K", "J", "S", "M"];
export const DAY_NAMES_FULL = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
