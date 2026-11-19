# DATABASE.md — Pindah ke MySQL lokal (XAMPP + phpMyAdmin)

Status sekarang: aplikasi **sudah berjalan di MySQL** (XAMPP, database
`selasarspace`). SQLite tetap tersedia sebagai cadangan kalau MySQL sedang mati.

---

## 1. Pasang XAMPP

1. Unduh XAMPP dari `https://www.apachefriends.org`
2. Pasang, lalu buka **XAMPP Control Panel**
3. Klik **Start** pada **Apache** dan **MySQL**
4. Pastikan port MySQL **3306** tidak dipakai aplikasi lain

---

## 2. Buat database kosong

Buka `http://localhost/phpmyadmin` lalu:

1. Klik tab **Databases**
2. Nama database: `selasarspace`
3. Collation: `utf8mb4_general_ci`
4. Klik **Create**

Tidak perlu membuat tabel. Prisma yang membuat semuanya.

---

## 3. Pindahkan aplikasi ke MySQL

Di folder proyek:

```bash
npm run db:use-mysql      # ubah provider schema + DATABASE_URL sekaligus
npm run db:generate
npm run db:migrate        # membuat semua tabel di database selasarspace
npm run db:seed           # mengisi 6 himpunan, 19 akun, 5 jadwal contoh
```

Kalau berhasil, buka phpMyAdmin: database `selasarspace` akan berisi tabel
`User`, `Organization`, `Room`, `Booking`, `SlotLock`, dan `AuditLog`.

Kalau gagal dengan pesan `Access denied for user 'root'`, berarti sandi root
XAMPP-mu tidak kosong. Ubah `DATABASE_URL` di `.env`:

```
mysql://root:SANDIMU@127.0.0.1:3306/selasarspace
```

---

## 4. Kembali ke SQLite (kalau perlu)

```bash
npm run db:use-sqlite
npm run db:generate
npm run db:migrate
npm run db:seed
```

---

## Kenapa ada dua perintah, bukan satu

Prisma menetapkan jenis database di `prisma/schema.prisma`, bukan di `.env`.
Kalau hanya `.env` yang diubah tanpa mengubah `provider`, Prisma akan menolak
dengan pesan "the URL must start with the protocol `file:`". Skrip
`npm run db:use-mysql` mengubah keduanya sekaligus supaya tidak pernah
berbeda.

---

## Catatan untuk nanti (deploy)

Supabase **tidak** dipakai sekarang. Saat deploy, cukup:

1. Buat proyek Supabase, salin connection string Postgres
2. `DATABASE_URL="postgresql://..."` di environment Vercel
3. Ubah `provider` di schema menjadi `postgresql`
4. `npx prisma migrate deploy`

Adapter Postgres (`@prisma/adapter-pg`) sudah terpasang, jadi tidak ada kode
aplikasi yang perlu diubah.
