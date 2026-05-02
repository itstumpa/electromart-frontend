# ElectroMart — Correct App Folder Structure
# All routes, layouts, and their URLs

app/
│
├── layout.tsx                          # ROOT layout — html, body, global CSS, providers
│                                       # URL: wraps everything
│
├── (main)/                             # ROUTE GROUP — public storefront
│   ├── layout.tsx                      # Adds: MainNavbar + MainFooter
│   ├── page.tsx                        # URL: /
│   ├── products/
│   │   ├── page.tsx                    # URL: /products
│   │   └── [slug]/
│   │       └── page.tsx               # URL: /products/iphone-15-pro-max
│   ├── sale/
│   │   └── page.tsx                   # URL: /sale
│   ├── about/
│   │   └── page.tsx                   # URL: /about
│   ├── contact/
│   │   └── page.tsx                   # URL: /contact
│   └── search/
│       └── page.tsx                   # URL: /search
│
├── (auth)/                             # ROUTE GROUP — auth pages (no navbar/footer)
│   ├── layout.tsx                      # Adds: clean centered layout only
│   ├── login/
│   │   └── page.tsx                   # URL: /login
│   └── register/
│       └── page.tsx                   # URL: /register
│
└── dashboard/                          # REGULAR folder — dashboard shell
    ├── layout.tsx                      # Adds: DashboardSidebar + DashboardTopbar
    │                                   # Shared by ALL roles below
    │
    ├── admin/                          # URL: /dashboard/admin
    │   ├── page.tsx                   # Overview + Analytics
    │   ├── users/
    │   │   └── page.tsx              # URL: /dashboard/admin/users
    │   ├── vendors/
    │   │   └── page.tsx              # URL: /dashboard/admin/vendors
    │   ├── products/
    │   │   └── page.tsx              # URL: /dashboard/admin/products
    │   ├── orders/
    │   │   └── page.tsx              # URL: /dashboard/admin/orders
    │   └── categories/
    │       └── page.tsx              # URL: /dashboard/admin/categories
    │
    ├── vendor/                         # URL: /dashboard/vendor
    │   ├── page.tsx                   # Overview + Revenue Chart
    │   ├── products/
    │   │   └── page.tsx              # URL: /dashboard/vendor/products
    │   ├── orders/
    │   │   └── page.tsx              # URL: /dashboard/vendor/orders
    │   ├── inventory/
    │   │   └── page.tsx              # URL: /dashboard/vendor/inventory
    │   ├── earnings/
    │   │   └── page.tsx              # URL: /dashboard/vendor/earnings
    │   └── store/
    │       └── page.tsx              # URL: /dashboard/vendor/store
    │
    └── customer/                       # URL: /dashboard/customer
        ├── page.tsx                   # Overview + Stats
        ├── orders/
        │   └── page.tsx              # URL: /dashboard/customer/orders
        ├── wishlist/
        │   └── page.tsx              # URL: /dashboard/customer/wishlist
        ├── reviews/
        │   └── page.tsx              # URL: /dashboard/customer/reviews
        ├── addresses/
        │   └── page.tsx              # URL: /dashboard/customer/addresses
        └── notifications/
            └── page.tsx              # URL: /dashboard/customer/notifications


# ══════════════════════════════════════════════════════════════
# WHY THIS WORKS — Key Concepts
# ══════════════════════════════════════════════════════════════

# 1. Route Groups (parentheses) are URL-invisible
#    (main)/page.tsx     → URL is just /
#    (auth)/login/       → URL is just /login
#    The group name never appears in the browser

# 2. Regular folders ARE in the URL
#    dashboard/admin/    → URL is /dashboard/admin
#    dashboard/vendor/   → URL is /dashboard/vendor

# 3. Layout inheritance is additive (child inherits parent)
#    app/layout.tsx              → always applied (root html)
#    app/(main)/layout.tsx       → applied to ALL pages inside (main)/
#    app/dashboard/layout.tsx    → applied to ALL pages inside dashboard/
#    app/dashboard/admin/        → gets dashboard/layout.tsx automatically

# 4. NO conflict between (main)/page.tsx and dashboard/admin/page.tsx
#    They are completely separate route trees
#    They share app/layout.tsx (root) but nothing else

# 5. (auth)/ has its own layout.tsx — so /login and /register
#    get NO navbar, NO footer, NO dashboard sidebar
#    Just a clean centered form layout


# ══════════════════════════════════════════════════════════════
# COMPONENTS FOLDER
# ══════════════════════════════════════════════════════════════

components/
├── layout/
│   ├── main/
│   │   ├── MainNavbar.tsx
│   │   ├── MainFooter.tsx
│   │   └── TopBar.tsx
│   └── dashboard/
│       ├── DashboardSidebar.tsx    # CLIENT — usePathname, mobile drawer
│       └── DashboardTopbar.tsx     # CLIENT — notifications, profile dropdown
│
├── features/
│   ├── home/                       # HeroBanner, FeaturedProducts, etc.
│   ├── product/                    # ProductCard, ProductGallery, etc.
│   └── dashboard/
│       └── admin/
│           ├── AdminDataTable.tsx  # Reusable table (search/sort/paginate)
│           ├── ConfirmModal.tsx    # Reusable danger/confirm dialog
│           ├── StatCard.tsx        # Server — pure stat display
│           ├── RevenueChart.tsx    # Client — Recharts
│           ├── users/UsersClient.tsx
│           ├── vendors/VendorsClient.tsx
│           ├── products/ProductsClient.tsx
│           ├── orders/OrdersClient.tsx
│           └── categories/CategoriesClient.tsx
│
└── common/
    └── Reveal.tsx                  # Scroll animation wrapper