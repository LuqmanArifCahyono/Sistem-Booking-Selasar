import { GuidanceItem, UserProfile } from "@/types";

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
