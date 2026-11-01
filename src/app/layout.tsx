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
    default: "AURA SKIN NIGERIA — 100% Authentic COSRX, CeraVe, Anua & La Roche-Posay",
    template: "%s | AURA SKIN NIGERIA",
  },
  description:
    "Shop original, verified skincare brands in Nigeria: COSRX Snail Mucin, CeraVe, Anua Heartleaf, Beauty of Joseon SPF & La Roche-Posay. Fast 24-48h tracked doorstep delivery in Lagos, Abuja & nationwide.",
  keywords: [
    "AURA SKIN NIGERIA",
    "auraskinng",
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
    "genuine skincare store Lagos",
    "barrier repair cream",
    "hyperpigmentation serum",
  ],
  applicationName: "AURA SKIN NIGERIA",
  authors: [{ name: "AURA SKIN NIGERIA", url: SITE_URL }],
  creator: "AURA SKIN NIGERIA",
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
    siteName: "AURA SKIN NIGERIA",
    title: "AURA SKIN NIGERIA — 100% Authentic Skincare Formulations",
    description:
      "Shop original verified skincare products from CeraVe, La Roche-Posay, COSRX, The Ordinary & Anua. Fast tracked delivery across Nigeria.",
    images: [
      {
        url: "/favicon.jpg",
        width: 800,
        height: 800,
        alt: "AURA SKIN NIGERIA — Authentic Skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA SKIN NIGERIA — 100% Authentic Skincare Formulations",
    description:
      "Shop original verified skincare products from CeraVe, La Roche-Posay, COSRX, The Ordinary & Korean skincare brands.",
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
      name: "AURA SKIN NIGERIA",
      alternateName: ["Aura Skin", "auraskinng", "auraskinng.vercel.app"],
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.jpg`,
      image: `${SITE_URL}/favicon.jpg`,
      description:
        "Authentic skincare store in Nigeria featuring original COSRX, CeraVe, La Roche-Posay, The Ordinary, Anua, and Beauty of Joseon.",
      currenciesAccepted: "NGN, USD",
      paymentAccepted: "Debit Card, Bank Transfer, USSD, Paystack",
      priceRange: "$$",
      areaServed: [
        { "@type": "Country", name: "Nigeria" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AURA SKIN NIGERIA",
      alternateName: ["auraskinng", "Aura Skin Nigeria"],
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
