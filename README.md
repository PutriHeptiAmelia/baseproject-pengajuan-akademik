# Sistem Pengajuan Administrasi Akademik Mahasiswa Berbasis Web

Repositori ini merupakan baseproject untuk tugas akhir mata kuliah Web Framework (INF620309), Program Studi Teknik Informatika, Jurusan Teknik Elektro, Fakultas Teknik, Universitas Lampung (Kelas PSTI B - 2026).

Sistem ini dirancang untuk mengintegrasikan proses pengajuan layanan administrasi akademik mahasiswa secara daring dalam satu sistem terpadu. Alur utama sistem ini adalah:
Pengajuan -> Verifikasi Dosen PA -> Persetujuan Kaprodi -> Pemrosesan Staff Akademik -> Selesai.

## Prasyarat Sistem

Sebelum menjalankan proyek, pastikan perangkat lokal sudah terpasang:
- PHP 8.3 ke atas (dengan ekstensi pdo_pgsql aktif)
- Composer
- Node.js dan npm
- Git
- PostgreSQL (beserta pgAdmin atau psql)

## Langkah Menjalankan Proyek dari Nol

1. Clone repositori ke perangkat lokal:

```
   git clone https://github.com/PutriHeptiAmelia/baseproject-pengajuan-akademik.git
   cd baseproject-pengajuan-akademik
```

2. Pasang dependensi PHP dan JavaScript:

```
   composer install
   npm install
```

3. Salin file konfigurasi lingkungan (.env):

   Untuk pengguna Windows (CMD):
```
   copy .env.example .env
```

   Untuk pengguna Mac / Linux / Git Bash:
```
   cp .env.example .env
```

4. Buat application key Laravel:

```
   php artisan key:generate
```

5. Buat database kosong di PostgreSQL dengan nama `pengajuan_akademik` melalui pgAdmin, atau jalankan perintah berikut di terminal:

```
   psql -U postgres -c "CREATE DATABASE pengajuan_akademik;"
```

6. Buka file `.env` dan sesuaikan konfigurasi database PostgreSQL (terutama bagian `DB_PASSWORD` sesuai password PostgreSQL masing-masing):

```
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=pengajuan_akademik
   DB_USERNAME=postgres
   DB_PASSWORD=isi_password_postgres_anda
```

7. Jalankan migrasi 7 tabel beserta seeder data contoh:

```
   php artisan migrate:fresh --seed
```

8. Jalankan server pengembangan aplikasi:

```
   composer run dev
```

9. Buka browser dan akses alamat:

```
   http://localhost:8000
```

## Daftar Akun Contoh Per Peran (Hasil Seeder)

Seluruh akun contoh di bawah ini menggunakan password yang sama, yaitu: `password123`

- **Mahasiswa**
  Nama: Kholifah Wulandari
  Email: kholifah.wulandari@students.unila.ac.id
  NIM: 2415061099

- **Dosen Pembimbing Akademik (PA)**
  Nama: Ir. Gigih Forda Nama, S.T., M.T.I., IPM
  Email: gigih.forda@eng.unila.ac.id
  NIP: 198307122008121003

- **Ketua Program Studi (Kaprodi)**
  Nama: Yessi Mulyani, S.T., M.T.
  Email: yessi.mulyani@eng.unila.ac.id
  NIP: 197312262000122001

- **Staff Akademik**
  Nama: Indrawati
  Email: indrawati.staff@eng.unila.ac.id
  NIP: 198501012010012001

## Arsitektur Sistem

Bentuk arsitektur yang dipilih adalah **Monolit Inertia (Laravel + React)**.

1. **Alasan Teknis Pertama:**
   Otorisasi berjenjang cukup ditegakkan di satu tempat. Setiap pengajuan berpindah status secara berjenjang dan tiap peran hanya boleh melakukan transisi tertentu. Dengan monolit Inertia, aturan ini cukup ditulis sekali pada Policy/Gate Laravel di sisi server tanpa perlu menduplikasi logika hak akses di sisi klien maupun menyiapkan autentikasi token API terpisah.

2. **Alasan Teknis Kedua:**
   Unggah dokumen persyaratan, pembuatan dokumen PDF, dan notifikasi perubahan status seluruhnya diproses di sisi server. Validasi form dan file tetap memakai Form Request Laravel dan pesan error otomatis dikirim ke komponen React oleh Inertia tanpa perlu membangun endpoint API terpisah.

3. **Hal yang Dikorbankan:**
   Karena bukan API murni, sistem ini tidak dapat langsung dikonsumsi oleh klien eksternal di luar aplikasi web ini (seperti aplikasi mobile native terpisah) tanpa membangun lapisan endpoint API tambahan di masa mendatang.

## Pembagian Peran Tim Pengembang (PSTI B)

1. **Basis Data dan Model** (Skema, migrasi, model, seeder):
   Edbert Frederick (2415061114)

2. **Antarmuka dan Komponen** (Tata letak, komponen React, halaman per peran):
   Putri Nabilla Atifa (2415061040)

3. **Autentikasi** (Login, logout, session, kolom peran, akun contoh per peran):
   Putri Hepti Amelia (2415061005)

4. **Otorisasi** (Policy/Gate, middleware, aturan transisi status berjenjang):
   Vivian Rizkiana Fauzi (2415061002)

5. **Uji Kebergunaan dan Dokumentasi** (PDF, README, halaman arsitektur, calon pengguna, skenario uji):
   Yaza Nur Zahira (2415061032)