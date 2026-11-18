// [FRONTEND CHANGE START: Data Dummy & Konstanta Panel Sub-Admin - Milestone 1]
import {
  AdminActivityLogItem,
  AdminOrganizationFilter,
  AdminStats,
  AdminTimelineSlot,
  SlotStatus,
} from "@/types/admin";

export const INITIAL_ADMIN_STATS: AdminStats = {
  slotKosong: 1,
  slotKosongSub: "Tersedia pada 12/11/2026",
  jadwalTerisi: 4,
  jadwalTerisiSub: "Himasifo, Himakom, BEM FISIP, Himatifa",
  pembatalanPeriode: 2,
  pembatalanSub: "Jadwal dilepas mandiri oleh user",
  totalPemakaian: 10,
  totalPemakaianUnit: "Sesi",
  totalPemakaianSub: "November 2026",
};

export const INITIAL_TIMELINE_SLOTS: AdminTimelineSlot[] = [
  {
    id: "slot-1",
    timeSlot: "08.00 - 10.00 WIB",
    rawTime: "08:00 - 10:00",
    status: "dipesan",
    eventName: "Rapat Kerja & Evaluasi Program SI",
    organizationId: "himasifo",
    organizationName: "Himasifo",
    personInCharge: "Rayhan Fauzan",
    contactPJ: "0812-3456-7890",
    purpose: "Rapat kerja evaluasi berkala program kerja divisi akademik dan kurikulum Sistem Informasi.",
    date: "12/11/2026",
  },
  {
    id: "slot-2",
    timeSlot: "10.00 - 12.00 WIB",
    rawTime: "10:00 - 12:00",
    status: "dipesan",
    eventName: "Welcome Party Pengurus Muda",
    organizationId: "himakom",
    organizationName: "Himakom",
    personInCharge: "Dimas Prakoso",
    contactPJ: "0813-9876-5432",
    purpose: "Penyambutan dan orientasi internal pengurus muda Himpunan Mahasiswa Ilmu Komputer.",
    date: "12/11/2026",
  },
  {
    id: "slot-3",
    timeSlot: "12.00 - 14.00 WIB",
    rawTime: "12:00 - 14:00",
    status: "bentrok",
    eventName: "Waktu bentrok",
    organizationId: "bem-fisip",
    organizationName: "Rabes BEM Lintas Kementerian",
    personInCharge: "Nabila Putri",
    contactPJ: "0857-1122-3344",
    purpose: "Jadwal terindikasi tumpang tindih dengan persiapan kegiatan internal fakultas.",
    date: "12/11/2026",
  },
  {
    id: "slot-4",
    timeSlot: "13.00 - 15.00 WIB",
    rawTime: "13:00 - 15:00",
    status: "dipesan",
    eventName: "Rabes BEM Lintas Kementerian",
    organizationId: "bem-fisip",
    organizationName: "BEM FISIP",
    personInCharge: "Nabila Putri",
    contactPJ: "0857-1122-3344",
    purpose: "Rapat besar koordinasi program kerja lintas kementerian BEM FISIP semester ganjil.",
    date: "12/11/2026",
  },
  {
    id: "slot-5",
    timeSlot: "15.00 - 17.00 WIB",
    rawTime: "15:00 - 17:00",
    status: "dipesan",
    eventName: "Rapat Fiksasi Pameran Karya IT",
    organizationId: "himatifa",
    organizationName: "Himatifa",
    personInCharge: "Aulia Rahman",
    contactPJ: "0821-4455-6677",
    purpose: "Fiksasi denah stand, logistik kelistrikan, dan alur pengunjung pameran karya teknologi.",
    date: "12/11/2026",
  },
  {
    id: "slot-6",
    timeSlot: "18.00 - 20.00 WIB",
    rawTime: "18:00 - 20:00",
    status: "tersedia",
    eventName: "Waktu tersedia",
    organizationId: "",
    organizationName: "",
    personInCharge: "",
    contactPJ: "",
    purpose: "Slot waktu malam bebas dan terbuka untuk pengajuan kegiatan ormawa.",
    date: "12/11/2026",
  },
];

export const INITIAL_ACTIVITY_LOGS: AdminActivityLogItem[] = [
  {
    id: "log-1",
    type: "batal",
    organizationId: "himasifo",
    organizationName: "Himasifo",
    personInCharge: "Rayhan Fauzan",
    eventName: "Klinik Koding & Mentoring SI",
    date: "12/11/2026",
    timeRange: "12.00 - 14.00 WIB",
    timestamp: "12/11/2026 • 11:20 WIB",
    slotTag: "Slot Otomatis Dibuka",
    reason: "Perubahan jadwal kuliah pengganti mendadak, sesi mentoring dipindahkan ke laboratorium.",
    cancellationStatus: "Pembatalan Mandiri User",
  },
  {
    id: "log-2",
    type: "booking",
    organizationId: "himatifa",
    organizationName: "Himatifa",
    personInCharge: "Aulia Rahman",
    eventName: "Rapat Fiksasi Pameran Karya IT",
    date: "12/11/2026",
    timeRange: "15.00 - 17.00 WIB",
    timestamp: "11/11/2026 • 11:40 WIB",
    slotTag: "Booking Baru",
  },
  {
    id: "log-3",
    type: "booking",
    organizationId: "bem-fisip",
    organizationName: "BEM FISIP",
    personInCharge: "Nabila Putri",
    eventName: "Rabes BEM Lintas Kementerian",
    date: "12/11/2026",
    timeRange: "13.00 - 15.00 WIB",
    timestamp: "11/11/2026 • 09:15 WIB",
    slotTag: "Booking Baru",
  },
  {
    id: "log-4",
    type: "batal",
    organizationId: "ukm-basket",
    organizationName: "UKM Basket",
    personInCharge: "Kevin Pratama",
    eventName: "Briefing Panitia Sparring",
    date: "11/11/2026",
    timeRange: "15.00 - 17.00 WIB",
    timestamp: "11/11/2026 • 08:45 WIB",
    slotTag: "Slot Otomatis Dibuka",
    reason: "Lapangan utama sudah dapat digunakan sehingga rapat dipindah ke tribun GOR.",
    cancellationStatus: "Pembatalan Mandiri User",
  },
  {
    id: "log-5",
    type: "booking",
    organizationId: "himakom",
    organizationName: "Himakom",
    personInCharge: "Dimas Prakoso",
    eventName: "Welcome Party Pengurus Muda",
    date: "12/11/2026",
    timeRange: "10.00 - 12.00 WIB",
    timestamp: "10/11/2026 • 16:05 WIB",
    slotTag: "Booking Baru",
  },
];

export const INITIAL_ADMIN_ORGANIZATIONS: AdminOrganizationFilter[] = [
  {
    id: "himasifo",
    name: "Himasifo",
    colorHex: "#2563EB",
    dotClass: "bg-blue-600",
    checked: true,
  },
  {
    id: "bem-fisip",
    name: "BEM FISIP",
    colorHex: "#9333EA",
    dotClass: "bg-purple-600",
    checked: true,
  },
  {
    id: "himakom",
    name: "Himakom",
    colorHex: "#059669",
    dotClass: "bg-emerald-600",
    checked: true,
  },
  {
    id: "himatifa",
    name: "Himatifa",
    colorHex: "#D97706",
    dotClass: "bg-amber-500",
    checked: true,
  },
];
// [FRONTEND CHANGE END: Data Dummy & Konstanta Panel Sub-Admin - Milestone 1]

// [FRONTEND CHANGE START: Helper Tanggal & Multi-Date Schedules - Milestone 2]
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

export const DAY_NAMES_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export function formatDateIndonesian(date: Date): string {
  const dayName = DAY_NAMES_ID[date.getDay()];
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${dayName}, ${d}/${m}/${y}`;
}

export function formatDateDMY(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export const MULTI_DATE_SLOTS: Record<string, AdminTimelineSlot[]> = {
  // Skenario Utama (12/11/2026 - sesuai PDF 01 & 02)
  "12/11/2026": INITIAL_TIMELINE_SLOTS,

  // Skenario 11/11/2026 (H-1)
  "11/11/2026": [
    {
      id: "slot-11-1",
      timeSlot: "08.00 - 10.00 WIB",
      rawTime: "08:00 - 10:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: "Slot pagi bebas dan dapat diajukan oleh ormawa.",
      date: "11/11/2026",
    },
    {
      id: "slot-11-2",
      timeSlot: "10.00 - 12.00 WIB",
      rawTime: "10:00 - 12:00",
      status: "dipesan",
      eventName: "Workshop UI/UX Selasar",
      organizationId: "himasifo",
      organizationName: "Himasifo",
      personInCharge: "Rayhan Fauzan",
      contactPJ: "0812-3456-7890",
      purpose: "Workshop interaktif pembuatan wireframe dan prototype sistem aplikasi kampus.",
      date: "11/11/2026",
    },
    {
      id: "slot-11-3",
      timeSlot: "13.00 - 15.00 WIB",
      rawTime: "13:00 - 15:00",
      status: "dipesan",
      eventName: "Koordinasi Sidang Mahasiswa",
      organizationId: "bem-fisip",
      organizationName: "BEM FISIP",
      personInCharge: "Nabila Putri",
      contactPJ: "0857-1122-3344",
      purpose: "Rapat koordinasi teknis persiapan sidang paripurna mahasiswa FISIP.",
      date: "11/11/2026",
    },
    {
      id: "slot-11-4",
      timeSlot: "15.00 - 17.00 WIB",
      rawTime: "15:00 - 17:00",
      status: "tersedia",
      eventName: "Waktu tersedia (Pelepasan Mandiri)",
      organizationId: "",
      organizationName: "UKM Basket (Dilepas)",
      personInCharge: "Kevin Pratama",
      contactPJ: "0899-7788-9900",
      purpose: "Slot terbuka kembali setelah pembatalan mandiri oleh panitia sparring basket.",
      date: "11/11/2026",
    },
    {
      id: "slot-11-5",
      timeSlot: "18.00 - 20.00 WIB",
      rawTime: "18:00 - 20:00",
      status: "dipesan",
      eventName: "Study Club Algoritma Dasar",
      organizationId: "himatifa",
      organizationName: "Himatifa",
      personInCharge: "Aulia Rahman",
      contactPJ: "0821-4455-6677",
      purpose: "Sesi bimbingan belajar algoritma dan pemrograman untuk mahasiswa baru.",
      date: "11/11/2026",
    },
  ],

  // Skenario 13/11/2026 (H+1)
  "13/11/2026": [
    {
      id: "slot-13-1",
      timeSlot: "08.00 - 10.00 WIB",
      rawTime: "08:00 - 10:00",
      status: "dipesan",
      eventName: "Pelatihan Public Speaking & MC",
      organizationId: "himakom",
      organizationName: "Himakom",
      personInCharge: "Dimas Prakoso",
      contactPJ: "0813-9876-5432",
      purpose: "Pelatihan pembawa acara formal untuk acara Dies Natalis.",
      date: "13/11/2026",
    },
    {
      id: "slot-13-2",
      timeSlot: "10.00 - 12.00 WIB",
      rawTime: "10:00 - 12:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: "Slot siang terbuka untuk kegiatan ormawa.",
      date: "13/11/2026",
    },
    {
      id: "slot-13-3",
      timeSlot: "13.00 - 15.00 WIB",
      rawTime: "13:00 - 15:00",
      status: "dipesan",
      eventName: "Mentoring Basis Data Praktis",
      organizationId: "himasifo",
      organizationName: "Himasifo",
      personInCharge: "Rayhan Fauzan",
      contactPJ: "0812-3456-7890",
      purpose: "Tutorial pembuatan schema relational database PostgreSQL.",
      date: "13/11/2026",
    },
    {
      id: "slot-13-4",
      timeSlot: "15.00 - 17.00 WIB",
      rawTime: "15:00 - 17:00",
      status: "dipesan",
      eventName: "Kajian Isu Kebijakan Kampus",
      organizationId: "bem-fisip",
      organizationName: "BEM FISIP",
      personInCharge: "Nabila Putri",
      contactPJ: "0857-1122-3344",
      purpose: "Diskusi meja bundar kementerian advokasi BEM FISIP.",
      date: "13/11/2026",
    },
    {
      id: "slot-13-5",
      timeSlot: "18.00 - 20.00 WIB",
      rawTime: "18:00 - 20:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: "Slot malam bebas untuk kegiatan santai mahasiswa.",
      date: "13/11/2026",
    },
  ],

  // Skenario 01/12/2026 (Awal Desember - persiapan Milestone 5)
  "01/12/2026": [
    {
      id: "slot-12-01-1",
      timeSlot: "08.00 - 10.00 WIB",
      rawTime: "08:00 - 10:00",
      status: "dikunci",
      eventName: "Slot Dikunci (Pemeliharaan Fasilitas)",
      organizationId: "",
      organizationName: "Pengelola Sarpras",
      personInCharge: "Sub-Admin",
      contactPJ: "0811-000-111",
      purpose: "Pemeriksaan instalasi sound system dan kabel selasar awal bulan.",
      date: "01/12/2026",
    },
    {
      id: "slot-12-01-2",
      timeSlot: "10.00 - 12.00 WIB",
      rawTime: "10:00 - 12:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: "Slot dibuka untuk peminjaman ormawa.",
      date: "01/12/2026",
    },
    {
      id: "slot-12-01-3",
      timeSlot: "13.00 - 15.00 WIB",
      rawTime: "13:00 - 15:00",
      status: "dipesan",
      eventName: "Rapat Perencanaan Akhir Tahun",
      organizationId: "himasifo",
      organizationName: "Himasifo",
      personInCharge: "Rayhan Fauzan",
      contactPJ: "0812-3456-7890",
      purpose: "Evaluasi LPJ akhir tahun kepengurusan.",
      date: "01/12/2026",
    },
    {
      id: "slot-12-01-4",
      timeSlot: "15.00 - 17.00 WIB",
      rawTime: "15:00 - 17:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: "Slot sore terbuka.",
      date: "01/12/2026",
    },
    {
      id: "slot-12-01-5",
      timeSlot: "18.00 - 20.00 WIB",
      rawTime: "18:00 - 20:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: "Slot malam terbuka.",
      date: "01/12/2026",
    },
  ],
};

export function getSlotsForDate(dateDMY: string): AdminTimelineSlot[] {
  if (MULTI_DATE_SLOTS[dateDMY]) {
    return MULTI_DATE_SLOTS[dateDMY];
  }

  // Fallback realistis untuk tanggal acak
  const fallbackSlots: AdminTimelineSlot[] = [
    {
      id: `slot-${dateDMY}-1`,
      timeSlot: "08.00 - 10.00 WIB",
      rawTime: "08:00 - 10:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: `Slot pagi tersedia untuk peminjaman pada ${dateDMY}.`,
      date: dateDMY,
    },
    {
      id: `slot-${dateDMY}-2`,
      timeSlot: "10.00 - 12.00 WIB",
      rawTime: "10:00 - 12:00",
      status: "dipesan",
      eventName: "Kegiatan Ormawa Kampus",
      organizationId: "himasifo",
      organizationName: "Himasifo",
      personInCharge: "Rayhan Fauzan",
      contactPJ: "0812-3456-7890",
      purpose: "Pertemuan rutin pengurus ormawa.",
      date: dateDMY,
    },
    {
      id: `slot-${dateDMY}-3`,
      timeSlot: "13.00 - 15.00 WIB",
      rawTime: "13:00 - 15:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: `Slot siang terbuka untuk peminjaman pada ${dateDMY}.`,
      date: dateDMY,
    },
    {
      id: `slot-${dateDMY}-4`,
      timeSlot: "15.00 - 17.00 WIB",
      rawTime: "15:00 - 17:00",
      status: "dipesan",
      eventName: "Diskusi & Workshop Terbuka",
      organizationId: "bem-fisip",
      organizationName: "BEM FISIP",
      personInCharge: "Nabila Putri",
      contactPJ: "0857-1122-3344",
      purpose: "Sesi diskusi dan workshop berkala.",
      date: dateDMY,
    },
    {
      id: `slot-${dateDMY}-5`,
      timeSlot: "18.00 - 20.00 WIB",
      rawTime: "18:00 - 20:00",
      status: "tersedia",
      eventName: "Waktu tersedia",
      organizationId: "",
      organizationName: "",
      personInCharge: "",
      contactPJ: "",
      purpose: `Slot malam terbuka untuk peminjaman pada ${dateDMY}.`,
      date: dateDMY,
    },
  ];
  return fallbackSlots;
}

export function calculateStatsForSlots(
  dateDMY: string,
  slots: AdminTimelineSlot[],
  monthLabel: string = "November 2026"
): AdminStats {
  const slotKosong = slots.filter((s) => s.status === "tersedia").length;
  const bookedSlots = slots.filter((s) => s.status === "dipesan");
  const jadwalTerisi = bookedSlots.length;

  const orgNamesSet = new Set(
    bookedSlots
      .map((s) => s.organizationName)
      .filter((name) => name && name.trim().length > 0)
  );
  const orgNamesList = Array.from(orgNamesSet);
  const jadwalTerisiSub =
    orgNamesList.length > 0
      ? orgNamesList.join(", ")
      : "Belum ada jadwal terisi";

  return {
    slotKosong,
    slotKosongSub: `Tersedia pada ${dateDMY}`,
    jadwalTerisi,
    jadwalTerisiSub,
    pembatalanPeriode: 2,
    pembatalanSub: "Jadwal dilepas mandiri oleh user",
    totalPemakaian: 10,
    totalPemakaianUnit: "Sesi",
    totalPemakaianSub: monthLabel,
  };
}
// [FRONTEND CHANGE END: Helper Tanggal & Multi-Date Schedules - Milestone 2]
