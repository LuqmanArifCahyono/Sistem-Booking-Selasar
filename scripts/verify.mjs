#!/usr/bin/env node
/**
 * Verifikasi backend SelasarSpace.
 *
 * Menjalankan 20 pemeriksaan terhadap server yang sedang hidup, lalu mencetak
 * tabel LULUS/GAGAL. Skrip ini menulis data uji di tanggal jauh (2027) lalu
 * menghapusnya kembali, jadi kalender demo tidak tercemar.
 *
 * Pakai:
 *   npm run dev          # di terminal lain, biarkan hidup
 *   npm run verify
 */

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

// ---------------------------------------------------------------------------
// Cookie jar sederhana
// ---------------------------------------------------------------------------

const jar = new Map();

function storeCookies(response) {
  const raw = response.headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const index = pair.indexOf("=");
    if (index > 0) jar.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function http(path, { method = "GET", body, json = true, cookies = true } = {}) {
  const headers = {};
  if (cookies && jar.size) headers.cookie = cookieHeader();
  if (body !== undefined) {
    headers["content-type"] = json
      ? "application/json"
      : "application/x-www-form-urlencoded";
  }

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : json ? JSON.stringify(body) : body,
    redirect: "manual",
  });

  if (cookies) storeCookies(response);

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return { status: response.status, data, text, location: response.headers.get("location") };
}

async function login(email, password) {
  const csrf = await http("/api/auth/csrf");
  const form = new URLSearchParams({
    csrfToken: csrf.data?.csrfToken ?? "",
    email,
    password,
    callbackUrl: `${BASE}/`,
  });
  return http("/api/auth/callback/credentials", { method: "POST", body: form, json: false });
}

// ---------------------------------------------------------------------------
// Pelari pemeriksaan
// ---------------------------------------------------------------------------

const results = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail });
  const mark = pass ? "LULUS" : "GAGAL";
  console.log(`  ${mark.padEnd(6)} ${name}${detail ? `  (${detail})` : ""}`);
}

async function check(name, fn) {
  try {
    const detail = await fn();
    record(name, true, detail);
    return true;
  } catch (error) {
    record(name, false, error.message);
    return false;
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nVerifikasi backend SelasarSpace di ${BASE}\n`);

  // --- Kesiapan server -----------------------------------------------------
  console.log("[1] Kesiapan server");
  const alive = await check("Server menjawab", async () => {
    const res = await http("/api/bookings");
    expect(res.status === 200, `status ${res.status}`);
    expect(Array.isArray(res.data?.data), "bentuk respons tidak sesuai");
    return `${res.data.data.length} booking`;
  });

  if (!alive) {
    console.log("\nServer belum hidup. Jalankan `npm run dev` di terminal lain, lalu ulangi.\n");
    process.exit(1);
  }

  let roomId;
  let adminOrgId;

  await check("Daftar himpunan", async () => {
    const res = await http("/api/organizations");
    expect(res.status === 200, `status ${res.status}`);
    expect(res.data.data.length >= 1, "tidak ada himpunan");
    adminOrgId = res.data.data.find((o) => o.shortName === "Himatifa")?.id;
    expect(adminOrgId, "Himatifa tidak ada di database");
    return `${res.data.data.length} himpunan`;
  });

  await check("Daftar ruang", async () => {
    const res = await http("/api/rooms");
    expect(res.status === 200, `status ${res.status}`);
    roomId = res.data.data[0]?.id;
    expect(roomId, "tidak ada ruang");
    return `${res.data.data[0].name} ${res.data.data[0].openTime}-${res.data.data[0].closeTime}`;
  });

  // --- Penjaga rute --------------------------------------------------------
  console.log("\n[2] Penjaga rute (tanpa sesi)");
  await check("Halaman kalender wajib login", async () => {
    const res = await http("/kalender", { cookies: false });
    expect(res.status === 307 || res.status === 302, `status ${res.status}`);
    expect((res.location ?? "").includes("/login"), `tujuan ${res.location}`);
    return res.location;
  });

  await check("/admin menolak tamu", async () => {
    const res = await http("/admin", { cookies: false });
    expect(res.status === 307 || res.status === 302, `status ${res.status}`);
    expect((res.location ?? "").includes("/login"), `tujuan ${res.location}`);
    return res.location;
  });

  // --- Autentikasi ---------------------------------------------------------
  console.log("\n[3] Autentikasi");
  await check("Sandi salah ditolak", async () => {
    const res = await login("kahimatifa@gmail.com", "sandi-ngawur-999");
    expect(res.status === 302, `status ${res.status}`);
    expect((res.location ?? "").includes("error"), `tujuan ${res.location}`);
    expect(!jar.has("authjs.session-token"), "cookie sesi tetap dibuat");
    return "ditolak";
  });

  await check("Sandi benar diterima", async () => {
    const res = await login("kahimatifa@gmail.com", "kahimatifa2026");
    expect(res.status === 302, `status ${res.status}`);
    expect(!(res.location ?? "").includes("error"), `tujuan ${res.location}`);
    expect(jar.has("authjs.session-token"), "cookie sesi tidak dibuat");
    return "sesi dibuat";
  });

  await check("Sesi membawa peran & himpunan", async () => {
    const res = await http("/api/auth/session");
    const user = res.data?.user;
    expect(user?.role === "ADMIN", `peran ${user?.role}`);
    expect(user?.position === "KETUA", `jabatan ${user?.position}`);
    expect(user?.organizationName === "Himatifa", `himpunan ${user?.organizationName}`);
    return `${user.role} / ${user.position} / ${user.organizationName}`;
  });

  // --- Peminjaman ----------------------------------------------------------
  console.log("\n[4] Peminjaman");
  let ownBookingId;
  let oddBookingId;
  let superBookingId;
  let fullDayBookingId;

  await check("Buat jadwal himpunan sendiri", async () => {
    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Verifikasi Otomatis",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-01",
        startTime: "09:00",
        endTime: "11:00",
        pjName: "Penguji",
        pjContact: "081200000000",
        purpose: "Dibuat oleh npm run verify",
      },
    });
    expect(res.status === 201, `status ${res.status} ${res.data?.error ?? ""}`);
    ownBookingId = res.data.data.id;
    expect(res.data.data.status === "DIJADWALKAN", `status ${res.data.data.status}`);
    return res.data.data.title;
  });

  await check("Bentrok jadwal ditolak", async () => {
    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Tabrakan",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-01",
        startTime: "10:00",
        endTime: "12:00",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(res.status === 409, `status ${res.status}`);
    return res.data.error.slice(0, 60);
  });

  await check("Di luar jam operasional ditolak", async () => {
    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Terlalu pagi",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-02",
        startTime: "07:00",
        endTime: "09:00",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(res.status === 422, `status ${res.status}`);
    return res.data.error;
  });

  await check("Buat jadwal himpunan lain ditolak", async () => {
    const orgs = await http("/api/organizations");
    const other = orgs.data.data.find((o) => o.id !== adminOrgId);
    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Nyasar",
        organizationId: other.id,
        roomId,
        date: "2027-06-03",
        startTime: "09:00",
        endTime: "10:00",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(res.status === 403, `status ${res.status}`);
    return res.data.error.slice(0, 50);
  });

  await check("Ubah jadwal milik orang lain ditolak", async () => {
    const list = await http("/api/bookings");
    const foreign = list.data.data.find((b) => b.createdById && !b.canMutate);
    expect(foreign, "tidak ada jadwal milik akun lain untuk diuji");
    const res = await http(`/api/bookings/${foreign.id}`, {
      method: "PATCH",
      body: { title: "Coba ubah" },
    });
    expect(res.status === 403, `status ${res.status}`);
    return res.data.error.slice(0, 50);
  });

  await check("Ubah jadwal sendiri diterima", async () => {
    const res = await http(`/api/bookings/${ownBookingId}`, {
      method: "PATCH",
      body: { title: "Verifikasi Otomatis (revisi)" },
    });
    expect(res.status === 200, `status ${res.status}`);
    expect(res.data.data.title.includes("revisi"), "judul tidak berubah");
    return "judul diperbarui";
  });

  await check("Durasi bebas, bukan blok 2 jam", async () => {
    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Durasi Ganjil",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-10",
        startTime: "09:17",
        endTime: "11:43",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(res.status === 201, `status ${res.status} ${res.data?.error ?? ""}`);
    oddBookingId = res.data.data.id;
    return "09:17-11:43 diterima";
  });

  await check("Seluruh rentang 08:00-21:00 diterima", async () => {
    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Sehari Penuh",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-12",
        startTime: "08:00",
        endTime: "21:00",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(res.status === 201, `status ${res.status} ${res.data?.error ?? ""}`);
    fullDayBookingId = res.data.data.id;
    return "13 jam nonstop";
  });

  await check("Tepat di luar jam operasional ditolak", async () => {
    const early = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Terlalu awal",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-13",
        startTime: "07:59",
        endTime: "09:00",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(early.status === 422, `07:59 status ${early.status}`);

    const late = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Terlalu akhir",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-14",
        startTime: "20:00",
        endTime: "21:01",
        pjName: "Penguji",
        pjContact: "081200000000",
      },
    });
    expect(late.status === 422, `21:01 status ${late.status}`);
    return "07:59 dan 21:01 ditolak";
  });

  // --- Slot ----------------------------------------------------------------
  console.log("\n[5] Slot & ketersediaan");
  let lockId;

  await check("Tutup slot yang masih terpakai ditolak", async () => {
    const res = await http("/api/slots/lock", {
      method: "POST",
      body: { date: "2027-06-01", startTime: "09:00", endTime: "12:00", reason: "Uji" },
    });
    expect(res.status === 409, `status ${res.status}`);
    return res.data.error.slice(0, 50);
  });

  await check("Tutup slot kosong diterima", async () => {
    const res = await http("/api/slots/lock", {
      method: "POST",
      body: { date: "2027-06-05", startTime: "08:00", endTime: "10:00", reason: "Uji" },
    });
    expect(res.status === 201, `status ${res.status}`);
    lockId = res.data.data.id;
    return "slot ditutup";
  });

  await check("Ketersediaan menghitung jam kosong", async () => {
    const res = await http(`/api/availability?date=2027-06-01&roomId=${roomId}`);
    expect(res.status === 200, `status ${res.status}`);
    expect(res.data.data.gaps.length > 0, "tidak ada jam kosong");
    const first = res.data.data.gaps[0];
    return `${first.startTime}-${first.endTime} kosong`;
  });

  // --- Peran mahasiswa -----------------------------------------------------
  console.log("\n[6] Peran mahasiswa (read-only)");
  const studentEmail = "uji.otomatis@student.kampus.ac.id";
  const studentPassword = "mahasiswa2026";

  await check("Registrasi mahasiswa", async () => {
    const res = await http("/api/auth/register", {
      method: "POST",
      body: {
        name: "Mahasiswa Uji Otomatis",
        email: studentEmail,
        password: studentPassword,
        confirmPassword: studentPassword,
      },
      cookies: false,
    });
    expect([201, 409].includes(res.status), `status ${res.status}`);
    return res.status === 201 ? "akun dibuat" : "akun sudah ada";
  });

  await check("Mahasiswa tidak bisa membuat jadwal", async () => {
    jar.clear();
    const res = await login(studentEmail, studentPassword);
    expect(res.status === 302 && !(res.location ?? "").includes("error"), "gagal masuk sebagai mahasiswa");

    const session = await http("/api/auth/session");
    expect(session.data?.user?.role === "USER", `peran ${session.data?.user?.role}`);

    const create = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Mahasiswa mencoba",
        organizationId: adminOrgId,
        roomId,
        date: "2027-06-06",
        startTime: "09:00",
        endTime: "10:00",
        pjName: "Mahasiswa",
        pjContact: "081200000001",
      },
    });
    expect(create.status === 403, `status ${create.status}`);
    return "ditolak 403";
  });

  await check("Mahasiswa tidak bisa membuka panel admin", async () => {
    const res = await http("/admin");
    expect(res.status === 307 || res.status === 302, `status ${res.status}`);
    expect((res.location ?? "").includes("/kalender"), `tujuan ${res.location}`);
    return "dialihkan ke kalender";
  });

  // --- Super admin ---------------------------------------------------------
  console.log("");
  console.log("[7] Super admin bisa segalanya");
  await check("Super admin membuat jadwal untuk himpunan mana pun", async () => {
    jar.clear();
    const loginRes = await login("superadmin@selasarspace.id", "superadmin2026");
    expect(loginRes.status === 302 && !(loginRes.location ?? "").includes("error"), "gagal masuk sebagai super admin");

    const orgs = await http("/api/organizations");
    const other = orgs.data.data.find((o) => o.id !== adminOrgId);
    expect(other, "tidak ada himpunan lain");

    const res = await http("/api/bookings", {
      method: "POST",
      body: {
        title: "Dibuat Super Admin",
        organizationId: other.id,
        roomId,
        date: "2027-06-11",
        startTime: "13:00",
        endTime: "14:00",
        pjName: "Super Admin",
        pjContact: "081200000009",
      },
    });
    expect(res.status === 201, `status ${res.status} ${res.data?.error ?? ""}`);
    superBookingId = res.data.data.id;
    return `untuk ${other.shortName}`;
  });

  await check("Super admin mengubah jadwal buatan admin lain", async () => {
    const res = await http(`/api/bookings/${ownBookingId}`, {
      method: "PATCH",
      body: { title: "Diubah oleh Super Admin" },
    });
    expect(res.status === 200, `status ${res.status} ${res.data?.error ?? ""}`);
    expect(res.data.data.canMutate === true, "canMutate tidak true untuk super admin");
    return "diizinkan";
  });

  // --- Pembersihan ---------------------------------------------------------
  console.log("\n[7] Pembersihan data uji");
  await check("Hapus jadwal uji", async () => {
    jar.clear();
    await login("kahimatifa@gmail.com", "kahimatifa2026");
    const res = await http(`/api/bookings/${ownBookingId}`, { method: "DELETE" });
    expect(res.status === 200, `status ${res.status}`);
    const list = await http("/api/bookings?from=2027-06-01&to=2027-06-01");
    expect(list.data.data.length === 0, "jadwal masih tampil");
    return "dihapus (soft delete)";
  });

  await check("Hapus sisa jadwal uji", async () => {
    // Satu jadwal dibuat oleh super admin, jadi pembersihan harus memakai
    // sesi super admin. Kalau tidak, akun admin akan ditolak 403 dan data uji
    // tertinggal untuk mengganggu jalankan berikutnya.
    jar.clear();
    const loginRes = await login("superadmin@selasarspace.id", "superadmin2026");
    expect(loginRes.status === 302, "gagal masuk sebagai super admin");

    const ids = [oddBookingId, superBookingId, fullDayBookingId].filter(Boolean);
    const failed = [];
    for (const id of ids) {
      const res = await http(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.status !== 200) failed.push(`${id}:${res.status}`);
    }
    expect(failed.length === 0, `gagal menghapus ${failed.join(", ")}`);
    return `${ids.length} jadwal`;
  });

  await check("Buka kembali slot uji", async () => {
    const res = await http(`/api/slots/lock?id=${lockId}`, { method: "DELETE" });
    expect(res.status === 200, `status ${res.status}`);
    return "slot dibuka";
  });

  // --- Ringkasan -----------------------------------------------------------
  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;

  console.log("\n" + "=".repeat(60));
  console.log(`HASIL: ${passed}/${results.length} lulus, ${failed} gagal`);
  if (failed > 0) {
    console.log("\nYang gagal:");
    results.filter((r) => !r.pass).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
  }
  console.log("=".repeat(60) + "\n");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("\nSkrip verifikasi berhenti:", error.message);
  process.exit(1);
});
