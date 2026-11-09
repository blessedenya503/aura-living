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
  title: "NovaHost — Next-Gen Cloud & Web Hosting Platform",
  description: "Ultra-fast NVMe cloud hosting, 1-click deployments, and the revolutionary NovaPanel. Modern simplicity meets raw performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0c14] text-[#f1f2f8] selection:bg-[#6c5ce7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
