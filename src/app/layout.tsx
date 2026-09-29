import type { Metadata } from "next";
import { Geist, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Font di-host sendiri oleh Next.js (tanpa request ke fonts.googleapis.com,
// jadi tidak ada render-blocking CSS dan rantai jaringan lebih pendek).
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hanken",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-geist",
});

const MATERIAL_SYMBOLS_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

// Stylesheet yang disisipkan lewat script TIDAK render-blocking.
// Class "icons-ready" dipasang setelah font ikon selesai dimuat.
const loadIconsScript = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='${MATERIAL_SYMBOLS_HREF}';l.onload=function(){document.documentElement.classList.add('icons-ready')};document.head.appendChild(l)})();`;

export const metadata: Metadata = {
  title: "Darmawan Suka Prajadiputra",
  description: "Portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`dark ${hankenGrotesk.variable} ${geist.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: loadIconsScript }} />
        <noscript>
          <link rel="stylesheet" href={MATERIAL_SYMBOLS_HREF} />
        </noscript>
      </head>
      <body className="font-body-md text-body-md overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}