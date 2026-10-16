# Struktur, Alur Sistem, dan Tema

Dokumen ini menjelaskan susunan kode aplikasi, perjalanan pengguna dan data, serta aturan visual utama. Ringkasan skema tabel dan database tersedia di [struktur-dan-database.md](./struktur-dan-database.md); palet tema lebih rinci juga tersedia di [tema.md](./tema.md).

## Teknologi utama

- Next.js 15 App Router, React 19, dan TypeScript.
- Tailwind CSS 4 dengan konfigurasi tema tambahan di `tailwind.config.js`.
- Supabase PostgreSQL dan Supabase Storage.
- Cookie sesi JWT yang ditandatangani dengan `jose`; kata sandi diverifikasi dengan `bcryptjs`.
- Resend untuk pengiriman email reset kata sandi.

## Struktur folder

```text
.
├── docs/                         # Dokumentasi proyek
├── public/                       # Aset statis yang disajikan langsung
└── src/
    ├── app/                      # Route, layout, metadata, dan Route Handler Next.js
    │   ├── api/
    │   │   ├── auth/             # Login dan pemulihan kata sandi
    │   │   ├── blog/             # Artikel dan kategori blog
    │   │   ├── profile/          # Profil dan unggah avatar
    │   │   ├── skills/           # Daftar dan pengelolaan skill
    │   │   └── works/            # Daftar dan pengelolaan proyek
    │   ├── blog/[slug]/          # Halaman artikel publik
    │   ├── dashboard/            # Halaman admin dan pengelolaan konten
    │   ├── forgot-password/      # Form permintaan reset kata sandi
    │   ├── login/                # Form autentikasi admin
    │   ├── reset-password/       # Form kata sandi baru
    │   ├── globals.css           # Gaya global, animasi, dan gaya artikel
    │   ├── layout.tsx            # Layout root, font, dan metadata global
    │   ├── page.tsx              # Pengambilan data server untuk halaman utama
    │   ├── robots.ts             # Aturan crawler
    │   └── sitemap.ts            # Sitemap
    ├── components/
    │   ├── blog/                 # Form artikel admin dan kontrol artikel publik
    │   ├── dashboard/            # Shell admin dan komponen pengelolaan
    │   └── portfolio/            # UI interaktif portofolio, header, dan footer
    ├── lib/
    │   ├── auth/                 # Pembuatan, verifikasi, dan pembacaan sesi
    │   ├── blog/                 # Parsing form dan rendering Markdown
    │   ├── supabase/             # Klien Supabase admin
    │   └── works/                # Helper relasi proyek dan skill
    ├── middleware.ts             # Proteksi route dashboard dan redirect login
    ├── types/                    # Tipe data domain
    └── utils/supabase/           # Klien Supabase server, browser, dan admin
```

### Tanggung jawab folder

- `app/` mengikuti konvensi App Router. Segmen folder menjadi URL; `page.tsx` merender halaman dan `api/**/route.ts` menangani HTTP API.
- `components/` berisi UI yang dapat digunakan lintas halaman, dikelompokkan menurut domain agar komponen publik, blog, dan dashboard mudah ditemukan.
- `lib/` berisi logika aplikasi yang tidak terikat langsung pada tampilan atau segmen URL.
- `utils/supabase/` menyediakan klien Supabase untuk konteks runtime berbeda. Gunakan klien yang sesuai dengan sisi server atau browser.
- `types/` menampung tipe domain yang dipakai lintas komponen dan route.
- `public/` berisi file statis yang dapat dirujuk dengan URL dari root situs.

## Alur halaman publik

1. Pengunjung membuka `/`.
2. `app/page.tsx` mengambil profil, proyek, dan artikel terbit dari Supabase di server. Data proyek dan artikel memakai cache/revalidasi; hasilnya diteruskan ke `components/portfolio/HomeClient.tsx`.
3. `HomeClient` merender bagian **Home**, **Services**, **Works**, **Skills**, **Blog**, dan **Contact**, dengan navigasi bersama dari `HomeHeader` dan bagian penutup dari `HomeFooter`.
4. Saat pengunjung membuka `/blog/[slug]`, halaman artikel mencari artikel berstatus `published` berdasarkan slug, mengambil profil penulis serta rekomendasi artikel, lalu merender konten Markdown.
5. Komponen blog menyediakan kontrol baca/bagikan artikel; navigasi header dan footer menghubungkan halaman publik.

## Alur admin dan data

1. Admin mengirim username dan kata sandi melalui halaman `/login` ke `POST /api/auth/login`.
2. API memeriksa hash kata sandi dengan bcrypt. Jika benar, API membuat JWT sesi dan mengirimkannya dalam cookie `httpOnly` bernama `session`.
3. Middleware memverifikasi cookie tersebut. Pengunjung tanpa sesi yang membuka `/dashboard` diarahkan ke `/login`; sesi aktif yang membuka halaman login diarahkan ke dashboard.
4. Halaman dashboard memuat komponen dalam `components/dashboard/` atau `components/blog/`. Form dan tindakan admin mengirim perubahan ke Route Handler terkait di `/api/profile`, `/api/works`, `/api/skills`, atau `/api/blog`.
5. Route Handler memvalidasi sesi dan input, lalu menggunakan Supabase admin untuk membaca atau mengubah data. Gambar profil, proyek, dan artikel disimpan pada Supabase Storage; URL-nya disimpan bersama data terkait.
6. Permintaan lupa/reset kata sandi menggunakan route auth dan Resend untuk pengiriman tautan reset.

## Tema visual

Tema visual menggunakan gaya **dark, modern, dan bernuansa teknologi**:

- Latar utama `#101415`, teks utama `#e0e3e5`, dan permukaan bertingkat dari gelap ke terang membentuk hierarki panel.
- Cyan `#7bd0ff` menjadi aksen interaksi, tautan, dan ikon; biru pucat `#bec6e0` menjadi aksen primer pendamping.
- Hanken Grotesk dipakai sebagai font isi dan judul umum; Geist dipakai pada label teknis dan elemen bergaya terminal. Keduanya dimuat di `app/layout.tsx`.
- Token warna, tipografi, ukuran, dan radius Tailwind didefinisikan di `tailwind.config.js`. Warna dasar serta animasi dan utilitas global berada di `app/globals.css`.
- Kartu dan panel memakai border tipis, permukaan gelap, sudut membulat, serta blur terbatas. Layout menyesuaikan layar kecil dan besar.
- Animasi reveal menghormati preferensi `prefers-reduced-motion`.

### Berkas rujukan tema

| Kebutuhan | Lokasi |
|---|---|
| Token warna dan tipografi Tailwind | `tailwind.config.js` |
| Warna dasar, animasi, utilitas global, dan gaya Markdown | `src/app/globals.css` |
| Font dan metadata global | `src/app/layout.tsx` |
| Header dan footer portofolio | `src/components/portfolio/` |
| Shell dashboard | `src/components/dashboard/DashboardShell.tsx` |
