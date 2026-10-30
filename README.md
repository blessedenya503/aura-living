# AURA — Skincare E-Commerce Platform

A modern, full-stack, high-conversion direct-to-consumer (D2C) e-commerce storefront and private administration portal designed for viral beauty, health, and medical-grade skincare brands.

---

## ✨ Features Overview

### 🛍️ Customer Storefront (`/`)
* **Hero Trends Showcase:** Dynamic viral trend spotlight with Framer Motion blend effects, TikTok branding, and real-time statistics.
* **Animated Glitch Text:** Authentic viral TikTok chromatic glitch effect (`#FE2C55`, `#25F4EE`, `#FFFFFF`).
* **Live Gemini AI Search (`⌘K`):** Natural language ingredient search, formula analysis, and zero-state curated bestsellers.
* **Multi-Currency Engine:** Instant real-time conversion rates across USD, EUR, GBP, CAD, AUD, NGN, and JPY.
* **Night Recovery Sweep:** Ambient day/night circadian theme switch.
* **Customer Authentication Portal (`/login`):** Split-screen customer account portal with Google & X social logins.
* **Express Order Tracking (`/track-order`):** Multi-carrier parcel timeline lookup with real-time status updates.

### 🛡️ Private Owner Command Portal (`/owner-portal`)
* **Live Revenue & Profit Dashboard:** Real-time Gross Revenue, Supplier Wholesale Costs, Net Profit, and Margin % calculations.
* **Amazon Prime Direct Portal:** Real-time Amazon US product search powered by Rainforest API (live ASINs, Prime seller prices, customer ratings, 1-click catalog import).
* **Alibaba Dropshipping Center:** Direct sourcing directory for Trade Assurance OEM skincare formulas and high-margin beauty tools.
* **CJdropshipping Live Gateway:** Live API v2.0 integration with factory wholesale rates, inventory lookup, and automated warehouse fulfillment mapping.
* **Interactive Packshot Studio:** In-browser image editor with lighting matrices, rotation, luxury badge stamping, and Gemini AI image generation.
* **Clinical Slideshow Manager:** Dynamic Before & After slide creator with live image upload and instrument metrics tracking.
* **Customer Order & Dispatch Management:** Real-time order fulfillment status updater (Processing, In Transit, Delivered) with tracking number generator.

---

## 🚀 Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Components & Primitives:** [shadcn/ui](https://ui.shadcn.com/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/)
* **AI Engine:** [Google Gemini API](https://ai.google.dev/)
* **Amazon Data:** [Rainforest API](https://www.rainforestapi.com/)
* **Fulfillment:** [CJdropshipping API v2.0](https://developers.cjdropshipping.com/)
* **Language:** TypeScript

---

## 🛠️ Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aura-skincare-ecommerce.git
cd aura-skincare-ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Set a unique admin email and password, and generate a random session secret of at least 32 characters. Add provider keys only for integrations you plan to use. Never commit `.env.local` or real credentials.

For example, generate a session secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Configure these values in `.env.local`:
```env
# Required for owner portal authentication
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=replace-with-a-unique-strong-password
ADMIN_SESSION_SECRET=replace-with-a-random-secret-at-least-32-characters-long

# Optional integrations
CJ_API_KEY=your_cj_api_key_here
RAINFOREST_API_KEY=your_rainforest_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3003
```

Paystack checkout requires `PAYSTACK_SECRET_KEY`; the API returns an error when the key is missing instead of simulating a successful payment.

The owner portal is available at `http://localhost:3002/owner-portal`; the storefront runs at `http://localhost:3003`. The admin login is disabled until all three admin variables are set.

### 4. Run the Development Servers
```bash
npm run dev
```

Open your browser:
* **Storefront:** [http://localhost:3003](http://localhost:3003)
* **Customer Login:** [http://localhost:3003/login](http://localhost:3003/login)
* **Owner Portal:** [http://localhost:3002/owner-portal](http://localhost:3002/owner-portal)

---

## 📂 Project Structure

```
├── data/                    # Persistent local uploads and media cache
├── src/
│   ├── app/                 # Next.js 15 App Router pages & API routes
│   │   ├── api/             # Backend routes (Amazon, CJ, Store, Media, Auth)
│   │   ├── login/           # Customer account authentication portal
│   │   ├── owner-portal/    # Private store management dashboard
│   │   ├── track-order/     # Customer courier tracking page
│   │   └── page.tsx         # Main storefront home page
│   ├── components/          # Composite feature components (Hero, Navbar, Studio, etc.)
│   │   └── ui/              # shadcn atomic UI primitives (GlitchText, Typewriter, etc.)
│   ├── context/             # React Context providers (CartContext, Currency, Theme)
│   ├── data/                # Store catalog database & initial products
│   └── lib/                 # Utility helpers, API clients, and auth tokens
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS theme configurations
└── tsconfig.json            # TypeScript compiler configuration
```

---

## 📄 License
MIT License. Free for commercial and personal use.
