// [FRONTEND CHANGE START: Data Dummy Auth, Jadwal Berorientasi Jam Terisi & Bebas Jadwal Tetap - Milestone 1 Revisi 3]
export interface OccupiedAgenda {
  time: string; // Jam terisi yang dinamis dan bervariasi (misal: "08:30–11:00", "13:00–15:30")
  agendaTitle: string;
  organization: string;
}

export interface DaySchedule {
  dayLabel: string;
  dateFormatted: string;
  occupiedAgendas: OccupiedAgenda[]; // HANYA berisi agenda yang terisi! Tidak menampilkan slot kosong tetap
}

export interface QuickAccount {
  id: string;
  name: string;
  shortName: string;
  identifier: string;
  passwordDemo: string;
}

export const DEFAULT_TODAY_ISO = "2026-11-12";
export const DEFAULT_TOMORROW_ISO = "2026-11-13";

export const INDONESIAN_DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// [FRONTEND CHANGE START: Penambahan 2 Kegiatan Tambahan Simulasi Jadwal Padat - Milestone 1 Revisi 7]
export const LOGIN_SCHEDULE_DATA: Record<"hariIni" | "besok", DaySchedule> = {
  hariIni: {
    dayLabel: "Hari Ini",
    dateFormatted: "Kamis, 12/11/2026",
    occupiedAgendas: [
      {
        time: "08:30–10:30",
        agendaTitle: "BEM FISIP — Registrasi & Pembukaan Diskusi Publik",
        organization: "BEM FISIP",
      },
      {
        time: "11:00–12:30",
        agendaTitle: "Himpunan Akuntansi — Technical Meeting Lomba Poster Bisnis",
        organization: "Himpunan Akuntansi",
      },
      {
        time: "13:00–14:45",
        agendaTitle: "Himasifo — Persiapan Pameran Sistem Informasi",
        organization: "Himasifo",
      },
      {
        time: "15:15–16:45",
        agendaTitle: "Komunitas Robotika — Demo Unit & Kalibrasi Arena Line Follower",
        organization: "Komunitas Robotika",
      },
      {
        time: "17:00–18:00",
        agendaTitle: "UKM Seni Musik — Latihan Akustik & Cek Sound Sore",
        organization: "UKM Seni Musik",
      },
    ],
  },
  besok: {
    dayLabel: "Besok",
    dateFormatted: "Jumat, 13/11/2026",
    occupiedAgendas: [
      {
        time: "09:30–12:00",
        agendaTitle: "Himakom — Pelatihan Web & UI/UX Design Ormawa",
        organization: "Himakom",
      },
      {
        time: "14:00–17:00",
        agendaTitle: "DPM KM — Sidang Pleno Koordinasi Anggaran Kegiatan",
        organization: "DPM KM",
      },
    ],
  },
};
// [FRONTEND CHANGE END: Penambahan 2 Kegiatan Tambahan Simulasi Jadwal Padat - Milestone 1 Revisi 7]

// Variasi realistis kegiatan ormawa untuk berbagai tanggal yang dipilih user (jam fleksibel, jumlah agenda bervariasi)
const DYNAMIC_OCCUPIED_VARIATIONS: OccupiedAgenda[][] = [
  // Variasi 0 (2 Agenda)
  [
    {
      time: "08:45–11:15",
      agendaTitle: "BEM Universitas — Rapat Koordinasi Forum Ormawa Kampus",
      organization: "BEM Universitas",
    },
    {
      time: "13:30–16:00",
      agendaTitle: "UKM Teater — Latihan Olah Gerak & Vokal Mahasiswa",
      organization: "UKM Teater",
    },
  ],
  // Variasi 1 (2 Agenda)
  [
    {
      time: "10:00–12:30",
      agendaTitle: "Himpunan Akuntansi — Technical Meeting Seminar Bisnis Nasional",
      organization: "Himpunan Akuntansi",
    },
    {
      time: "14:00–17:00",
      agendaTitle: "UKM Fotografi — Workshop Pencahayaan & Kurasi Pameran Karya",
      organization: "UKM Fotografi",
    },
  ],
  // Variasi 2 (1 Agenda)
  [
    {
      time: "13:00–16:30",
      agendaTitle: "Pramuka Racana — Pembekalan Gladi Kader & Kemah Bakti",
      organization: "Pramuka Racana",
    },
  ],
  // Variasi 3 (0 Agenda — Hari Kosong Penuh / Selasar Bebas untuk Simulasi UI Khusus Kosong)
  [],
  // Variasi 4 (3 Agenda)
  [
    {
      time: "08:30–10:30",
      agendaTitle: "Himakom — Workshop Keamanan Jaringan & Ethical Hacking",
      organization: "Himakom",
    },
    {
      time: "11:00–13:30",
      agendaTitle: "Himasifo — Mentoring Pemrograman Algoritma Ormawa",
      organization: "Himasifo",
    },
    {
      time: "14:30–17:00",
      agendaTitle: "Komunitas Robotika — Riset Mekanik & Perakitan Line Follower",
      organization: "Komunitas Robotika",
    },
  ],
  // Variasi 5 (2 Agenda)
  [
    {
      time: "09:00–12:00",
      agendaTitle: "DPM KM — Sidang Pleno Koordinasi Anggaran Kegiatan Ormawa",
      organization: "DPM KM",
    },
    {
      time: "13:30–16:30",
      agendaTitle: "UKM Seni & Tari — Latihan Tari Saman & Koreografi Panggung",
      organization: "UKM Seni & Tari",
    },
  ],
  // Variasi 6 (1 Agenda)
  [
    {
      time: "14:00–17:30",
      agendaTitle: "Festival Seni Kampus — Rehearsal Tata Suara Pengisi Acara",
      organization: "Festival Seni Kampus",
    },
  ],
  // Variasi 7 (4 Agenda — Jadwal Padat / Memanjang ke Bawah)
  [
    {
      time: "08:00–10:00",
      agendaTitle: "BEM FKIP — Diskusi Kebangsaan & Deklarasi Pendidikan Inklusif",
      organization: "BEM FKIP",
    },
    {
      time: "10:30–12:30",
      agendaTitle: "Himasifo — Showcase Karya Aplikasi & Demo Prototipe Ormawa",
      organization: "Himasifo",
    },
    {
      time: "13:00–15:30",
      agendaTitle: "UKM Paduan Suara — Gladi Resik Festival Musik Harmoni Kampus",
      organization: "UKM Paduan Suara",
    },
    {
      time: "16:00–18:00",
      agendaTitle: "Komunitas Debat — Simulasi Parlemen Mahasiswa Tingkat Universitas",
      organization: "Komunitas Debat",
    },
  ],
];

/**
 * Mengambil jadwal selasar berdasarkan tanggal ISO (YYYY-MM-DD).
 * Hanya mengembalikan jam-jam yang TERISI agar tidak terkesan ada penjadwalan tetap.
 * Jika tidak ada kegiatan, mengembalikan occupiedAgendas kosong agar ditampilkan UI Khusus Bebas Selasar.
 */
export function getScheduleByDate(isoDate: string): DaySchedule {
  if (isoDate === DEFAULT_TODAY_ISO) {
    return LOGIN_SCHEDULE_DATA.hariIni;
  }
  if (isoDate === DEFAULT_TOMORROW_ISO) {
    return LOGIN_SCHEDULE_DATA.besok;
  }

  const parts = isoDate.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const dateObj = new Date(year, month - 1, day);
      const dayIndex = dateObj.getDay();
      const dayName = INDONESIAN_DAY_NAMES[dayIndex] || "Hari";
      const dateFormatted = `${dayName}, ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

      // Variasi dinamis yang bervariasi per tanggal yang dipilih user
      const variationIndex = Math.abs(day * 3 + month * 5 + year) % DYNAMIC_OCCUPIED_VARIATIONS.length;
      const occupiedAgendas = DYNAMIC_OCCUPIED_VARIATIONS[variationIndex];

      return {
        dayLabel: dayName,
        dateFormatted,
        occupiedAgendas,
      };
    }
  }

  return LOGIN_SCHEDULE_DATA.hariIni;
}

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
      "Pantau jam terisi pada kalender selasar kampus secara langsung tanpa birokrasi berbelit.",
  },
  {
    number: "02",
    title: "Booking mandiri langsung terkunci otomatis",
    description:
      "Kunci jam kegiatan organisasi dengan kepastian status tanpa risiko tumpang tindih agenda.",
  },
  {
    number: "03",
    title: "Kelola dan batalkan agenda organisasi dengan mudah",
    description:
      "Pengurus dapat memantau, mengubah, atau membatalkan reservasi tempat langsung dari dasbor resmi.",
  },
];
// [FRONTEND CHANGE END: Data Dummy Auth, Jadwal Berorientasi Jam Terisi & Bebas Jadwal Tetap - Milestone 1 Revisi 3]
