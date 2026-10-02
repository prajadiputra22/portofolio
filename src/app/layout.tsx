import type { Metadata } from "next";
import { Geist, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

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
      <head />
      <body className="font-body-md text-body-md overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}