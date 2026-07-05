import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darmawan | Web Developer Portfolio",
  description: "Portfolio pribadi Darmawan, Web Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Geist:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-body-md overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}