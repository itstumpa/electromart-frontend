# 🛒 ElectroMart — Frontend

> **A modern multi-vendor e-commerce frontend** built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Features role-based dashboards for customers, vendors, and admins, with full cart/wishlist management, guest checkout, and real-time notifications.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Architecture Overview](#architecture-overview)
- [Routing Structure](#routing-structure)
- [Public Pages](#public-pages)
- [Dashboard Structure](#dashboard-structure)
- [Customer Features](#customer-features)
- [Vendor Features](#vendor-features)
- [Super Admin Features](#super-admin-features)
- [Authentication Flow](#authentication-flow)
- [Guest Features](#guest-features)
- [Product Features](#product-features)
- [Category Features](#category-features)
- [Brand Features](#brand-features)
- [Return Request Flow](#return-request-flow)
- [Product QA Flow](#product-qa-flow)
- [Cart & Checkout Flow](#cart--checkout-flow)
- [State Management](#state-management)
- [API Integration Strategy](#api-integration-strategy)
- [Environment Variables](#environment-variables)
- [Installation Guide](#installation-guide)
- [Build & Deployment](#build--deployment)
- [Performance Optimizations](#performance-optimizations)
- [Responsive Design Notes](#responsive-design-notes)
- [Reusable Components](#reusable-components)

---

## Tech Stack

| Category            | Technology                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| **Framework**       | Next.js 16 (App Router)                                                 |
| **Language**        | TypeScript                                                              |
| **Styling**         | Tailwind CSS v4, `tw-animate-css`, `tailwind-merge`, `clsx`            |
| **UI Components**   | shadcn/ui (Radix primitives), Lucide React icons                        |
| **State Mgmt**      | Redux Toolkit, Zustand (wishlist)                                       |
| **API Client**      | Axios + TanStack React Query                                            |
| **Forms**           | React Hook Form + Zod (@hookform/resolvers)                             |
| **Rich Text**       | Tiptap (headings, lists, highlight, underline, text-align)              |
| **Animations**      | Framer Motion                                                           |
| **Charts**          | Recharts                                                               |
| **Notifications**   | Sonner (toasts)                                                         |
| **Drag & Drop**     | @dnd-kit (sortable)                                                     |
| **Carousel**        | react-fast-marquee                                                      |
| **Fonts**           | Geist (via next/font)                                                   |

---

## Folder Structure

```
app/
├── layout.tsx                          # Root layout (Geist fonts, WishlistInitializer)
├── globals.css                         # Global Tailwind styles
├── loading.tsx                         # Global loading state
├── not-found.tsx                       # 404 page
├── error.tsx                           # Error boundary
│
├── (main)/                             # Public-facing routes
│   ├── layout.tsx                      # Main layout (TopBar, Navbar, Footer)
│   ├── page.tsx                        # Homepage
│   ├── TopBar.tsx                      # Announcement bar
│   ├── MainNavbar.tsx                  # Navigation bar
│   ├── MainFooter.tsx                  # Footer
│   ├── home/                           # Homepage sections
│   │   ├── Herobanner.tsx
│   │   ├── Categorygrid.tsx
│   │   ├── Featuredproducts.tsx
│   │   ├── TopSaleProducts.tsx
│   │   ├── Popularproducts.tsx
│   │   ├── Topvendors.tsx
│   │   ├── Topbrands.tsx
│   │   ├── Onsale.tsx
│   │   ├── Ctabentogrid.tsx
│   │   └── Testimonialssection.tsx
│   ├── products/                       # Product listing + detail
│   │   ├── page.tsx                    # Product listing page
│   │   └── [slug]/page.tsx            # Product detail page
│   ├── categories/                     # Category pages
│   │   ├── page.tsx                    # All categories
│   │   └── [slug]/page.tsx            # Category detail
│   ├── cart/page.tsx                   # Shopping cart
│   ├── checkout/page.tsx               # Checkout page
│   ├── order-confirmation/page.tsx     # Order confirmation
│   ├── order/track/[orderId]/page.tsx  # Order tracking
│   ├── stores/page.tsx                 # Store listing
│   ├── search/page.tsx                 # Search results
│   ├── sale/page.tsx                   # Sale page
│   ├── tags/page.tsx                   # Tags listing
│   ├── tags/[slug]/page.tsx           # Products by tag
│   ├── about/page.tsx                  # About page
│   ├── contact/page.tsx                # Contact page
│   ├── privacy/page.tsx                # Privacy policy
│   ├── terms/page.tsx                  # Terms of service
│   ├── login/page.tsx                  # Sign in
│   ├── register/page.tsx               # Sign up
│   └── forgot-password/page.tsx        # Password reset
│
├── (payment)/                          # Payment pages
│   ├── layout.tsx
│   └── payment/page.tsx
│
├── customer/                           # Customer-specific pages
│   └── wishlist/page.tsx
│
└── dashboard/                          # Dashboard (role-based)
    ├── admin/
    │   ├── layout.tsx                  # DashboardShell with SUPER_ADMIN/ADMIN guard
    │   ├── page.tsx                    # Overview with stats & charts
    │   ├── overview/
    │   ├── banners/
    │   ├── categories/
    │   ├── coupon/
    │   ├── leaderboard/
    │   ├── notifications/
    │   ├── orders/
    │   ├── products/
    │   ├── users/
    │   ├── vendors/
    │   ├── questions/
    │   ├── profile/
    │   └── settings/
    ├── vendor/
    │   ├── layout.tsx                  # DashboardShell with VENDOR guard
    │   ├── page.tsx                    # Vendor overview with analytics
    │   ├── overview/
    │   ├── products/
    │   ├── orders/
    │   ├── notifications/
    │   ├── inventory/
    │   ├── earnings/
    │   ├── returns/
    │   ├── questions/
    │   ├── store/
    │   ├── profile/
    │   └── settings/
    └── customer/
        ├── layout.tsx                  # DashboardShell with CUSTOMER guard
        ├── page.tsx                    # Customer overview
        ├── orders/
        ├── cart/
        ├── returns/
        ├── wishlist/
        ├── reviews/
        ├── addresses/
        ├── notifications/
        ├── profile/
        └── settings/

api/                                    # API client modules
├── axios.ts                            # Axios instance (baseURL, credentials)
├── auth.api.ts
├── address.api.ts
├── admin.api.ts
├── banner.api.ts
├── brand.api.ts
├── cart.api.ts
├── category.api.ts
├── coupon.api.ts
├── leaderboard.api.ts
├── notification.api.ts
├── order.api.ts
├── payment.api.ts
├── payout.api.ts
├── product.api.ts
├── product-qa.api.ts
├── return.api.ts
├── review.api.ts
├── store.api.ts
├── tag.api.ts
├── user.api.ts
├── vendor-analytics.api.ts
├── wishlist.api.ts
└── v1/                                # API route version constants

components/
├── layout/
│   └── dasboard/                       # Dashboard shell components
│       ├── DashboardShell.tsx          # Role-based layout wrapper
│       ├── Dashboardsidebar.tsx        # Sidebar navigation
│       └── Dashboardtopbar.tsx         # Top bar
├── dashboard/
│   ├── admin/                          # Admin dashboard components
│   │   ├── Admindatatable.tsx
│   │   ├── Statcard.tsx
│   │   ├── Revenuechart.tsx
│   │   ├── Confirmmodal.tsx
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── users/
│   │   ├── vendors/
│   │   └── settings/
│   └── vendor/
│       └── ProductImageManager.tsx
├── ui/                                 # shadcn/ui primitives
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── tooltip.tsx
│   ├── TiptapRenderer.tsx             # Tiptap content renderer
│   └── RichTextEditor.tsx             # Tiptap editor component
├── features/
│   ├── product/                        # Product-related features
│   └── delete/                         # Delete confirmation
├── payment/                            # Payment components
└── WishlistInitializer.tsx             # Hydrates wishlist state on load

lib/
├── api-client.ts                       # Generic fetch wrapper
├── api-config.ts                       # Server-side API base URL
├── auth.storage.ts                     # Local storage auth helpers (commented out)
├── constants.ts                        # App name, nav categories
├── dashboard-nav.config.ts            # Sidebar nav config by role
├── utils.ts                            # cn(), formatPrice, slugify, truncate, getInitials
├── fetch-product.ts                    # Product fetching utilities
│
├── address-mappers.ts                  # Address DTO → UI mapping
├── cart-mappers.ts                     # Cart DTO → UI mapping
├── product-mappers.ts                  # Product DTO → UI mapping
├── order-mappers.ts                    # Order DTO → UI mapping
├── user-mappers.ts                     # User DTO → UI mapping
├── wishlist-mappers.ts                 # Wishlist DTO → UI mapping
├── notification-mappers.ts             # Notification DTO → UI mapping
├── banner-icon-map.ts                  # Banner icon name → component mapping
│
└── api/
    ├── client.ts                       # API client config
    ├── routes.ts                       # API route constants
    ├── users.ts                        # User API calls
    ├── vendors.ts                      # Vendor API calls
    └── admin/
        └── dashboard.ts               # Admin dashboard data fetching

hooks/
├── useCartCount.ts                     # Cart count badge with auto-refresh
└── useWishlistCount.ts                 # Wishlist count hook

data/
├── types.ts                            # Shared type definitions + mock nav data
└── mock-data.ts                        # Seed data (shared with backend)

types/                                  # TypeScript interfaces
├── address.ts
├── admin-dashboard.ts
├── api.ts
├── auth.ts
├── brand.ts
├── cart.ts
├── category.ts
├── notification.ts
├── order.ts
├── product.ts
├── vendors.ts

utils/
├── api-error.ts                        # API error message extraction
└── auth-storage.ts                     # localStorage auth management
```

---

## Architecture Overview

```
Browser
    │
    ├── Next.js 16 (App Router)
    │
    ├── Root Layout → WishlistInitializer
    │   │
    │   ├── (main) Layout → TopBar → MainNavbar → Content → Footer
    │   │   ├── Homepage (dynamic sections)
    │   │   ├── Products / Categories / Stores / Tags
    │   │   ├── Cart → Checkout → Order Confirmation
    │   │   └── Auth pages (login, register, forgot-password)
    │   │
    │   ├── (payment) Layout → Payment pages
    │   │
    │   └── Dashboard Layout → DashboardShell
    │       ├── ADMIN Dashboard
    │       ├── VENDOR Dashboard
    │       └── CUSTOMER Dashboard
    │
    ├── API Layer (Axios)
    │   ├── httpOnly cookies (auth)
    │   └── Next.js rewrites → Backend API
    │
    ├── State Management
    │   ├── Redux Toolkit (global state)
    │   ├── Zustand (wishlist)
    │   └── TanStack React Query (server state)
    │
    └── UI Layer
        ├── shadcn/ui components
        ├── Framer Motion (animations)
        ├── Recharts (charts)
        └── Sonner (toasts)
```

---

## Routing Structure

The app uses Next.js App Router with three route groups:

| Route Group       | Layout                     | Purpose                       |
| ----------------- | -------------------------- | ----------------------------- |
| `(main)`          | TopBar + Navbar + Footer   | Public-facing pages           |
| `(payment)`       | Minimal layout             | Payment gateway redirects     |
| `dashboard`       | DashboardShell (role-based)| Admin/Vendor/Customer portals |
| `customer`        | None (minimal)             | Customer wishlist page        |

### Route Group: `(main)` — Public Pages

| Route                     | Page              | Description                  |
| ------------------------- | ----------------- | ---------------------------- |
| `/`                       | Homepage          | Hero, categories, products   |
| `/products`               | Product Listing   | All products with filters    |
| `/products/[slug]`        | Product Detail    | Full product view            |
| `/categories`             | All Categories    | Category grid                |
| `/categories/[slug]`      | Category Detail   | Products in category         |
| `/cart`                   | Shopping Cart     | Cart with coupon support     |
| `/checkout`               | Checkout          | Address + order placement    |
| `/order-confirmation`     | Order Confirmation| Post-order success           |
| `/order/track/[orderId]`  | Order Tracking    | Order timeline               |
| `/stores`                 | Store Listing     | All vendors                  |
| `/search`                 | Search Results    | Product search               |
| `/sale`                   | Sale Page         | Discounted products          |
| `/tags`                   | Tags Listing      | All product tags             |
| `/tags/[slug]`            | Tag Detail        | Products by tag              |
| `/about`                  | About Us          | Company info                 |
| `/contact`                | Contact           | Contact form                 |
| `/privacy`                | Privacy Policy    | Legal                        |
| `/terms`                  | Terms of Service  | Legal                        |
| `/login`                  | Sign In           | Authentication               |
| `/register`               | Sign Up           | Registration                 |
| `/forgot-password`        | Password Reset    | Reset flow                   |

### Route Group: `(payment)` — Payment Pages

| Route                  | Description              |
| ---------------------- | ------------------------ |
| `/payment`             | Payment gateway pages    |

### Route Group: `dashboard` — Role-Based Dashboards

#### Admin Dashboard (`/dashboard/admin`)

| Route                           | Feature               |
| ------------------------------- | --------------------- |
| `/dashboard/admin`              | Overview & statistics |
| `/dashboard/admin/overview`     | Detailed analytics    |
| `/dashboard/admin/leaderboard`  | Vendor leaderboard    |
| `/dashboard/admin/banners`      | Banner management     |
| `/dashboard/admin/users`        | User management       |
| `/dashboard/admin/vendors`      | Vendor management     |
| `/dashboard/admin/products`     | Product management    |
| `/dashboard/admin/orders`       | Order management      |
| `/dashboard/admin/notifications`| Send notifications    |
| `/dashboard/admin/categories`   | Category management   |
| `/dashboard/admin/coupon`       | Coupon management     |
| `/dashboard/admin/questions`    | Q&A moderation        |
| `/dashboard/admin/profile`      | Profile settings      |
| `/dashboard/admin/settings`     | System settings       |

#### Vendor Dashboard (`/dashboard/vendor`)

| Route                           | Feature               |
| ------------------------------- | --------------------- |
| `/dashboard/vendor`             | Overview & analytics  |
| `/dashboard/vendor/overview`    | Detailed analytics    |
| `/dashboard/vendor/products`    | Product management    |
| `/dashboard/vendor/orders`      | Order management      |
| `/dashboard/vendor/notifications`| Notifications        |
| `/dashboard/vendor/inventory`   | Stock management      |
| `/dashboard/vendor/earnings`    | Payouts & revenue     |
| `/dashboard/vendor/returns`     | Return requests       |
| `/dashboard/vendor/questions`   | Customer Q&A          |
| `/dashboard/vendor/store`       | Store settings        |
| `/dashboard/vendor/profile`     | Profile settings      |
| `/dashboard/vendor/settings`    | Account settings      |

#### Customer Dashboard (`/dashboard/customer`)

| Route                           | Feature               |
| ------------------------------- | --------------------- |
| `/dashboard/customer`           | Overview              |
| `/dashboard/customer/orders`    | My orders             |
| `/dashboard/customer/cart`      | Shopping cart         |
| `/dashboard/customer/returns`   | Return requests       |
| `/dashboard/customer/wishlist`  | Wishlist              |
| `/dashboard/customer/reviews`   | My reviews            |
| `/dashboard/customer/addresses` | Address book          |
| `/dashboard/customer/notifications`| Notifications      |
| `/dashboard/customer/profile`   | Profile settings      |
| `/dashboard/customer/settings`  | Account settings      |

---

## Public Pages

### Homepage
The homepage features a modern, dynamically loaded layout with:

| Section                  | Component              | Description                        |
| ------------------------ | ---------------------- | ---------------------------------- |
| **Hero Banner**          | `Herobanner`           | Main promotional carousel          |
| **Category Grid**        | `Categorygrid`         | Category navigation tiles          |
| **Featured Products**    | `Featuredproducts`     | Curated product showcase           |
| **Best Sellers**         | `TopSaleProducts`      | Top-selling products               |
| **Popular Products**     | `Popularproducts`      | Trending products                  |
| **Top Vendors**          | `Topvendors`           | Highest-rated stores               |
| **Top Brands**           | `Topbrands`            | Brand showcase                     |
| **On Sale**              | `Onsale`               | Discounted items                   |
| **CTA Bento Grid**       | `Ctabentogrid`         | Promotional bento grid             |
| **Testimonials**         | `Testimonialssection`  | Customer reviews                   |

All sections use **dynamic imports** with skeleton loading states for optimal performance.

### Product Listing Page
- Grid/list view toggle
- Category, brand, and price range filtering
- Sort by: newest, price, rating, best selling
- Search with suggestions
- Pagination

### Product Detail Page
- Image gallery with primary image
- Variant selection (size/color)
- Specifications table
- Customer reviews & ratings
- Q&A section
- Related products
- Add to cart / wishlist
- Recently viewed tracking

### Cart Page
- Guest and authenticated cart support
- Quantity adjustment
- Coupon code application
- Price breakdown
- Proceed to checkout

### Checkout Page
- Address management (create/select)
- Order summary
- Place order (auth) or guest order
- Redirects to payment gateway

### Order Tracking
- Real-time order timeline
- Guest tracking via order ID

---

## Dashboard Structure

### DashboardShell
Every dashboard page is wrapped in `DashboardShell`, which:

1. **Checks authentication** — redirects to login if not authenticated
2. **Validates role** — restricts access based on `allowedRoles` prop
3. **Renders sidebar** — dynamic navigation from `NAV_BY_ROLE` config
4. **Renders top bar** — search, notifications, user menu
5. **Provides responsive layout** — collapsible sidebar on mobile

### Sidebar Navigation
Configured centrally in `lib/dashboard-nav.config.ts`. Each role gets its own set of navigation items. Adding a new module requires only adding a new entry to the config.

---

## Customer Features

- **Order Management** — View order history, track status, cancel orders
- **Shopping Cart** — Full cart management with coupon support
- **Wishlist** — Save products for later, check wishlist status
- **Returns** — Submit return requests for order items
- **Reviews** — Write, edit, and manage product reviews
- **Address Book** — Manage shipping addresses, set default
- **Notifications** — View in-app notifications
- **Profile & Settings** — Update profile, manage notification preferences

---

## Vendor Features

- **Dashboard Overview** — Sales analytics, revenue charts, order stats
- **Product Management** — Create/edit products, manage images, variants, specs
- **Order Management** — View orders for your store, update item status
- **Inventory Management** — Track stock levels
- **Earnings & Payouts** — Revenue tracking, payout requests
- **Return Requests** — Handle customer return requests
- **Customer Q&A** — Answer product questions, moderate
- **Store Settings** — Update store profile, policies, settings
- **Notifications** — Order alerts, customer activity

---

## Super Admin Features

- **Dashboard Overview** — System-wide statistics and charts
- **Leaderboard** — Vendor performance rankings
- **Banner Management** — Create/update banner campaigns (bento grid types)
- **User Management** — View, search, ban users
- **Vendor Management** — Approve stores, monitor activity
- **Product Management** — Oversee all products
- **Order Management** — View all orders, admin cancellations
- **Notifications** — Send system-wide or targeted notifications
- **Category Management** — CRUD categories
- **Coupon Management** — Create and manage discount coupons
- **Q&A Moderation** — Review and moderate product questions

---

## Authentication Flow

```
Login Page → POST /auth/signin
    ↓
Backend sets httpOnly cookies (accessToken + refreshToken)
    ↓
DashboardShell checks auth state
    ↓
User role determines which dashboard to show
    ↓
API calls include cookies automatically (withCredentials: true)
    ↓
Token refresh happens transparently in middleware
    ↓
Logout clears cookies + local storage
```

### Key Implementation Details

- **axios instance** (`api/axios.ts`) configured with `withCredentials: true`
- **auth storage** (`utils/auth-storage.ts`) manages localStorage tokens as fallback
- **DashboardShell** acts as auth guard for all dashboard routes
- **WishlistInitializer** restores wishlist state from localStorage on app load

---

## Guest Features

- **Guest Cart** — Full cart functionality without sign-in (via `guestId` cookie)
- **Guest Wishlist** — Save products without an account
- **Guest Checkout** — Place orders with just email for tracking
- **Cart Merge** — Guest cart merges into authenticated cart on sign in
- **Guest Order Tracking** — Track orders via order ID

---

## Product Features

- **Product Listing** — Filtered, sorted, paginated product display
- **Product Detail** — Full product information with images
- **Search** — Full-text search with suggestions
- **Featured Products** — Curated product showcase
- **Best Sellers** — Top-selling products
- **New Arrivals** — Recently added products
- **Related Products** — Product recommendations
- **Recently Viewed** — Redis-backed history (max 10)
- **Product Variants** — Size/color/option selection
- **Product Specifications** — Key-value spec display
- **Product Tags** — Tag-based browsing

---

## Category Features

- **Category Listing** — All categories with images
- **Featured Categories** — Highlighted categories on homepage
- **Category Products** — Filter products by category
- **Slug-based Routing** — SEO-friendly URLs

---

## Brand Features

- **Brand Listing** — All brands with logos
- **Featured Brands** — Highlighted brands on homepage
- **Brand Products** — Filter products by brand

---

## Return Request Flow

```
Customer Dashboard → My Orders → Return Request (with reason)
    ↓
Vendor Dashboard → Returns → View request details
    ↓
Vendor Approves or Rejects (with note)
    ↓
Customer sees updated status in dashboard
```

- Each return is linked to a specific order item
- Vendors can see return requests for their store only
- Status tracking: PENDING → APPROVED/REJECTED → RETURNED → REFUNDED → COMPLETED

---

## Product QA Flow

```
Product Detail Page → Ask Question (customer)
    ↓
Vendor Dashboard → Questions → Answer
    ↓
Moderation (optional, vendor or admin)
    ↓
Question appears on product page
```

- Questions require moderation before public display
- Customers can view their questions in dashboard
- Vendors see questions for their products only

---

## Cart & Checkout Flow

### Flow Diagram

```
Product Page → Add to Cart
    ↓
Cart Page → Adjust quantities, apply coupon
    ↓
Checkout → Select/Create Address
    ↓
Place Order → POST /orders (auth) or /orders/guest
    ↓
Payment Initiation → POST /payments/initiate
    ↓
Redirect to Gateway → SSLCommerz / Stripe
    ↓
Return → Order Confirmation
```

### Cart Features
- Guest and authenticated cart support
- Quantity increment/decrement
- Remove items
- Coupon code application with discount preview
- Cart count badge (auto-refreshes across tabs)
- Cart merge on authentication

---

## State Management

### Redux Toolkit
Used for global application state (cart count, auth state, UI state).

### Zustand (Wishlist)
The wishlist uses a lightweight Zustand store for:
- Wishlist product IDs (Set for O(1) lookup)
- Add/remove/toggle operations
- Auto-refresh on auth state change
- localStorage persistence via WishlistInitializer

### TanStack React Query
Used for server state management:
- Automatic caching and revalidation
- Background data refetching
- Optimistic updates for cart/wishlist

### Local Component State
- Dashboard data fetching with `useEffect` + loading/error states
- Form state via React Hook Form

---

## API Integration Strategy

### API Client Layer

```
api/axios.ts               # Axios instance with baseURL + credentials
    │
    ├── api/*.api.ts        # Domain-specific API functions
    │   ├── auth.api.ts     # Auth endpoints
    │   ├── product.api.ts  # Product endpoints
    │   └── ...             # 20+ domain modules
    │
    └── lib/api/            # Server-component API utilities
        ├── client.ts       # Fetch-based API client
        ├── routes.ts       # Route constants
        ├── admin/          # Admin-specific API
        └── ...
```

### API Configuration

- **Client-side**: Axios with `baseURL` from `NEXT_PUBLIC_API_URL`
- **Server-side**: Fetch-based `apiCall` with `BACKEND_URL`
- **Rewrites**: Next.js rewrites `/api/v1/*` → backend URL (avoids CORS in dev)

### Response Handling

All API calls follow the standardized response format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { total: number };
}
```

Error messages are extracted via `getApiErrorMessage()` utility.

---

## Environment Variables

```env
# ── API Configuration ──────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
BACKEND_URL=http://localhost:5000
```

---

## Installation Guide

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **pnpm**

### Clone & Install

```bash
git clone <repository-url>
cd electromart-frontend

# Install dependencies
npm install
```

### Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
npm run dev
# Opens on http://localhost:3000
```

---

## Build & Deployment

### Production Build

```bash
npm run build
npm start
```

The build uses `output: 'standalone'` for optimized Docker deployments.

### Vercel Deployment

```bash
# Connect repository to Vercel
# Set environment variables in Vercel dashboard
# Deploy via Git or CLI

vercel
```

### Available Scripts

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start development server           |
| `npm run build` | Production build (standalone)      |
| `npm start`     | Start production server            |
| `npm run lint`  | Run ESLint                         |

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',                         // Optimized Docker builds
  images: {
    remotePatterns: [                            // Allowed image domains
      'res.cloudinary.com',                     // Product images
      'images.unsplash.com',                    // Stock photos
      'i.pravatar.cc',                          // Avatar placeholders
      'upload.wikimedia.org',
      'i.pinimg.com',
    ],
  },
  async rewrites() {                            // API proxy (avoids CORS)
    return [{
      source: '/api/v1/:path*',
      destination: `${backendUrl}/api/v1/:path*`,
    }];
  },
};
```

---

## Performance Optimizations

- **Dynamic Imports** — Homepage sections loaded lazily with skeleton states
- **Image Optimization** — Next.js Image component with remote pattern allowlist
- **Standalone Output** — Optimized Docker builds (only necessary files)
- **Code Splitting** — Automatic route-based splitting via App Router
- **Skeleton Loading** — Pulse animations while content loads
- **API Route Rewrites** — Eliminates CORS latency in development
- **Server Components** — Dashboard overview uses RSC for zero client JS on data load
- **TanStack Query** — Automatic caching and deduplication of API requests
- **Zustand** — Minimal re-renders compared to Context-based state

---

## Responsive Design Notes

- **Mobile-first** with Tailwind breakpoints (sm, md, lg, xl)
- **Collapsible sidebar** in dashboards for mobile
- **Grid/list view toggle** on product listing
- **Bottom sheet menus** on mobile where appropriate
- **Touch-friendly** button and link sizes
- **Fluid typography** using Tailwind's scale
- **Overflow handling** for data tables on small screens

---

## Reusable Components

### UI Components (shadcn/ui)

| Component        | Description                        |
| ---------------- | ---------------------------------- |
| `Button`         | Variants: default, destructive, outline, secondary, ghost, link |
| `Card`           | Content card with header/footer    |
| `Badge`          | Status and count badges            |
| `Input`          | Form input with validation styling |
| `Select`         | Dropdown select                    |
| `Dialog`         | Modal dialog                       |
| `AlertDialog`    | Confirmation dialogs               |
| `Avatar`         | User avatar with fallback initials |
| `Checkbox`       | Checkbox input                     |
| `Separator`      | Visual divider                     |
| `Skeleton`       | Loading placeholder                |
| `Slider`         | Range slider                       |
| `Tooltip`        | Hover tooltips                     |

### Dashboard Components

| Component              | Description                        |
| ---------------------- | ---------------------------------- |
| `DashboardShell`       | Role-based layout with sidebar     |
| `Dashboardsidebar`     | Navigation sidebar                 |
| `Dashboardtopbar`      | Top bar with search & user menu    |
| `Statcard`             | Metric display card                |
| `RevenueChart`         | Revenue line/bar chart (Recharts)  |
| `AdminDataTable`       | Sortable, searchable data table    |
| `ConfirmModal`         | Action confirmation dialog         |

### Feature Components

| Component              | Description                        |
| ---------------------- | ---------------------------------- |
| `RichTextEditor`       | Tiptap-based rich text editor      |
| `TiptapRenderer`       | Render Tiptap content HTML         |
| `ProductImageManager`  | Product image upload/management    |

### Payment Components

| Component              | Description                        |
| ---------------------- | ---------------------------------- |
| Payment components     | Gateway redirect handling          |

---

## 📄 License

This is a private project. All rights reserved.
