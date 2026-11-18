# SelasarSpace — Frontend Changelog

Dokumentasi riwayat pengembangan antarmuka (frontend only) untuk sistem peminjaman tempat SelasarSpace.

---

## [Milestone 1 — Penambahan 2 Kegiatan Tambahan Simulasi Visual Padat]
**Tanggal:** 18 November 2026  
**Referensi:** Penambahan 2 kegiatan pemakaian selasar pada jadwal default "Hari Ini" untuk menguji tampilan visual timeline bar dan pemanjangan daftar agenda ke bawah:
1. **Penambahan Kegiatan pada Jadwal Hari Ini:**
   - Menambahkan 2 kegiatan ormawa baru sehingga total menjadi 5 kegiatan terdistribusi proporsional antara 08:00–18:00:
     - `08:30–10:30`: BEM FISIP — Registrasi & Pembukaan Diskusi Publik
     - `11:00–12:30`: **Himpunan Akuntansi — Technical Meeting Lomba Poster Bisnis (Baru)**
     - `13:00–14:45`: Himasifo — Persiapan Pameran Sistem Informasi
     - `15:15–16:45`: Komunitas Robotika — Demo Unit & Kalibrasi Arena Line Follower
     - `17:00–18:00`: **UKM Seni Musik — Latihan Akustik & Cek Sound Sore (Baru)**
2. **Hasil Visual Dinamis:**
   - **Quick Stat Pills:** Otomatis memperbarui metrik menjadi `5 Kegiatan` aktif, `8 Jam Terpakai` (dari 10 jam operasional), dan merekomendasikan slot bebas ideal pada jeda `09:30–10:00` atau `11:45–12:15`.
   - **Visual Timeline Bar:** Menampilkan 5 balok amber terisi secara proporsional di sepanjang track hijau dengan tooltip interaktif.
   - **Daftar Agenda Borderless:** Memanjang ke bawah secara mulus dan rapi dengan 5 baris agenda berbadge kuning "Terisi", membuktikan tampilan tetap bersih dan elegan tanpa kotak atau batasan tinggi kaku.

---

## [Milestone 1 — Visual Timeline Bar & Ringkasan Cepat Ketersediaan]
**Tanggal:** 18 November 2026  
**Referensi:** Penambahan fitur visual interaktif pada kartu pratinjau selasar (card kiri) untuk meningkatkan daya tarik dan kepraktisan informasi:
1. **Ringkasan Cepat Ketersediaan (Quick Availability Stat):**
   - Menambahkan 3 widget pill ringkas dan modern di bawah pemilihan tanggal:
     - **Agenda Aktif:** Menampilkan jumlah kegiatan terjadwal hari ini (misal: `3 Kegiatan` atau `0 Kegiatan`).
     - **Waktu Terpakai:** Menghitung total durasi jam terisi dari 10 jam operasional (misal: `7 Jam` atau `0 Jam`) dengan aksen warna amber/kuning `#FE9A00`.
     - **Slot Bebas Ideal:** Menghitung gap waktu bebas terpanjang di antara 08:00–18:00 secara otomatis (misal: `11:00–12:30 (1.5 Jam bebas)` atau `Sepanjang Hari (10 Jam Bebas)`).
2. **Visual Timeline Bar (Mini Strip Waktu 08:00 – 18:00):**
   - Menambahkan bar track horizontal visual yang memetakan jam operasional selasar (08:00 s.d. 18:00).
   - Latar belakang track menggunakan warna hijau emerald `#00BC7D` (menandakan jam bebas) yang dilengkapi garis grid jam halus.
   - Blok waktu terisi diposisikan secara proporsional menggunakan warna kuning/amber `#FE9A00` dengan tooltip interaktif saat diarahkan kursor (*hover*).
   - Dilengkapi penanda jam (`08:00`, `12:00`, `18:00`) dan legenda visual ringkas (*Waktu Bebas* vs *Terisi*).
3. **Penyelarasan Header Daftar Rincian Kegiatan:**
   - Ditambahkan label pemisah halus `"Daftar Rincian Kegiatan: [N] slot terisi"` di atas daftar kegiatan borderless agar alur baca informasi dari visual makro (timeline bar) ke rincian mikro (nama kegiatan) terasa alami dan nyaman.

---

## [Milestone 1 — Warna Kuning Penanda Terisi, Borderless Agenda & Mode Terang Default]
**Tanggal:** 18 November 2026  
**Referensi:** Instruksi revisi pengguna untuk estetika penanda terisi, penghapusan border/kotak agenda, dan penentuan mode terang sebagai default:
1. **Mempertahankan Warna Kuning Penanda "Terisi" di Semua Tema:**
   - Badge status "Terisi" pada daftar agenda dipulihkan dan dipertahankan menggunakan palet amber/kuning hangat (`bg-[#FE9A00]/10 dark:bg-[#FE9A00]/15`, `border-[#FE9A00]/30`, dan `text-[#BB4D00] dark:text-[#FE9A00]`) lengkap dengan indikator dot kuning bulat (`bg-[#FE9A00]`).
   - Warna kuning ini memberikan diferensiasi visual yang cepat dan jelas bagi mahasiswa/ormawa untuk mengenali jam-jam yang sudah terisi.
2. **Penghapusan Border / Kotak Pembungkus Agenda (Tampilan Clean & Borderless):**
   - Border kotak pembungkus (`rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]`) pada setiap baris agenda telah dihapus secara menyeluruh di semua mode (Light dan Dark Mode).
   - Tampilan agenda kini berupa daftar baris borderless yang bersih, lapang, dan elegan dengan transisi hover lembut (`hover:bg-[#F1F5F9]/70 dark:hover:bg-[#1E293B]/40`).
   - Chip `Jam Terisi:` berbingkai kotak yang redundan di atas daftar agenda ditiadakan agar informasi terpusat langsung pada daftar agenda yang rapi.
   - Daftar agenda kini memanjang ke bawah secara alami dan dinamis (`space-y-1 my-2`) mengikuti kepadatan agenda pada tanggal tersebut (termasuk variasi jadwal padat hingga 4 agenda kegiatan) tanpa pemotongan tinggi atau scrollbar artifisial.
3. **Mode Terang (Light Mode) Sebagai Mode Utama Saat Akses Pertama:**
   - Pada [ThemeToggle.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/ui/ThemeToggle.tsx) dan [layout.tsx](file:///d:/BDL/System-Booking-Selasar/src/app/layout.tsx), Mode Terang (Light Mode) ditetapkan sebagai mode utama default ketika pengguna pertama kali membuka aplikasi.
   - Dihilangkan mekanisme fallback otomatis ke mode gelap OS (`prefers-color-scheme: dark`) sehingga pengguna baru selalu disajikan tampilan Light Mode yang segar, kecuali jika pengguna secara eksplisit telah memilih Mode Gelap melalui tombol sakelar tema di header.

---

## [Milestone 1 — Warna Biru Soft Dark Mode & Penghapusan Warna Kotak Agenda]
**Tanggal:** 18 November 2026  
**Referensi:** Instruksi revisi pengguna untuk estetika tema gelap dan penyederhanaan kotak agenda:
1. **Penyesuaian Warna Biru di Mode Gelap Menjadi Lebih Soft (Kecuali Tombol):**
   - Seluruh elemen aksen non-tombol pada Dark Mode (kategori eyebrow, teks aktif tab Hari Ini/Besok, nomor kartu 01–03, border aksen bawah, chip isi cepat akun, ikon, teks tautan navigasi, dan logo header) diubah menggunakan palet biru soft `#93C5FD` (Tailwind blue-300) dengan saturasi lembut dan elegan di atas latar gelap.
   - Tombol aksi utama pendaftaran dan login tetap mempertahankan warna biru solid `#2563EB` yang tegas dan memiliki kontras tinggi.
2. **Penghapusan Warna Kotak Agenda di Semua Theme:**
   - Pada [LoginSchedulePreview.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/LoginSchedulePreview.tsx), seluruh warna aksen pada kotak agenda kegiatan (seperti `08:30–11:00 BEM FISIP — Registrasi & Pembukaan Diskusi Publik` dan agenda lainnya) telah dihapus di seluruh tema (Light maupun Dark Mode).
   - Kotak agenda kini menggunakan background transparan netral (`bg-transparent`) dengan teks waktu dan nama agenda netral (`text-[#0F172B] dark:text-[#F8FAFC]` dan `text-[#314158] dark:text-[#CBD5E1]`), ikon jam netral abu-abu, serta badge "Terisi" dengan border netral tanpa warna oranye/merah.
   - Chip `Jam Terisi:` di atasnya juga dinetralkan sehingga tampilan pratinjau menjadi sangat bersih, tenang, dan profesional.

---

## [Milestone 1 — Jadwal Jam Terisi Dinamis, UI Bebas Selasar & Dukungan Dark Mode]
**Tanggal:** 18 November 2026  
**Referensi:** Penyesuaian tampilan pratinjau ketersediaan selasar dan penambahan fitur Dark Mode:
1. **Penghapusan Penjadwalan Tetap & Hanya Menampilkan Jam Terisi:**
   - Grid 5 kotak kaku (08:00–10:00, 10:00–12:00, dst.) dan baris "Slot jam kosong" telah dihapus secara menyeluruh.
   - Sistem kini murni berfokus menampilkan **jam-jam yang sedang terisi** secara fleksibel dan realistis (misal: 08:30–11:00, 13:00–15:30) melalui chip waktu terisi dan kartu agenda nyata ormawa.
2. **UI Baru Pengganti Bagian Kosong (Waktu Bebas & Empty State):**
   - **Kondisi Ada Kegiatan:** Ditampilkan banner informasi hijau `#00BC7D` yang menjelaskan bahwa seluruh waktu di luar jam terisi berstatus kosong dan bebas diajukan oleh ormawa.
   - **Kondisi Tidak Ada Kegiatan (Hari Bebas):** Ditampilkan UI khusus *Empty State* ("Selasar Kosong Sepanjang Hari") dengan ikon centang hijau, status 100% Tersedia, dan deskripsi ramah ormawa.
3. **Fitur Pengalih Tema Dark Mode (Light/Dark Switcher):**
   - Dibuat komponen [ThemeToggle.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/ui/ThemeToggle.tsx) pada sudut kanan atas header dengan ikon Sun/Moon yang mendukung persistensi `localStorage` dan preferensi sistem operasi (`prefers-color-scheme`).
   - Dikonfigurasi `@custom-variant dark` pada Tailwind v4 serta kelas gaya tema gelap di seluruh halaman Login, Register, Modal Lupa Sandi, dan Kartu Pratinjau.

---

## [Milestone 1 — Perbaikan Bug Area Klik Tanggal & Dinamisasi Status Slot Ketersediaan]
**Tanggal:** 18 November 2026  
**Referensi:** Penanganan bug area klik tanggal dan pembaruan status slot ketersediaan selasar secara dinamis saat tanggal dipilih:
1. **Perbaikan Area Klik Tombol Tanggal (100% Hit Target):**
   - Struktur komponen tanggal di [LoginSchedulePreview.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/LoginSchedulePreview.tsx) dirombak total: input tanggal native kini diletakkan di latar belakang dengan kontrol terprogram via `showPicker()`, sedangkan elemen visual `div[role="button"]` menangkap event klik di seluruh bidang tombol (termasuk ikon, teks, dan chevron).
   - Pengguna kini dapat mengklik bagian mana saja di dalam tombol tanggal secara bebas dan instan tanpa harus mencari letak ikon indikator tertentu.
2. **Dinamisasi Status Ketersediaan Sesuai Tanggal Terpilih:**
   - Pada [auth.ts](file:///d:/BDL/System-Booking-Selasar/src/constants/auth.ts), `getScheduleByDate()` diperbarui dengan algoritma deterministik multi-variasi kegiatan ormawa (BEM, Himaprodi, UKM, DPM) yang menjamin status slot ketersediaan (Terisi / Kosong) berubah secara nyata dan konsisten untuk setiap tanggal yang berbeda.
   - Pada [LoginSchedulePreview.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/LoginSchedulePreview.tsx), key rendering pada *quick slot strip* dan *agenda list* kini diikat dengan kombinasi `selectedDateIso` dan status slot, memastikan React melakukan *re-render* visual secara instan saat tanggal berganti.

---

## [Milestone 1 — Revisi Pemilihan Tanggal Bebas & Sinkronisasi Jadwal Hari Ini / Besok]
**Tanggal:** 18 November 2026  
**Referensi:** Instruksi revisi pengguna untuk ketersediaan jadwal selasar pada halaman Login:
1. User dapat bebas memilih tanggal berapa saja melalui picker tanggal interaktif pada baris "Jadwal Tanggal" untuk memeriksa ketersediaan slot selasar.
2. Tab "Hari Ini" dan "Besok" kini menampilkan status slot ketersediaan selasar yang berbeda secara dinamis dan realistis.

### Ringkasan Penyesuaian:
1. **Fitur Pemilihan Tanggal Bebas (Date Picker Interaktif):**
   - Pada [LoginSchedulePreview.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/LoginSchedulePreview.tsx), badge tanggal pada baris "Jadwal Tanggal" ditingkatkan menjadi komponen pemilih tanggal interaktif dengan ikon kalender, format `NamaHari, DD/MM/YYYY`, ikon chevron dropdown, dan input kalender native terintegrasi.
   - User dapat mengklik badge tanggal tersebut kapan saja untuk memunculkan kalender dan memilih tanggal apa pun sesuai kebutuhan.
2. **Dukungan Data Ketersediaan Dinamis Hari Ini vs Besok vs Tanggal Bebas:**
   - Pada [auth.ts](file:///d:/BDL/System-Booking-Selasar/src/constants/auth.ts), jadwal untuk "Besok" diperbarui agar memiliki status yang berbeda dari "Hari Ini":
     - **Hari Ini (Kamis, 12/11/2026):** Terisi (08:00–10:00), Kosong (10:00–12:00), Terisi (12:00–14:00), Terisi (14:00–16:00), Kosong (16:00–18:00).
     - **Besok (Jumat, 13/11/2026):** Kosong (08:00–10:00), Terisi (10:00–12:00: Himakom), Kosong (12:00–14:00), Terisi (14:00–16:00: DPM KM), Terisi (16:00–18:00: UKM Seni & Tari).
   - Ditambahkan fungsi helper `getScheduleByDate(isoDate)` yang secara otomatis memformat nama hari bahasa Indonesia dan menyediakan pola ketersediaan slot ormawa yang realistis untuk setiap hari dalam seminggu.
3. **Penyelarasan Tab dan Indikator Status:**
   - Tombol "Hari Ini" dan "Besok" tersinkronisasi otomatis dengan tanggal yang dipilih.
   - Keterangan subtitle di bawah judul pratinjau menyesuaikan secara real-time ("hari ini", "besok", atau nama hari/tanggal custom yang dipilih).

---

## [Milestone 5 — Revisi Panel Kiri Statis & Tetap]
**Tanggal:** 18 November 2026  
**Referensi:** Penyesuaian panel edukasi registrasi sebelah kiri agar tetap stabil dan konsisten menampilkan 3 kartu panduan tanpa berubah menjadi centang atau mengikuti pengisian form.

### Ringkasan Penyesuaian:
1. **Panel Informasi Kiri Bersifat Statis & Tetap:**
   - Pada [SignUpInfoPanel.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/SignUpInfoPanel.tsx), seluruh ketergantungan terhadap state dinamis (`activeStep` & `completedSteps`) telah dilepas.
   - Panel kiri kini berfungsi sebagai panel edukasi permanen yang menampilkan:
     - Header "Portal Registrasi Mandiri" & indikator "• Kalender Aktif" hijau `#00BC7D`.
     - 3 kartu fitur panduan utama (01 Lengkapi Identitas & PJ, 02 Pantau Slot Real-time, 03 Booking & Kelola Mandiri) dengan nomor shape `w-8 h-8` tebal `text-sm font-bold`, judul, deskripsi jelas, dan garis bawah aksen biru `#2563EB`.
     - Tampilan kartu tidak lagi berubah menjadi centang atau terkunci, sehingga memberikan tampilan yang stabil dan elegan sesuai desain referensi PDF.
2. **Penyederhanaan Form & Kontainer:**
   - [SignUpForm.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/SignUpForm.tsx) dan [RegisterContent.tsx](file:///d:/BDL/System-Booking-Selasar/src/components/auth/RegisterContent.tsx) kini murni fokus pada data formulir, validasi lokal, tombol back, dan simulasi submit.

---

## [Milestone 5, 6, 7 — Revisi Validasi Step, Tombol Back & Pembersihan Label]
**Tanggal:** 18 November 2026  
**Referensi:** Penanganan bug form kosong, penambahan tombol back, pembersihan teks "aktif/terkunci".

---

## [Milestone 5 — Revisi Alur Step Otomatis & Pembersihan Tanda Panah]
**Tanggal:** 18 November 2026  
**Referensi:** Instruksi revisi pengguna (penghapusan karakter `>` pada link).

---

## [Milestone 5, 6, 7 — Revisi Sinkronisasi Step & Ukuran Font Shape]
**Tanggal:** 18 November 2026  
**Referensi:** Penyesuaian proses langkah aktif pendaftaran ormawa dan pembesaran font shape 01–03.

---

## [Milestone 5, 6, 7] — Sign Up Page, Validation & Submission Simulation
**Tanggal:** 18 November 2026  
**Referensi Desain:** `SIGN UP · 01 Form, feature previews & validation.pdf` dan `SIGN UP · 02 Complete, submit & return to Login.pdf`

---

## [Milestone 3] — Password Recovery (Lupa Kata Sandi)
**Tanggal:** 18 November 2026  
**Referensi Desain:** `LOGIN · 05 Password recovery & Sign Up handoff.pdf`

---

## [Milestone 1 — Revisi Interaktivitas, Cursor & Penyelarasan UI]
**Tanggal:** 17 November 2026  
**Referensi:** Instruksi revisi pengguna.
