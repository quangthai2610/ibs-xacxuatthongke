import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Xác Xuất Thống Kê",
  description: "Ứng dụng tính điểm Tiến Lên tối ưu cho thiết bị di động",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Xác Xuất Thống Kê",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { BottomNav } from "@/components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${nunito.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900 flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative shadow-xl overflow-x-hidden">
          <main className="flex-1 flex flex-col pb-[env(safe-area-inset-bottom)]">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
