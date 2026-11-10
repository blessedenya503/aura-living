# AURA SKIN — Skincare E-Commerce Platform

A full-stack direct-to-consumer (D2C) skincare storefront with a private owner portal. It's built for Nigerian and international customers, with Naira and USD checkout, tracked courier delivery, and dropship sourcing from Amazon, CJdropshipping, and Alibaba.

**Live site:** https://auraskinng.vercel.app

---

## ✨ Features Overview

### 🛍️ Customer Storefront (`/`)
* **Hero Trends Showcase:** A viral TikTok trend spotlight with Framer Motion effects. The featured product is chosen in the owner portal.
* **Verified Product Catalog:** 180+ brand products (CeraVe, La Roche-Posay, The Ordinary, COSRX, Beauty of Joseon, Anua, Eucerin, Avène, Bioderma, Tatcha, Drunk Elephant, and more), each with a matching studio packshot in `public/uploads/products/`.
* **Live Gemini AI Search (`⌘K`):** Search by ingredient or skin concern in plain language. Before you type, it shows curated bestsellers.
* **Multi-Currency Engine:** Live conversion across USD, EUR, GBP, CAD, AUD, NGN, and JPY.
* **Night Recovery Sweep:** Switches between day and night themes.
* **Customer Authentication Portal (`/login`):** Split-screen account portal with Google & Social Media social logins (Better Auth).
* **Express Order Tracking (`/track-order`):** Look up a parcel's timeline by order ID or waybill number.
* **Info Pages:** `/about`, `/shipping`, `/returns`, `/privacy`, `/terms`.

### 💳 Checkout & Payments
The checkout modal shows four payment options in a 2×2 grid:

| Option | Gateway | Best for |
| --- | --- | --- |
| **Bank Transfer / USSD** | Paystack | Nigerian customers paying from any banking app (OPay, Kuda, GTB, Zenith, Access…). Paystack shows a temporary account number to transfer to. |
| **Debit / Credit Card** | Paystack | Visa, Mastercard, and Verve cards with 3D Secure OTP |
| **Apple Pay / Google Pay** | Paystack | One-tap Face ID / Touch ID payment on supported devices |
| **PayPal** | PayPal (USD) | International customers paying from a PayPal balance or card |

* After a successful payment, the order is saved, a confirmation email is sent (Resend), and the customer lands on `/checkout/success`.
* Delivery estimates: **Lagos & Abuja 1–2 days · Other states 2–4 days · International 5–10 days**, with tracking on every order.

### 🛡️ Private Owner Command Portal (`/owner-portal`)
* **Live Revenue & Profit Dashboard:** Shows gross revenue, supplier wholesale costs, net profit, and margin %.
* **Balance & Payouts:** Your Nigerian bank payout account (verified through Paystack, T+1 Naira settlements) and your **PayPal account** (email, PayPal.Me link, account holder) sit side by side. You can edit either one at any time.
* **Brand Catalog Import:** Search verified brand catalogs and add them to the storefront one at a time or in bulk.
* **Amazon Prime Direct Portal:** Search Amazon US live through Rainforest API and import products in one click.
* **CJdropshipping Live Gateway:** CJ API v2.0 wholesale pricing, inventory lookup, and warehouse fulfillment.
* **Alibaba Dropshipping Center:** A sourcing directory for Trade Assurance OEM formulas.
* **Live Catalog Manager:** Edit prices, stock, supplier costs, and margins, with search, supplier filter, and pagination.
* **Customer Orders & Courier Hub:** Update fulfillment status, assign a courier (GIG Logistics, DHL Express, Speedaf, Fez Delivery, Royal Mail), and generate waybills.
* **Clinical Slideshow Manager:** Create before-and-after slides with image upload.
* **Analytics:** Google Analytics 4 events for page views, add-to-cart, checkout, and purchase.
* **Weekly Catalog Refresh:** A scheduled sync for supplier stock, exchange rates, and trending flags.
* **Antigravity Studio Editor:** An in-portal code editor with Gemini assistance and a live preview.

---

## 🚀 Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide](https://lucide.dev/)
* **Database:** [Neon Postgres](https://neon.tech/) (`store_state` table), with `src/data/store-db.json` as a local fallback
* **Auth:** [Better Auth](https://www.better-auth.com/) (customers) + signed admin session (owner portal)
* **Payments:** [Paystack](https://paystack.com/) (NGN), [PayPal](https://www.paypal.com/) (USD); `flutterwave-node-v3` is installed for future use
* **Email:** [Resend](https://resend.com/)
* **AI:** [Google Gemini API](https://ai.google.dev/)
* **Sourcing:** [Rainforest API](https://www.rainforestapi.com/) (Amazon), [CJdropshipping API v2.0](https://developers.cjdropshipping.com/)
* **Hosting:** [Vercel](https://vercel.com/) + Vercel Analytics

---

## 🛠️ Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/blessedenya503/aura-living.git
cd aura-living
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Generate a session secret (32+ characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then fill in `.env.local`:
```env
# Owner portal authentication (required)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=replace-with-a-unique-strong-password
ADMIN_SESSION_SECRET=replace-with-a-random-secret-at-least-32-characters-long

# Database (Neon Postgres)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host/db?sslmode=require

# Customer auth (Better Auth + Google)
BETTER_AUTH_SECRET=replace-with-a-random-secret
BETTER_AUTH_URL=http://localhost:3003
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_AUTH=true

# Payments
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYPAL_MERCHANT_EMAIL=your-paypal@email.com   # fallback if not set in the owner portal

# Email
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=orders@yourdomain.com

# Optional integrations
GEMINI_API_KEY=your_gemini_api_key
CJ_API_KEY=your_cj_api_key
RAINFOREST_API_KEY=your_rainforest_api_key

NEXT_PUBLIC_SITE_URL=http://localhost:3003
```

> Never commit `.env.local` or real credentials. On Vercel, add these under **Project → Settings → Environment Variables**.

### 4. Run the Development Servers
```bash
npm run dev            # storefront + owner portal via server.js
# or individually:
npm run dev:store      # storefront on :3003
npm run dev:portal     # owner portal on :3002
```

Open:
* **Storefront:** http://localhost:3003
* **Customer Login:** http://localhost:3003/login
* **Owner Portal:** http://localhost:3002/owner-portal

The admin login stays disabled until all three `ADMIN_*` variables are set.

---

## 📂 Project Structure

```
├── public/
│   └── uploads/products/    # Product packshot images (<product-id>.jpg)
├── src/
│   ├── app/
│   │   ├── api/             # admin, paystack, checkout, orders, store, cj, ai-search, auth, media…
│   │   ├── checkout/        # Payment success page
│   │   ├── login/           # Customer account portal
│   │   ├── owner-portal/    # Private store management dashboard
│   │   ├── product/         # Product detail pages
│   │   ├── track-order/     # Courier tracking page
│   │   └── page.tsx         # Storefront home page
│   ├── components/          # CheckoutModal, PaymentLogos, Navbar, Hero, Studio…
│   │   └── ui/              # shadcn primitives
│   ├── context/             # CartContext, currency, theme
│   ├── data/                # products.ts + store-db.json (local fallback DB)
│   └── lib/                 # store-db (Neon sync), auth, email, helpers
├── next.config.ts           # Includes outputFileTracingExcludes to keep serverless bundles small
└── tsconfig.json
```

---

## 🗄️ Data Persistence

The live store reads and writes its state (products, orders, settings, linked bank and PayPal accounts) from Neon Postgres (`store_state`, key `current_store_db`). `src/data/store-db.json` is used only when the database can't be reached.

> **Important:** Editing `store-db.json` or `products.ts` alone does **not** change the live site. Make changes through the owner portal, or sync them to Neon.

---

## ⚠️ Known Limitations

* **PayPal payments aren't verified on the server yet.** Checkout sends customers to PayPal's standard payment page, but when they return, the order is marked *Paid* without checking with PayPal. Before relying on PayPal for real sales, add PayPal REST API / webhook (IPN) verification, or confirm each PayPal order in your PayPal dashboard before shipping.
* **Apple Pay through Paystack** has to be enabled on your Paystack account, and your domain must be registered with Paystack. Until then, Paystack falls back to card or bank transfer.

---

## 📄 License
MIT License. Free for commercial and personal use.
