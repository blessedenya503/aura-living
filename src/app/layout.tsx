import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#002B7F",
};

export const metadata: Metadata = {
  title: "AURA Living & Skincare — Modern Dermatological Creams & Essential Longevity",
  description:
    "Targeted skin longevity, barrier repair, and 48H deep hydration featuring authentic NIVEA and premier dermatologist formulations.",
  icons: {
    icon: [
      { url: "/favicon.jpg", type: "image/jpeg" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="font-sans antialiased bg-[#FBFBFC] text-slate-900 selection:bg-blue-100 selection:text-[#002B7F]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
