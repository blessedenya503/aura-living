import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://auraskinng.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AURA.STORE — Authentic Clinical Skincare, CeraVe, La Roche-Posay & COSRX",
    template: "%s | AURA.STORE",
  },
  description:
    "Shop 100% authentic dermatologist-approved skincare at AURA.STORE. Official formulations from CeraVe, La Roche-Posay, COSRX, The Ordinary, Eucerin, Anua, Beauty of Joseon & NIVEA. Fast tracked delivery across Lagos, Abuja, Nigeria & Worldwide.",
  keywords: [
    "AURA.STORE",
    "aura.store",
    "aura store",
    "aura skincare",
    "skincare store in Nigeria",
    "authentic skincare Lagos",
    "buy CeraVe in Nigeria",
    "La Roche-Posay Nigeria",
    "COSRX Snail Mucin Nigeria",
    "The Ordinary skincare Nigeria",
    "Korean skincare Nigeria",
    "Anua Heartleaf Toner",
    "Beauty of Joseon SPF",
    "clinical skincare store",
    "barrier repair cream",
    "hyperpigmentation treatment",
    "dermatologist recommended skincare",
  ],
  applicationName: "AURA.STORE",
  authors: [{ name: "AURA.STORE Clinical Skincare", url: SITE_URL }],
  creator: "AURA.STORE",
  publisher: "AURA.STORE",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "ZMitjLvyAD_S_KyhMM5_omiT3DRaO1tRAXpAufOLakk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "AURA.STORE",
    title: "AURA.STORE — Authentic Clinical Skincare & Dermatological Formulations",
    description:
      "Shop 440+ authentic dermatologist-tested skincare formulations from CeraVe, La Roche-Posay, COSRX, The Ordinary & Anua. Express tracked delivery.",
    images: [
      {
        url: "/favicon.jpg",
        width: 800,
        height: 800,
        alt: "AURA.STORE — Clinical Skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA.STORE — Authentic Clinical Skincare & Barrier Repair",
    description:
      "Shop 440+ authentic dermatologist-tested skincare products from CeraVe, La Roche-Posay, COSRX, The Ordinary & Korean skincare brands.",
    images: ["/favicon.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.jpg", type: "image/jpeg" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#organization`,
      name: "AURA.STORE",
      alternateName: ["Aura Store", "AURA Clinical Skincare", "aura.store"],
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.jpg`,
      image: `${SITE_URL}/favicon.jpg`,
      description:
        "Authentic dermatologist-approved skincare store featuring CeraVe, La Roche-Posay, COSRX, The Ordinary, Eucerin, Anua, Beauty of Joseon, and NIVEA.",
      currenciesAccepted: "NGN, USD, GBP, EUR",
      paymentAccepted: "Credit Card, Debit Card, Bank Transfer, Apple Pay, Paystack",
      priceRange: "$$",
      areaServed: [
        { "@type": "Country", name: "Nigeria" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AURA.STORE",
      alternateName: ["aura.store", "Aura Store Skincare"],
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="https://js.paystack.co/v1/inline.js" async />
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7JFVGY12S2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7JFVGY12S2', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-[#FBFBFC] text-slate-900 selection:bg-blue-100 selection:text-[#002B7F]">
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
