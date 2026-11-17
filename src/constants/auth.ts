// [FRONTEND CHANGE START: Inisialisasi Data Dummy Auth & Jadwal Login - Milestone 1]
export interface ScheduleSlot {
  time: string;
  status: "terisi" | "kosong";
  agendaTitle: string;
  organization?: string;
}

export interface DaySchedule {
  dayLabel: string;
  dateFormatted: string;
  slots: ScheduleSlot[];
}

export interface QuickAccount {
  id: string;
  name: string;
  shortName: string;
  identifier: string;
  passwordDemo: string;
}

export const LOGIN_SCHEDULE_DATA: Record<"hariIni" | "besok", DaySchedule> = {
  hariIni: {
    dayLabel: "Hari Ini",
    dateFormatted: "Kamis, 12/11/2026",
    slots: [
      {
        time: "08:00–10:00",
        status: "terisi",
        agendaTitle: "BEM FISIP — Registrasi & Pembukaan Diskusi Publik",
        organization: "BEM FISIP",
      },
      {
        time: "10:00–12:00",
        status: "kosong",
        agendaTitle: "Slot jam kosong · Tersedia untuk diajukan",
      },
      {
        time: "12:00–14:00",
        status: "terisi",
        agendaTitle: "Himasifo — Persiapan Pameran Sistem Informasi",
        organization: "Himasifo",
      },
      {
        time: "14:00–16:00",
        status: "terisi",
        agendaTitle: "Komunitas Robotika — Demo Unit & Kalibrasi Arena Line Follower",
        organization: "Komunitas Robotika",
      },
      {
        time: "16:00–18:00",
        status: "kosong",
        agendaTitle: "Slot jam kosong · Tersedia untuk diajukan",
      },
    ],
  },
  besok: {
    dayLabel: "Besok",
    dateFormatted: "Jumat, 13/11/2026",
    slots: [
      {
        time: "08:00–10:00",
        status: "terisi",
        agendaTitle: "BEM FISIP — Registrasi & Pembukaan Diskusi Publik",
        organization: "BEM FISIP",
      },
      {
        time: "10:00–12:00",
        status: "kosong",
        agendaTitle: "Slot jam kosong · Tersedia untuk diajukan",
      },
      {
        time: "12:00–14:00",
        status: "terisi",
        agendaTitle: "Himasifo — Persiapan Pameran Sistem Informasi",
        organization: "Himasifo",
      },
      {
        time: "14:00–16:00",
        status: "terisi",
        agendaTitle: "Komunitas Robotika — Demo Unit & Kalibrasi Arena Line Follower",
        organization: "Komunitas Robotika",
      },
      {
        time: "16:00–18:00",
        status: "kosong",
        agendaTitle: "Slot jam kosong · Tersedia untuk diajukan",
      },
    ],
  },
};

export const QUICK_ACCOUNTS: QuickAccount[] = [
  {
    id: "robotika",
    name: "Komunitas Robotika",
    shortName: "Robotika",
    identifier: "robotika_upn@student.kampus.ac.id",
    passwordDemo: "RobotikaUPN#2026",
  },
  {
    id: "himasifo",
    name: "Himasifo",
    shortName: "Himasifo",
    identifier: "himasifo@student.kampus.ac.id",
    passwordDemo: "HimasifoKabinet#26",
  },
  {
    id: "bem-fisip",
    name: "BEM FISIP",
    shortName: "BEM FISIP",
    identifier: "bem_fisip@student.kampus.ac.id",
    passwordDemo: "BemFisipSolid#2026",
  },
];

export const LOGIN_FEATURE_POINTS = [
  {
    number: "01",
    title: "Cek ketersediaan slot selasar secara real-time",
    description:
      "Pantau jam kosong dan terisi pada kalender selasar kampus secara langsung tanpa birokrasi berbelit.",
  },
  {
    number: "02",
    title: "Booking mandiri langsung terkunci otomatis",
    description:
      "Kunci slot jadwal kegiatan organisasi dengan kepastian status tanpa risiko tumpang tindih agenda.",
  },
  {
    number: "03",
    title: "Kelola dan batalkan agenda organisasi dengan mudah",
    description:
      "Pengurus dapat memantau, mengubah, atau membatalkan reservasi tempat langsung dari dasbor resmi.",
  },
];
// [FRONTEND CHANGE END: Inisialisasi Data Dummy Auth & Jadwal Login - Milestone 1]
