// ============================================================
// ElectroMart — Dashboard Navigation Config
// Add / remove / reorder sidebar items here.
// The sidebar component reads this list at runtime so new
// modules appear without touching the sidebar code.
// ============================================================

import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Heart,
  MapPin,
  Star,
  Wallet,
  ClipboardList,
  BarChart2,
  Boxes,
  RotateCcw,
  MessageSquare,
  Award,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/data/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Dynamic badge count – set to 0 or omit to hide. */
  badge?: number;
}

// ────────────────────────────────────────────────────────────
// NAV_BY_ROLE  –  single source of truth for sidebar items.
//
// To add a new module (e.g. "Promotions"):
//   1. Import the icon (if needed) from lucide-react.
//   2. Push a new NavItem into the relevant role array.
//   3. That's it – the sidebar picks it up automatically.
// ────────────────────────────────────────────────────────────
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: "Overview",   href: "/dashboard/admin",            icon: LayoutDashboard },
    { label: "Leaderboard", href: "/dashboard/admin/leaderboard", icon: Award },
    { label: "Users",      href: "/dashboard/admin/users",      icon: Users },
    { label: "Vendors",    href: "/dashboard/admin/vendors",    icon: Store },
    { label: "Products",   href: "/dashboard/admin/products",   icon: Package },
    { label: "Orders",     href: "/dashboard/admin/orders",     icon: ShoppingBag },
    { label: "Categories", href: "/dashboard/admin/categories", icon: Tag },
    { label: "Coupons",    href: "/dashboard/admin/coupon",     icon: Tag },
  ],
  ADMIN: [
    { label: "Overview",   href: "/dashboard/admin",            icon: LayoutDashboard },
    { label: "Leaderboard", href: "/dashboard/admin/leaderboard", icon: Award },
    { label: "Users",      href: "/dashboard/admin/users",      icon: Users },
    { label: "Vendors",    href: "/dashboard/admin/vendors",    icon: Store },
    { label: "Products",   href: "/dashboard/admin/products",   icon: Package },
    { label: "Orders",     href: "/dashboard/admin/orders",     icon: ShoppingBag },
    { label: "Categories", href: "/dashboard/admin/categories", icon: Tag },
    { label: "Coupons",    href: "/dashboard/admin/coupon",     icon: Tag },
    { label: "Questions",  href: "/dashboard/admin/questions",  icon: MessageSquare },
  ],
  VENDOR: [
    { label: "Overview",   href: "/dashboard/vendor",           icon: LayoutDashboard },
    { label: "Products",   href: "/dashboard/vendor/products",  icon: Package },
    { label: "Orders",     href: "/dashboard/vendor/orders",    icon: ShoppingBag },
    { label: "Inventory",  href: "/dashboard/vendor/inventory", icon: Boxes },
    { label: "Earnings",   href: "/dashboard/vendor/earnings",  icon: Wallet },
    { label: "Returns",    href: "/dashboard/vendor/returns",   icon: RotateCcw },
    { label: "Questions",  href: "/dashboard/vendor/questions", icon: MessageSquare },
    { label: "Store",      href: "/dashboard/vendor/store",     icon: Store },
  ],
  CUSTOMER: [
    { label: "Overview",       href: "/dashboard/customer",               icon: LayoutDashboard },
    { label: "My Orders",      href: "/dashboard/customer/orders",        icon: ShoppingBag },
    { label: "My Cart",        href: "/dashboard/customer/cart",          icon: ShoppingCart },
    { label: "Returns",        href: "/dashboard/customer/returns",       icon: RotateCcw },
    { label: "Wishlist",       href: "/dashboard/customer/wishlist",      icon: Heart },
    { label: "My Reviews",     href: "/dashboard/customer/reviews",       icon: Star },
    { label: "Addresses",      href: "/dashboard/customer/addresses",     icon: MapPin },
  ],
  DELIVERY: [
    { label: "Overview",   href: "/dashboard/delivery",          icon: LayoutDashboard },
    { label: "Assigned",   href: "/dashboard/delivery/assigned", icon: ClipboardList },
    { label: "History",    href: "/dashboard/delivery/history",  icon: BarChart2 },
  ],
};

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN:       "Admin",
  VENDOR:      "Vendor",
  CUSTOMER:    "Customer",
  DELIVERY:    "Delivery Agent",
};

export const ROLE_ROOT: Record<UserRole, string> = {
  SUPER_ADMIN: "/dashboard/admin",
  ADMIN:       "/dashboard/admin",
  VENDOR:      "/dashboard/vendor",
  CUSTOMER:    "/dashboard/customer",
  DELIVERY:    "/dashboard/delivery",
};
