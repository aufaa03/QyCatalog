# Qy Product List 🛍️

Aplikasi web modern untuk mengelola dan menampilkan daftar produk rekomendasi (affiliate catalog) dengan tampilan antarmuka yang clean, aesthetic, dan responsif. Dibangun secara efisien menggunakan Next.js 14, React 18, dan Supabase.

## ✨ Fitur Utama

- **Katalog Produk (Publik)**: Tampilan grid produk yang responsif dan modern dengan dukungan foto produk, deskripsi produk, harga, dan tombol yang langsung mengarah ke link affiliate.
- **Admin Dashboard**: Panel admin ringkas dan fungsional untuk melihat statistik singkat dan manajemen kelola data.
- **Manajemen Produk (CRUD)**: Tambah, edit, dan hapus produk termasuk kapabilitas *drag and drop* upload foto produk langsung ke server Supabase Storage.
- **Autentikasi Aman**: Login khusus admin diamankan menggunakan fitur Supabase Auth.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Next/Image
- **Styling**: Vanilla CSS dengan variabel warna global (dilengkapi konfigurasi minimum Tailwind CSS)
- **Backend & Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (untuk menampung semua media foto produk)
- **Deployment**: Vercel

---

## 💻 Cara Menjalankan Secara Lokal (Local Development)

1. Clone repositori ini
2. Install semua dependencies melalui terminal/command prompt:
   ```bash
   npm install
   ```
3. Siapkan database Supabase. Buat tabel `products` dengan format struktur berikut:
   - `id` (uuid, primary key)
   - `name` (text)
   - `description` (text, nullable)
   - `price` (numeric)
   - `affiliate_url` (text)
   - `image_url` (text)
   - `created_at` (timestamp z)
4. Buat bucket berstatus **public** di Supabase Storage dengan nama `products`.
5. Buat file baru dengan nama `.env.local` di folder *root* (folder terluar program) dan isi dengan URL serta kunci Supabase project Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=URL_PROJECT_SUPABASE_ANDA
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY_PROJECT_SUPABASE_ANDA
   ```
6. Jalankan mode pengembangan (*development mode*):
   ```bash
   npm run dev
   ```
7. Buka browser pada alamat `http://localhost:3000`.

---

## 🚀 Panduan Setup & Deployment ke Vercel

Sistem ini sudah sepenuhnya dioptimalkan secara arsitektur untuk rilis dan integrasi dengan Vercel. Ikuti langkah sederhana berikut untuk melakukan proses *deployment*:

### Konfigurasi Push ke Platform Git:
1. Pastikan seluruh revisi file telah di-commit.
2. Push seluruh file dan kodingan ini ke repositori pada penyedia layanan Git seperti Github, Gitlab, dsb.

### Setup di Vercel:
1. Kunjungi website [Vercel](https://vercel.com) dan masuk (login).
2. Di Dashboard, tekan tombol **Add New...** dan pilih **Project**.
3. Import spesifik repositori Git (yang barusan Anda push sebelumnya).
4. Pada panel Setup, buka bagian / *dropdown* **Environment Variables**, dan mutlak wajib tambahkan dua buah Variabel Supabase berikut:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`  👉  Value: `(URL spesifik dari Supabase Dashboard bagian API)`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`  👉  Value: `(Anon public key spesifik dari Supabase)`
5. Klik **Deploy** dan berikan waktu kira-kira seratus detik hingga server build dan menjalankan App ini ke URL publik.

### Catatan Konfigurasi Image & Domain:
Aplikasi menggunakan fitur `<Image />` bawaan Next.js untuk menjaga performa optimal. Oleh karena itu, domain bawaan Supabase (`*.supabase.co`) sudah secara sengaja kami *whitelisting* di dalam file konfigurasi agar foto bisa muncul dengan benar.
*(Kode konfigurasi di bawah ini sebenarnya sudah kami tanamkan di dalam file `next.config.js` sehingga Anda tidak perlu repot-repot menyettings ulang — Namun bila nantinya Anda memakai layanan CDN/Domain Custom sendiri di *Storage* Supabase, Anda wajib memastikan URL custom domain ikut diselipkan pada menu / konfigurasi file ini).*

```javascript
// next.config.js - (Hanya referensi, sudah dipasang di kode utama)
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

Selamat berkarya dan semoga berhasil 🚀!
