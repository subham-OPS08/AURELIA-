# AURÉLIA — Haute Atelier & Luxury Fashion

AURÉLIA is a luxury e-commerce platform built with Next.js 14, Tailwind CSS, Supabase authentication & database, and Razorpay payment integration.

## ✨ Features

- **Quiet Luxury Design**: Architectural layout, serif typography, high-end editorial aesthetics, and smooth Framer Motion micro-interactions.
- **Product Catalog**: Curated luxury apparel, filters by category/material/price, search modal, and quick-view drawer.
- **Interactive Cart & Checkout**: Slide-out cart drawer, dynamic subtotal calculations, and Razorpay payment gateway integration.
- **Supabase Authentication**: User sign-in, sign-up with email/password and OAuth support.
- **Responsive & Accessible**: Optimized for all viewports from mobile to ultra-wide displays.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd CLOTHING
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your credentials:

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

MIT License.
