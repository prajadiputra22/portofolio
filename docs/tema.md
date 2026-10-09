# Tema Visual

## Gambaran umum

Portofolio ini memakai tema **dark, modern, dan bernuansa teknologi**. Latar gelap menjadi dasar agar aksen cyan/biru terang menonjol. Tampilan menggunakan panel berlapis, garis batas tipis, dan efek blur untuk memberi kesan antarmuka digital yang rapi tanpa mengurangi keterbacaan.

Tema diterapkan pada halaman portofolio publik dan dashboard admin, dengan pola navigasi yang menyesuaikan ukuran layar.

## Palet warna

| Peran | Warna | Penggunaan |
|---|---|---|
| Background | `#101415` | Latar utama halaman |
| Surface paling gelap | `#0b0f10` | Footer dan area navigasi dashboard |
| Surface | `#191c1e`, `#1d2022`, `#272a2c` | Kartu, panel, dan lapisan konten |
| Surface terang | `#323537`, `#363a3b` | Hover, batas, dan elemen interaktif |
| Teks utama | `#e0e3e5` | Judul dan isi utama |
| Teks sekunder | `#c6c6cd` | Deskripsi dan teks pendukung |
| Aksen primer | `#bec6e0` | Aksen kebiruan pada elemen utama |
| Aksen sekunder | `#7bd0ff` | Tautan, ikon, tombol, dan penekanan |
| Aksen sekunder dasar | `#00a6e0` | Variasi cyan untuk container |
| Aksen tersier | `#b9c8de` | Aksen pelengkap |
| Error | `#ffb4ab` | Pesan dan status kesalahan |

Warna-warna ini didefinisikan terutama pada `tailwind.config.js`; warna latar dan teks dasar juga tersedia sebagai variabel CSS di `src/app/globals.css`.

## Tipografi

- **Hanken Grotesk** digunakan untuk teks isi dan sebagian besar judul.
- **Geist** digunakan untuk label teknis, navigasi, dan gaya mono/terminal.
- Teks navigasi cenderung kapital, berjarak huruf lebar, dan memakai ukuran kecil.
- Hirarki ukuran yang dikonfigurasi mencakup caption 12 px, body 14–18 px, judul 32 px, dan display 40–64 px.

Font dimuat melalui `next/font` di `src/app/layout.tsx`.

## Komponen dan gaya antarmuka

- Header publik menempel di bagian atas dengan latar transparan, blur, dan garis pemisah.
- Kartu proyek memakai permukaan gelap, sudut membulat, batas tipis, serta efek hover.
- Panel tertentu menggunakan efek **glass** (`backdrop-filter: blur`) untuk memberi kedalaman.
- Ikon dan tautan interaktif memakai aksen cyan/biru.
- Animasi hero dan reveal saat scroll digunakan secara ringan; animasi dimatikan saat pengguna mengaktifkan preferensi reduced motion.
- Layout responsif: navigasi desktop menjadi drawer/menu pada layar kecil; dashboard memakai sidebar di desktop dan drawer di mobile.

## Bagian halaman publik

Urutan konten utama di halaman beranda:

1. **Home / Hero** — sapaan, headline, ringkasan profil, dan avatar.
2. **Services** — layanan Front End, Backend, dan Fullstack.
3. **Works** — daftar proyek dan skill yang terkait.
4. **Skills** — daftar teknologi.
5. **Contact** — informasi kontak dan formulir.
6. **Footer** — identitas serta tautan media sosial.

Informasi profil dan proyek pada halaman publik dibaca dari Supabase. Sebagian daftar skill teknologi ditampilkan sebagai konten statis di komponen halaman.
