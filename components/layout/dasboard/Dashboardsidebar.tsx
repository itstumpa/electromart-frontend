'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Store, Package,
  ShoppingBag, Tag, Menu, X,
  LogOut, Settings, Bell, User,
  Heart, MapPin, Star, Wallet,
  ClipboardList, BarChart2, Boxes,
} from 'lucide-react';
import type { UserRole } from '@/data/types';
import { authStorage } from '@/utils/auth-storage';
import { logoutUser } from '@/api/auth.api';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

// ─── Nav definitions per role ──────────────────────────────
const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Overview',   href: '/dashboard/admin',            icon: LayoutDashboard },
    { label: 'Users',      href: '/dashboard/admin/users',      icon: Users },
    { label: 'Vendors',    href: '/dashboard/admin/vendors',    icon: Store,      badge: 2 },
    { label: 'Products',   href: '/dashboard/admin/products',   icon: Package },
    { label: 'Orders',     href: '/dashboard/admin/orders',     icon: ShoppingBag },
    { label: 'Categories', href: '/dashboard/admin/categories', icon: Tag },
  ],
  VENDOR: [
    { label: 'Overview',   href: '/dashboard/vendor',           icon: LayoutDashboard },
    { label: 'Products',   href: '/dashboard/vendor/products',  icon: Package },
    { label: 'Orders',     href: '/dashboard/vendor/orders',    icon: ShoppingBag },
    { label: 'Inventory',  href: '/dashboard/vendor/inventory', icon: Boxes },
    { label: 'Earnings',   href: '/dashboard/vendor/earnings',  icon: Wallet },
    { label: 'Store',      href: '/dashboard/vendor/store',     icon: Store },
  ],
  CUSTOMER: [
    { label: 'Overview',       href: '/dashboard/customer',               icon: LayoutDashboard },
    { label: 'My Orders',      href: '/dashboard/customer/orders',        icon: ShoppingBag },
    { label: 'Wishlist',       href: '/dashboard/customer/wishlist',      icon: Heart },
    { label: 'My Reviews',     href: '/dashboard/customer/reviews',       icon: Star },
    { label: 'Addresses',      href: '/dashboard/customer/addresses',     icon: MapPin },
    { label: 'Notifications',  href: '/dashboard/customer/notifications', icon: Bell },
  ],
  DELIVERY: [
    { label: 'Overview',   href: '/dashboard/delivery',          icon: LayoutDashboard },
    { label: 'Assigned',   href: '/dashboard/delivery/assigned', icon: ClipboardList },
    { label: 'History',    href: '/dashboard/delivery/history',  icon: BarChart2 },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  VENDOR:      'Vendor',
  CUSTOMER:    'Customer',
  DELIVERY:    'Delivery Agent',
};

// ─── Root href per role (for exact-match check) ────────────
const ROLE_ROOT: Record<UserRole, string> = {
  SUPER_ADMIN: '/dashboard/admin',
  VENDOR:      '/dashboard/vendor',
  CUSTOMER:    '/dashboard/customer',
  DELIVERY:    '/dashboard/delivery',
};

interface Props { role: UserRole }

export default function DashboardSidebar({ role }: Props) {
  const pathname    = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems    = NAV_BY_ROLE[role];
  const roleRoot    = ROLE_ROOT[role];

  const isActive = (href: string) =>
    href === roleRoot ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch {
      // Clear session regardless of API response
    } finally {
      authStorage.clearSession();
      toast.success('You are logged out');
    }
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon   = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={[
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative',
          active
            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        ].join(' ')}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active-pill"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 rounded-r-full"
          />
        )}
        <Icon
          size={17}
          className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
        />
        <span className="flex-1 leading-none">{item.label}</span>
        {item.badge && (
          <span className={[
            'text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-4.5 text-center',
            active ? 'bg-white/25 text-white' : 'bg-amber-600 text-white',
          ].join(' ')}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-slate-100 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-sm shrink-0">
            <span
              className="text-white font-black text-base"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              E
            </span>
          </div>
          <div className="min-w-0">
            <p
              className="font-black text-slate-900 text-base tracking-tight leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Electro<span className="text-amber-600">Mart</span>
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              {ROLE_LABEL[role]} Panel
            </p>
          </div>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* ── Account section — links are dynamic per role ── */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
            Account
          </p>
          <Link
            href={`${roleRoot}/profile`}
            onClick={() => setMobileOpen(false)}
            className={[
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              isActive(`${roleRoot}/profile`)
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            <User size={17} className={isActive(`${roleRoot}/profile`) ? 'text-white' : 'text-slate-400'} />
            My Profile
          </Link>
          <Link
            href={`${roleRoot}/settings`}
            onClick={() => setMobileOpen(false)}
            className={[
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              isActive(`${roleRoot}/settings`)
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            <Settings size={17} className={isActive(`${roleRoot}/settings`) ? 'text-white' : 'text-slate-400'} />
            Settings
          </Link>
          <Link
            href="/"
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut size={17} className="text-slate-400 group-hover:text-red-500" />
            Back to Store
          </Link>
        </div>
      </nav>

      {/* ── Role badge ── */}
      <div className="px-4 py-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-amber-800">
            {ROLE_LABEL[role]}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: fixed sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile: hamburger + drawer ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3.5 left-4 z-50 w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 z-50 shadow-2xl"
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X size={15} />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}