# ElectroMart — Frontend
# Live: [https://electromart-frontend-jet.vercel.app]

> **Production-grade multi-vendor electronics marketplace** built with Next.js 15, TypeScript, Tailwind CSS v4, Redux Toolkit, Framer Motion, and shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-black?style=flat-square&logo=framer)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Route Architecture](#route-architecture)
- [Dashboard Modules](#dashboard-modules)
- [Design System](#design-system)
- [Key Patterns](#key-patterns)
- [Scripts](#scripts)
- [Backend Repository](#backend-repository)

---

## Overview

ElectroMart is a fully-featured, role-based e-commerce platform for multi-vendor electronics retail. The frontend is built entirely with the Next.js App Router, using server components for data fetching and client components only where interactivity is needed.

**Three user roles — three separate dashboard experiences:**

| Role | Dashboard | Access |
|---|---|---|
| `SUPER_ADMIN` | `/dashboard/admin` | Full platform management |
| `VENDOR` | `/dashboard/vendor` | Store, products, orders, earnings |
| `CUSTOMER` | `/dashboard/customer` | Orders, wishlist, reviews, addresses |

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State Management | Redux Toolkit |
| Animation | Framer Motion 11 |
| Charts | Recharts |
| UI Components | shadcn/ui |
| Form Validation | Zod |
| Notifications | Sonner |
| Icons | Lucide React |
| HTTP Client | Axios |
| Payment | SSLCommerz + Stripe |

---

## Features

### Storefront
- 🏠 **Homepage** — Hero banner, category grid, vendor bento grid with offer badges, featured products, bestsellers, flash sale section, popular products with filter tabs, top vendors, top brands with infinite marquee, CTA bento grid, deals banner, testimonials
- 🛍️ **Product listing** — Filters (category, brand, price range, rating), sort, grid/list toggle, active filter chips
- 📦 **Product detail** — Image gallery, variant selection, add to cart, wishlist, specs/reviews tabs, related products
- 🔍 **Search** — Debounced full-text search with quick suggestions
- 🛒 **Cart** — Quantity stepper, remove items, coupon codes, free shipping progress, live order summary
- 💳 **Checkout** — 3-step flow: Address → Payment → Review. Card UI with live preview, cash on delivery
- ✅ **Order confirmation** — Full order summary with tracking timeline

### Authentication
- 📧 Email/password sign in with JWT
- 📝 Registration with Customer/Vendor role selection
- 🔑 Forgot password → email link → reset
- 🛡️ Edge middleware route protection
- 🎭 Demo credentials for quick testing

### Admin Dashboard
- 📊 Overview with revenue charts (Line, Bar, Pie via Recharts)
- 👥 User management — ban/unban, role display, view modal
- 🏪 Vendor management — approve/revoke, view modal
- 📦 Product moderation — publish/unpublish, view modal
- 🛒 Order management — inline status update dropdown, full detail modal
- 🏷️ Category & Brand CRUD — card grid with hover edit/delete, add/edit modals
- ⚙️ Admin settings — Profile, Store config, Security, Notifications tabs

### Vendor Dashboard
- 📈 Overview — revenue chart, recent orders, top products, quick actions
- 📦 Product management — full CRUD with image URL, category, stock, publish/feature toggles
- 🛒 Order management — inline status dropdown, detail modal with address/payment
- 📊 Inventory — inline stock editing (Enter to save, Escape to cancel), color-coded stock bars, low stock alert banner
- 💰 Earnings — gross vs net area chart, transaction list, payout history, request payout modal
- 🏪 Store profile — General info, Policies (return/shipping), Danger zone
- ⚙️ Vendor settings — Account (business name, tax ID, payout cycle), Notifications, Security
- 👤 Vendor profile — Personal info, public store preview card

### Customer Dashboard
- 🏠 Overview — stats, recent orders, notifications, wishlist preview, quick links
- 📦 Orders — status filter, order list, detail modal with tracking timeline
- ❤️ Wishlist — grid with remove, add to cart, discount badges
- ⭐ Reviews — list with edit modal (star picker), delete
- 📍 Addresses — CRUD with home/office/other labels, default setter
- 🔔 Notifications — type filter, mark read, mark all read, delete
- ⚙️ Customer settings — Preferences (language, currency, toggles), Notifications, Security
- 👤 Customer profile — Personal info, stats card, verification status

### Payment Result Pages
- ✅ Success — full order summary, items, address, estimated delivery, confirmation email note
- ❌ Fail — failure reasons, order summary, retry CTA
- 🚫 Cancel — "order saved" reassurance, 24-hour hold info, resume CTA

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn / pnpm
- ElectroMart Backend running locally (see [backend repo](#backend-repository))

### Installation

```bash
# Clone the repository
git clone https://github.com/itstumpa/electromart-frontend.git
cd electromart-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The backend should be running on `http://localhost:5000` (or match your `NEXT_PUBLIC_API_URL`).

---

## Environment Variables

Create a `.env.local` file in the root:

```bash
# Backend API base URL (include /api/v1)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Next.js public URL (used by backend SSLCommerz redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: enable Redux DevTools in production
NEXT_PUBLIC_REDUX_DEVTOOLS=false
```

> **Never commit `.env.local` to version control.** Add it to `.gitignore`.

---

## Folder Structure

```
electromart-frontend/
│
├── app/                              # Next.js App Router
│   │
│   ├── (auth)/                       # Route group — no navbar/footer
│   │   ├── layout.tsx                # Clean auth layout (logo only)
│   │   ├── login/
│   │   │   └── page.tsx              # /login — with demo credentials
│   │   ├── register/
│   │   │   └── page.tsx              # /register — customer/vendor role select
│   │   └── forgot-password/
│   │       └── page.tsx              # /forgot-password — 2-step email flow
│   │
│   ├── (main)/                       # Route group — MainNavbar + MainFooter
│   │   ├── layout.tsx                # Public storefront layout
│   │   ├── page.tsx                  # / — Homepage (all sections)
│   │   ├── products/
│   │   │   ├── page.tsx              # /products — listing with filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # /products/:slug — product detail
│   │   ├── sale/
│   │   │   └── page.tsx              # /sale — discounted products
│   │   ├── about/
│   │   │   └── page.tsx              # /about — company story, team
│   │   ├── contact/
│   │   │   └── page.tsx              # /contact — form, FAQ, map
│   │   ├── search/
│   │   │   └── page.tsx              # /search — debounced search
│   │   ├── cart/
│   │   │   └── page.tsx              # /cart — cart with coupon
│   │   ├── checkout/
│   │   │   └── page.tsx              # /checkout — 3-step flow
│   │   └── order-confirmation/
│   │       └── [id]/
│   │           └── page.tsx          # /order-confirmation/:id
│   │
│   ├── (payment)/                    # Route group — minimal layout
│   │   ├── layout.tsx                # Logo + "Secure Payment" only
│   │   └── payment/
│   │       ├── success/
│   │       │   └── page.tsx          # /payment/success?orderId=xxx
│   │       ├── fail/
│   │       │   └── page.tsx          # /payment/fail?orderId=xxx
│   │       └── cancel/
│   │           └── page.tsx          # /payment/cancel?orderId=xxx
│   │
│   ├── dashboard/                    # Shared dashboard shell
│   │   ├── layout.tsx                # Passthrough — sub-layouts handle role
│   │   │
│   │   ├── admin/                    # /dashboard/admin/*
│   │   │   ├── layout.tsx            # Admin shell (SUPER_ADMIN sidebar)
│   │   │   ├── page.tsx              # Overview + analytics
│   │   │   ├── users/page.tsx        # User management
│   │   │   ├── vendors/page.tsx      # Vendor approval
│   │   │   ├── products/page.tsx     # Product moderation
│   │   │   ├── orders/page.tsx       # Order management
│   │   │   ├── categories/page.tsx   # Categories & brands CRUD
│   │   │   └── settings/page.tsx     # Admin settings (4 tabs)
│   │   │
│   │   ├── vendor/                   # /dashboard/vendor/*
│   │   │   ├── layout.tsx            # Vendor shell (VENDOR sidebar)
│   │   │   ├── page.tsx              # Overview + revenue chart
│   │   │   ├── products/page.tsx     # Product CRUD (card grid)
│   │   │   ├── orders/page.tsx       # Order management + status update
│   │   │   ├── inventory/page.tsx    # Stock table with inline edit
│   │   │   ├── earnings/page.tsx     # Earnings chart + payout history
│   │   │   ├── store/page.tsx        # Store profile (3 tabs)
│   │   │   ├── settings/page.tsx     # Vendor settings (3 tabs)
│   │   │   └── profile/page.tsx      # Personal profile + store preview
│   │   │
│   │   └── customer/                 # /dashboard/customer/*
│   │       ├── layout.tsx            # Customer shell (CUSTOMER sidebar)
│   │       ├── page.tsx              # Overview + stats
│   │       ├── orders/page.tsx       # My orders + tracking modal
│   │       ├── wishlist/page.tsx     # Wishlist grid
│   │       ├── reviews/page.tsx      # My reviews + edit modal
│   │       ├── addresses/page.tsx    # Address book CRUD
│   │       ├── notifications/page.tsx # Notifications with filter
│   │       ├── settings/page.tsx     # Customer settings (3 tabs)
│   │       └── profile/page.tsx      # Personal profile + stats
│   │
│   ├── error.tsx                     # Global error boundary
│   ├── loading.tsx                   # Global skeleton loader
│   └── not-found.tsx                 # Custom 404 page
│
├── components/
│   │
│   ├── common/
│   │   └── Reveal.tsx                # Scroll-triggered animation wrapper
│   │
│   ├── layout/
│   │   ├── main/
│   │   │   ├── TopBar.tsx            # Announcement bar
│   │   │   ├── MainNavbar.tsx        # Storefront nav with cart/search
│   │   │   └── MainFooter.tsx        # Site footer
│   │   └── dashboard/
│   │       ├── DashboardSidebar.tsx  # Role-aware sidebar (all 4 roles)
│   │       └── DashboardTopbar.tsx   # Role-aware topbar with notifications
│   │
│   ├── features/
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx        # Hero with floating product cards
│   │   │   ├── CategoryGrid.tsx      # Category bento grid
│   │   │   ├── VendorBentoGrid.tsx   # Multi-vendor bento + offer badges
│   │   │   ├── FeaturedProducts.tsx  # Featured product carousel
│   │   │   ├── BestSellers.tsx       # Bestseller grid
│   │   │   ├── OnSale.tsx            # Sale items strip
│   │   │   ├── PopularProducts.tsx   # Filterable product grid
│   │   │   ├── TopVendors.tsx        # Vendor cards with stats
│   │   │   ├── TopBrands.tsx         # Brand cards + marquee strip
│   │   │   ├── CTABentoGrid.tsx      # Vendor signup + app + newsletter
│   │   │   ├── DealsBanner.tsx       # Promotional deals banner
│   │   │   └── TestimonialsSection.tsx # Customer reviews carousel
│   │   └── product/
│   │       ├── ProductCard.tsx       # Reusable product card
│   │       ├── ProductGallery.tsx    # Image gallery with thumbnails
│   │       ├── ProductActions.tsx    # Qty, add to cart, wishlist
│   │       └── ProductTabs.tsx       # Specs / reviews tabs
│   │
│   └── dashboard/
│       ├── admin/
│       │   ├── AdminDataTable.tsx    # Generic table (search/sort/paginate)
│       │   ├── ConfirmModal.tsx      # Reusable danger/confirm dialog
│       │   ├── StatCard.tsx          # Server — stat display card
│       │   ├── RevenueChart.tsx      # Client — Recharts area+bar+pie
│       │   ├── settings/
│       │   │   └── AdminSettingsPage.tsx
│       │   ├── users/UsersClient.tsx
│       │   ├── vendors/VendorsClient.tsx
│       │   ├── products/ProductsClient.tsx
│       │   ├── orders/OrdersClient.tsx
│       │   └── categories/CategoriesClient.tsx
│       ├── vendor/
│       │   ├── VendorRevenueChart.tsx
│       │   ├── products/ProductsClient.tsx
│       │   ├── orders/OrdersClient.tsx
│       │   ├── inventory/InventoryClient.tsx
│       │   ├── earnings/EarningsClient.tsx
│       │   ├── store/StoreClient.tsx
│       │   ├── settings/SettingsClient.tsx
│       │   └── profile/ProfileClient.tsx
│       └── customer/
│           ├── orders/OrdersClient.tsx
│           ├── wishlist/WishlistClient.tsx
│           ├── reviews/ReviewsClient.tsx
│           ├── addresses/AddressesClient.tsx
│           ├── notifications/NotificationsClient.tsx
│           ├── settings/SettingsClient.tsx
│           └── profile/ProfileClient.tsx
│
├── hooks/
│   └── useInView.ts                  # IntersectionObserver for scroll animations
│
├── data/
│   └── mock-data.ts                  # Dev mock data (swap with API calls)
│
├── types/
│   ├── index.ts                      # Shared TypeScript types
│   ├── api.ts                        # API response types
│   └── auth.ts                       # Auth-specific types
│
├── lib/
│   ├── api.ts                        # Axios instance + interceptors
│   └── utils.ts                      # cn() and shared utilities
│
├── api/
│   └── auth.api.ts                   # Auth API service functions
│
├── store/
│   ├── store.ts                      # Redux store configuration
│   └── slices/
│       └── authSlice.ts              # Auth state (user, token, role)
│
├── utils/
│   ├── api-error.ts                  # Error message extractor
│   └── auth-storage.ts              # LocalStorage auth helpers
│
├── middleware.ts                     # Next.js edge middleware (route protection)
│
├── public/                           # Static assets
│
├── .env.example                      # Environment variable template
├── .gitignore
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration + custom animations
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

---

## Route Architecture

Next.js **Route Groups** (folders with parentheses) are URL-invisible — they only share layouts:

```
(auth)/login/page.tsx    → URL: /login        (no navbar/footer)
(main)/products/page.tsx → URL: /products     (with navbar + footer)
(payment)/payment/...   → URL: /payment/...  (minimal layout)
dashboard/admin/...     → URL: /dashboard/admin (admin sidebar)
```

### Layout Inheritance

```
app/layout.tsx                  ← always applied (html, body, fonts, providers)
  ├── (auth)/layout.tsx         ← auth pages: logo only
  ├── (main)/layout.tsx         ← storefront: MainNavbar + MainFooter
  ├── (payment)/layout.tsx      ← payment results: minimal
  └── dashboard/
        ├── admin/layout.tsx    ← SUPER_ADMIN sidebar + topbar
        ├── vendor/layout.tsx   ← VENDOR sidebar + topbar
        └── customer/layout.tsx ← CUSTOMER sidebar + topbar
```

### Route Protection

Edge middleware (`middleware.ts`) runs before every request:
- `/dashboard/*` → requires valid JWT token
- Role mismatch (customer accessing `/dashboard/admin`) → redirected to own dashboard
- Unauthenticated → redirected to `/login`

---

## Dashboard Modules

### Admin (`/dashboard/admin`)

| Route | Module |
|---|---|
| `/dashboard/admin` | Overview — revenue chart, recent orders, top products, quick stats |
| `/dashboard/admin/users` | User management — list, ban/unban, role view |
| `/dashboard/admin/vendors` | Vendor approval — approve/revoke, store details |
| `/dashboard/admin/products` | Product moderation — publish/unpublish |
| `/dashboard/admin/orders` | Order management — inline status update |
| `/dashboard/admin/categories` | Categories & brands — full CRUD with card grid |
| `/dashboard/admin/settings` | Settings — Profile, Store, Security, Notifications |

### Vendor (`/dashboard/vendor`)

| Route | Module |
|---|---|
| `/dashboard/vendor` | Overview — revenue chart (Area/Bar/Pie), recent orders |
| `/dashboard/vendor/products` | Product CRUD — add/edit modal, publish toggle |
| `/dashboard/vendor/orders` | Orders — status dropdown, detail modal |
| `/dashboard/vendor/inventory` | Stock — inline edit, color-coded bars, alerts |
| `/dashboard/vendor/earnings` | Earnings — gross/net chart, payout history |
| `/dashboard/vendor/store` | Store profile — General, Policies, Danger zone |
| `/dashboard/vendor/settings` | Settings — Account, Notifications, Security |
| `/dashboard/vendor/profile` | Personal profile + public store preview |

### Customer (`/dashboard/customer`)

| Route | Module |
|---|---|
| `/dashboard/customer` | Overview — stats, recent orders, wishlist preview |
| `/dashboard/customer/orders` | My orders — status filter, tracking timeline modal |
| `/dashboard/customer/wishlist` | Wishlist — grid, add to cart, remove |
| `/dashboard/customer/reviews` | My reviews — edit with star picker, delete |
| `/dashboard/customer/addresses` | Address book — home/office/other, CRUD |
| `/dashboard/customer/notifications` | Notifications — type filter, mark read, delete |
| `/dashboard/customer/settings` | Settings — Preferences, Notifications, Security |
| `/dashboard/customer/profile` | Personal profile + stats summary |

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Primary | `#D97706` (amber-600) | CTAs, active states, highlights |
| Background | `#FFFBEB` (amber-50) | Page backgrounds |
| Surface | `#FFFFFF` | Cards, modals |
| Text primary | `#0F172A` (slate-900) | Headings |
| Text secondary | `#94A3B8` (slate-400) | Labels, metadata |
| Border | `#F1F5F9` (slate-100) | Card borders |

### Typography

- **Display headings** — Georgia serif (`font-black`, `text-slate-900`)
- **UI text** — System sans-serif via Tailwind defaults
- **Code / monospace** — `font-mono` for SKUs, order numbers, IDs

### Component Patterns

- **Server by default** — data fetching pages are `async` server components
- **Client at the edge** — only interactive pieces use `'use client'`
- **`AdminDataTable`** — generic reusable table (search, sort, paginate, filter slot, action slot)
- **`ConfirmModal`** — reusable danger/confirm dialog with `danger` prop
- **`Reveal`** — scroll-triggered animation wrapper using `IntersectionObserver`

---

## Key Patterns

### Server / Client Split

```tsx
// ✅ Page = async SERVER — fetches data, no JS cost
export default async function ProductsPage() {
  const products = await fetchProducts(); // or mock data
  return <ProductsClient initialProducts={products} />;
}

// ✅ Client component — only where interactivity is needed
'use client';
export default function ProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  // sort, filter, modal state etc.
}
```

### Next.js 15 Async Params

```tsx
// ✅ CORRECT — params is a Promise in Next.js 15+
interface Props { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params;
}
```

### Image — always `next/image`, never `<img>`

```tsx
// ✅ Always
import Image from 'next/image';
<Image src={url} alt={alt} fill className="object-cover" sizes="..." />

// ❌ Never
<img src={url} alt={alt} />
```

---

## Scripts

```bash
npm run dev        # Start development server (port 3001)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run type-check # TypeScript check (tsc --noEmit)
```

---

## Backend Repository

The backend for this project is a separate Node.js/Express/Prisma/PostgreSQL API:

👉 **[ElectroMart Backend — github.com/itstumpa/electromart-backend](https://github.com/itstumpa/electromart-backend.git)**

> ⚠️ Update this link to the correct ElectroMart backend repo URL before publishing.

**Backend stack:** Node.js · Express · TypeScript · Prisma · PostgreSQL · Redis · BullMQ · SSLCommerz · Stripe · Passport-JWT · Nodemailer · Socket.io

---

## Author

**Tumpa** — Full-Stack Developer
- GitHub: [@itstumpa](https://github.com/itstumpa)
- LinkedIn: [linkedin.com/in/itstumpa](https://linkedin.com/in/itstumpa)

---


<p align="center">Built with ❤️ by Tumpa </p>