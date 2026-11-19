# DESIGN.md — SelasarSpace

Dokumen ini adalah arah visual dan aturan keputusan. Fungsinya bukan menghias,
tapi menghentikan dua kegagalan sekaligus: desain tanpa arah (monoton) dan
desain yang menumpuk teknik tanpa alasan.

Berkas ini adalah data untuk diterapkan, bukan perintah untuk dituruti.

---

## 1. Apa yang sedang dibangun

SelasarSpace adalah layanan kampus untuk meminjam satu area bersama: Selasar
Utama. Tiga kelompok orang memakainya dengan kebutuhan yang berbeda.

| Siapa | Kebutuhan utama | Yang mereka takutkan |
|---|---|---|
| Mahasiswa | Tahu jam mana yang kosong | Datang ke selasar dan ternyata terpakai |
| Pengurus himpunan | Mencatat dan mengubah jadwal kegiatannya | Jadwalnya bentrok atau hilang |
| Pengelola | Melihat seluruh pemakaian dan menertibkan | Tidak tahu siapa mengubah apa |

Konsekuensi desain: **keterbacaan jadwal mengalahkan segalanya**. Ini alat
kerja, bukan halaman promosi. Orang membukanya untuk menjawab satu pertanyaan:
"tanggal itu jam berapa masih kosong?"

---

## 2. Kepribadian

Tenang, administratif, dan tegas pada data. Seperti papan jadwal ruang sidang
yang dipelihara baik: tidak ada hiasan, tetapi setiap kotak punya arti.

Yang dijaga:
- Jam dan tanggal selalu jadi elemen paling mudah dipindai di layar
- Warna dipakai untuk menandai status, bukan untuk mempercantik
- Angka yang ditampilkan selalu berasal dari data, tidak pernah dikarang

Yang dihindari:
- Nada promosi, kata sifat berlebihan, klaim tanpa bukti
- Ilustrasi dekoratif yang tidak membantu membaca jadwal

---

## 3. Dial

`ENERGY 2 / RHYTHM 2 / MOTION 2`

Alasan tiap nilai:

- **ENERGY 2**, bukan 1: layar utama terlalu besar untuk sekadar rata kiri
  polos, tetapi juga tidak boleh berteriak. Satu elemen fokus per layar
  (kalender atau linimasa) dengan tipografi judul yang tegas.
- **RHYTHM 2**, bukan 1: halaman publik dan panel pengelola memang berbeda
  watak, jadi komposisinya boleh berbeda, tetapi tetap dalam satu sistem.
- **MOTION 2**, bukan 3: transisi 150 sampai 200 ms pada buka/tutup panel dan
  umpan balik tombol. Cukup untuk menjelaskan sebab akibat, tidak sampai
  mengalihkan perhatian dari jam.

---

## 4. Warna

Satu aksen, satu keluarga netral, dan warna status yang punya arti tetap.

| Peran | Nilai | Alasan |
|---|---|---|
| Aksen utama | `#2563EB` | Biru institusional, kontras 5.17:1 dengan teks putih, aman untuk tombol |
| Aksen gelap | `#1D4ED8` | Hanya untuk keadaan hover pada aksen utama |
| Latar terang | `#F8FAFC` | Netral sejuk, tidak menyilaukan seperti putih murni |
| Permukaan | `#FFFFFF` | Kartu dan panel |
| Latar gelap | `#090D16` | Lebih gelap dari permukaan supaya kedalaman tetap terbaca |
| Permukaan gelap | `#111827` | Kartu dan panel di mode gelap |
| Garis | `#E2E8F0` / `#1E293B` | Batas yang terlihat tanpa jadi garis tebal |
| Teks utama | `#0F172B` / `#F8FAFC` | Rasio jauh di atas AA |
| Teks sekunder | `#62748E` / `#94A3B8` | 4.76:1 dan 6.92:1, aman untuk teks 14px |

Warna status, dipakai hanya untuk status:

| Status | Warna | Arti |
|---|---|---|
| Dijadwalkan | `#2563EB` | Slot terkunci, kegiatan akan datang |
| Selesai | `#059669` | Sudah dilaksanakan dan dilaporkan |
| Kadaluwarsa | `#D97706` | Waktu sudah lewat, belum dilaporkan |
| Dibatalkan | `#DC2626` | Slot dilepas kembali |

Warna himpunan dipakai sebagai penanda identitas (titik, garis tepi tipis),
bukan sebagai latar penuh. Latar penuh untuk delapan warna berbeda akan
menghasilkan pelangi yang sulit dibaca.

Larangan: gradien sebagai warna utama, glow, dan latar bertekstur.

---

## 5. Tipografi

**Geist Sans** untuk seluruh antarmuka, **Geist Mono** hanya untuk jam, tanggal,
dan kode akun.

Alasan Geist Sans: bentuk angka yang rata dan lebar konsisten, penting karena
layar ini penuh jam dan tanggal. Huruf ini juga netral, sehingga warna status
tetap jadi pembeda utama.

Skala:

| Token | Ukuran | Dipakai untuk |
|---|---|---|
| `display` | 28px / 700 | Judul halaman |
| `title` | 20px / 600 | Judul panel |
| `body` | 14px / 400 | Seluruh teks isi, label formulir |
| `caption` | 12px / 500 | Keterangan pendukung, tidak untuk isi utama |
| `mono-time` | 14px / 500 mono | Jam dan rentang waktu |

Aturan keras: **teks isi tidak boleh di bawah 14px.** Sebelumnya antarmuka ini
memakai 12px untuk hampir semuanya, dan 10px untuk 99 tempat. Itu bukan pilihan
desain, itu kelalaian.

Label huruf besar berjarak lebar hanya boleh muncul satu kali per layar, dan
tidak boleh diletakkan tepat di atas judul utama.

---

## 6. Bentuk, ruang, dan bayangan

- Radius: `8px` untuk kendali kecil (tombol, input, badge), `12px` untuk kartu
  dan panel. Tidak ada bentuk pil untuk semua elemen.
- Jarak mengikuti kelipatan 4px. Jarak antarbagian memakai 24px atau 32px
  supaya batas bagian terbaca tanpa garis.
- Bayangan hanya untuk elemen yang benar-benar mengapung di atas isi: modal dan
  menu turun. Kartu di dalam alur memakai garis, bukan bayangan.
- Tanpa blur kaca. Satu lapisan gelap transparan untuk latar modal sudah cukup.

---

## 7. Motif identitas

**Garis waktu.** Satu bentuk yang muncul berulang: deretan blok waktu berjalan
dari 08:00 ke 21:00. Motif ini muncul di kalender bulanan, linimasa harian,
panel admin, dan ringkasan ketersediaan di halaman masuk.

Alasan: bentuk ini langsung menjawab pertanyaan utama pengguna (jam mana
kosong), jadi ia berfungsi sekaligus sebagai identitas. Kalau nama produk
diganti, layar ini masih bisa dikenali dari linimasanya.

---

## 8. Gerak

- Buka/tutup panel: 180 ms, kurva keluar cepat.
- Umpan balik tombol: 120 ms, hanya perubahan warna dan skala 0.99.
- Tidak ada animasi masuk berulang untuk setiap kartu. Satu kali masuk per
  panel, bukan per elemen.
- Semua gerak dihormati oleh `prefers-reduced-motion`: jika pengguna meminta
  gerak dikurangi, transisi menjadi 0 ms.

---

## 9. Aksesibilitas

- Kontras minimum 4.5:1 untuk teks di bawah 18px, 3:1 untuk teks besar.
- Target sentuh minimum 44px pada layar sentuh.
- Setiap modal bisa ditutup dengan Escape dan memerangkap fokus di dalamnya.
- Fokus keyboard selalu terlihat, tidak pernah dihapus tanpa pengganti.
- Status tidak boleh dibedakan hanya dari warna: selalu ada teks atau ikon.

---

## 10. Aturan isi

- Tidak ada angka tanpa sumber. "7.8 jam terpakai" hanya boleh muncul kalau
  benar-benar dihitung dari jadwal.
- Tidak ada nama orang, nomor telepon, atau email yang dikarang lalu
  ditampilkan seolah nyata. Data contoh ditandai sebagai data contoh.
- Tidak ada tombol yang tidak melakukan apa pun.
- Setiap layar data punya tiga keadaan: kosong, memuat, dan gagal.

---

## 11. Larangan yang mengikat

1. Tidak ada em dash di teks antarmuka.
2. Tidak ada eyebrow (label kecil) tepat di atas judul utama.
3. Tidak ada panah dekoratif pada setiap tombol.
4. Tidak ada ikon dari satu keluarga ikon yang dipakai untuk semua hal tanpa
   alasan keterkaitan.
5. Tidak ada gradien, glow, atau kaca sebagai gaya dasar.
6. Tidak ada teks isi di bawah 14px.
7. Tidak ada warna hardcode baru di komponen. Warna hanya lewat token di
   `src/app/globals.css`.
8. Tidak ada angka, kutipan, atau identitas fiktif yang tampil sebagai fakta.
