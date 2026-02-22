'use client';

// Sidebar needs usePathname for active state → minimal client usage
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Store, Package,
  ShoppingBag, Tag, Menu, X, 
  LogOut, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/data/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const adminNav: NavItem[] = [
  { label: 'Overview',    href: '/dashboard/overview',              icon: LayoutDashboard },
  { label: 'Users',       href: '/dashboard/users',         icon: Users },
  { label: 'Vendors',     href: '/dashboard/vendors',       icon: Store,      badge: 2 },
  { label: 'Products',    href: '/dashboard/products',      icon: Package },
  { label: 'Orders',      href: '/dashboard/orders',        icon: ShoppingBag },
  { label: 'Categories',  href: '/dashboard/categories',    icon: Tag },
];

interface Props { role: UserRole }

export default function DashboardSidebar({ role }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = adminNav; // extend later for vendor/customer/delivery

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    // exact match for /admin, startsWith for sub-routes
    const isActive =
      item.href === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(item.href);

    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative',
          isActive
            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )}
      >
        {/* Active left bar */}
        {isActive && (
          <motion.span
            layoutId="sidebar-pill"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 rounded-r-full"
          />
        )}
        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'} />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className={cn(
            'text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-4.5 text-center',
            isActive ? 'bg-white/25 text-white' : 'bg-amber-600 text-white'
          )}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-base" style={{ fontFamily: 'Georgia, serif' }}>E</span>
          </div>
          <div>
            <span className="font-black text-slate-900 text-base tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              Electro<span className="text-amber-600">Mart</span>
            </span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest -mt-0.5">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
            Account
          </p>
          <Link href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings size={17} className="text-slate-500" />
            Settings
          </Link>
          <Link href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} className="text-slate-500" />
            Exit Dashboard
          </Link>
        </div>
      </nav>

      {/* Role badge at bottom */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            Super Admin
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile: hamburger + drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-50 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
              />
              {/* Drawer */}
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 z-50"
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
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