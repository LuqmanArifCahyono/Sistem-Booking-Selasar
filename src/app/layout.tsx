// [FRONTEND CHANGE START: Mode Terang Sebagai Mode Utama Default - Milestone 1 Revisi 5]
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SelasarSpace - Sistem Peminjaman Tempat",
  description: "Sistem Peminjaman Tempat dan Fasilitas Selasar Kampus",
  icons: {
    icon: "/hanni.jpg",
    apple: "/hanni.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Script inisialisasi tema: Mode Terang dijadikan mode utama ketika user mengakses */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('selasar_theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F172B] dark:text-[#F8FAFC] antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
// [FRONTEND CHANGE END: Mode Terang Sebagai Mode Utama Default - Milestone 1 Revisi 5]
