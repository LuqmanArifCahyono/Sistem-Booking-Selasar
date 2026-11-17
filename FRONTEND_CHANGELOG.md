# SelasarSpace — Frontend Changelog

Dokumentasi riwayat pengembangan antarmuka (frontend only) untuk sistem peminjaman tempat SelasarSpace.

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
