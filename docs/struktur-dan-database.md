# Struktur Project dan Database

## Teknologi

- **Next.js 15** dengan App Router
- **React 19** dan **TypeScript**
- **Tailwind CSS 4** untuk styling
- **Supabase** untuk PostgreSQL dan penyimpanan file
- API server dibuat menggunakan Route Handlers Next.js

## Struktur aplikasi

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/                 # Login, lupa password, dan reset password
│   │   ├── profile/              # Membaca/mengubah profil dan unggah avatar
│   │   ├── skills/               # CRUD skill
│   │   └── works/                # CRUD proyek
│   ├── dashboard/
│   │   ├── blog/                 # Halaman pengelolaan blog
│   │   ├── profile/              # Pengelolaan profil
│   │   ├── skills/               # Pengelolaan skill
│   │   └── works/                # Daftar, tambah, dan edit proyek
│   ├── forgot-password/          # Halaman permintaan reset password
│   ├── login/                    # Halaman login admin
│   ├── reset-password/           # Halaman reset password
│   ├── HomeClient.tsx            # UI interaktif halaman portofolio
│   ├── globals.css               # Gaya global dan animasi
│   ├── layout.tsx                # Layout root, font, dan metadata
│   └── page.tsx                  # Pengambilan data beranda dari Supabase
├── components/                   # Komponen bersama dan UI dashboard
├── lib/
│   ├── auth/                     # Pembuatan token sesi
│   ├── supabase/                 # Klien Supabase admin
│   └── works/                    # Operasi relasi skill dengan proyek
├── middleware.ts                 # Middleware aplikasi
├── types/                        # Tipe data TypeScript
└── utils/supabase/               # Klien Supabase browser/server/admin

public/                            # Aset statis
```

## Skema database

Database menggunakan Supabase PostgreSQL. Tabel dan kolom berikut dirangkum dari diagram skema yang dilampirkan dan pemakaian tabel di kode.

### `profile`

Menyimpan satu profil yang ditampilkan pada halaman publik. Kode saat ini membaca dan memperbarui baris dengan `id = 1`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `int4` | Primary key |
| `full_name` | `text` | Nama lengkap |
| `hero_greeting` | `text` | Sapaan pada bagian hero |
| `hero_headline` | `text` | Headline utama |
| `bio` | `text` | Biografi |
| `role_title` | `text` | Jabatan/peran, opsional |
| `avatar_url` | `text` | URL avatar, opsional |
| `resume_url` | `text` | URL resume, opsional |
| `location` | `text` | Lokasi, opsional |
| `phone` | `text` | Nomor telepon, opsional |
| `email` | `text` | Email kontak |
| `linkedin_url` | `text` | URL LinkedIn, opsional |
| `github_url` | `text` | URL GitHub, opsional |
| `instagram_url` | `text` | URL Instagram, opsional |
| `updated_at` | `timestamptz` | Waktu pembaruan |

### `users`

Menyimpan kredensial pengguna admin dan token reset password.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key |
| `username` | `varchar` | Nama pengguna |
| `password` | `varchar` | Hash kata sandi; login membandingkannya menggunakan bcrypt |
| `created_at` | `timestamptz` | Waktu pembuatan |
| `email` | `varchar` | Email pengguna |
| `reset_token` | `varchar` | Token reset password, opsional |
| `reset_token_expires` | `timestamptz` | Masa berlaku token, opsional |

### `works`

Menyimpan item proyek pada bagian Works.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key |
| `title` | `varchar` | Judul proyek |
| `description` | `varchar` | Deskripsi singkat |
| `cover_image_url` | `text` | URL gambar cover, opsional |
| `project_url` | `text` | URL demo/proyek, opsional |
| `repo_url` | `text` | URL repositori, opsional |
| `created_at` | `timestamptz` | Waktu pembuatan |
| `updated_at` | `timestamptz` | Waktu pembaruan |

### `skills`

Menyimpan daftar skill/teknologi yang dapat dikaitkan ke proyek.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `varchar` | Nama skill; dipakai sebagai kolom konflik saat upsert |
| `created_at` | `timestamptz` | Waktu pembuatan |
| `icon_url` | `text` | URL ikon, opsional |

### `work_skills`

Tabel penghubung untuk relasi banyak-ke-banyak antara proyek dan skill.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `work_id` | `uuid` | Foreign key ke `works.id` |
| `skill_id` | `uuid` | Foreign key ke `skills.id` |
| `created_at` | `timestamptz` | Waktu relasi dibuat |

Setiap baris menghubungkan satu proyek dengan satu skill. Kode menggunakan tabel ini saat menyimpan skill proyek serta saat mengambil skill yang ditampilkan bersama proyek.

### `blog_categories` dan `blog_posts`

Fitur blog menggunakan dua tabel tambahan yang tidak terlihat pada diagram skema awal. Detail tipe SQL-nya perlu dikonfirmasi di Supabase; kolom berikut dirangkum dari tipe aplikasi dan query yang digunakan.

| Tabel | Kolom yang digunakan aplikasi |
|---|---|
| `blog_categories` | `id`, `name`, `slug` |
| `blog_posts` | `id`, `title`, `slug`, `excerpt`, `content`, `cover_image_url`, `category_id`, `tags`, `featured`, `status`, `views`, `published_at`, `created_at`, `updated_at` |

Relasi yang digunakan: `blog_posts.category_id` mengacu pada `blog_categories.id`. Halaman publik hanya menampilkan post dengan `status = published`; halaman daftar artikel menampilkan maksimal tiga post terbaru.

## Relasi

```text
works 1 ─── * work_skills * ─── 1 skills
blog_categories 1 ─── * blog_posts
```

Dengan demikian, satu proyek dapat memiliki banyak skill dan satu skill dapat digunakan oleh banyak proyek. Satu kategori blog dapat memiliki banyak post. `profile` dan `users` berdiri sendiri dalam skema yang ditampilkan.

## Penyimpanan file Supabase

Kode menggunakan tiga bucket Supabase Storage:

- `works` — gambar cover proyek.
- `avatars` — avatar profil.
- `blog` — gambar cover artikel.

URL publik file disimpan pada kolom `works.cover_image_url`, `profile.avatar_url`, dan `blog_posts.cover_image_url`. Bucket bukan tabel relasional; objek file disimpan di Supabase Storage.

## Catatan cakupan

- Diagram yang diberikan menampilkan lima tabel awal. Fitur blog menggunakan `blog_categories` dan `blog_posts` sebagai tambahan.
- Detail seperti kebijakan Row Level Security (RLS), constraint, default value, dan aksi foreign key perlu dikonfirmasi pada konfigurasi database Supabase karena tidak seluruhnya dapat disimpulkan dari diagram/kode aplikasi.
