'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, PanelRightClose, PanelRightOpen,
  LogOut, Settings, User,
  ArrowBigLeft,
} from 'lucide-react';
import type { UserRole } from '@/data/types';
import { authStorage } from '@/utils/auth-storage';
import { logoutUser } from '@/src/services/api/auth.api';
import { getAdminDashboard } from '@/src/services/api/admin.api';
import { toast } from 'sonner';
import {
  NAV_BY_ROLE,
  ROLE_LABEL,
  ROLE_ROOT,
  type NavItem,
} from '@/lib/dashboard-nav.config';

interface Props {
  role: UserRole;
  compact?: boolean;
  onToggleCompact?: () => void;
}

export default function DashboardSidebar({ role, compact = false, onToggleCompact }: Props) {
  const pathname    = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [vendorCount, setVendorCount] = useState<number | null>(null);

  // Fetch vendor count for admin roles
  useEffect(() => {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      getAdminDashboard()
        .then((res) => {
          const count = res.data.data?.totalStores;
          if (typeof count === 'number') setVendorCount(count);
        })
        .catch(() => { /* silently ignore — badge simply won't show */ });
    }
  }, [role]);

  // Build nav items with dynamic badges
  const navItems: NavItem[] = (() => {
    const items = NAV_BY_ROLE[role];
    if ((role === 'SUPER_ADMIN' || role === 'ADMIN') && vendorCount !== null) {
      return items.map((item) =>
        item.href === '/dashboard/admin/vendors'
          ? { ...item, badge: vendorCount }
          : item,
      );
    }
    return items;
  })();
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

  const SidebarContent = ({ compact: isCompact }: { compact?: boolean }) => (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className={`${isCompact ? 'px-3 py-4' : 'px-5 py-5'} border-b border-slate-100 shrink-0`}>
        <Link href="/" className={`flex items-center ${isCompact ? 'justify-center' : 'gap-2.5'} group`}>
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-sm shrink-0">
            <span
              className="text-white font-black text-base"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              E
            </span>
          </div>
          {!isCompact && (
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
          )}
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className={`flex-1 ${isCompact ? 'px-2 py-4' : 'px-3 py-4'} space-y-0.5 overflow-y-auto`}>
        {!isCompact && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
            Main Menu
          </p>
        )}
        {navItems.map((item) =>
          isCompact ? (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={[
                'flex items-center justify-center px-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative',
                isActive(item.href)
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')}
              title={item.label}
            >
              <item.icon size={17} className={isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
            </Link>
          ) : (
            <NavLink key={item.href} item={item} />
          )
        )}

        {/* ── Account section — links are dynamic per role ── */}
        <div className={`${isCompact ? 'flex flex-col items-center' : ''} pt-4 mt-4 border-t border-slate-100 space-y-0.5`}>
          {!isCompact && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
              Account
            </p>
          )}
          {isCompact ? (
            <>
              <Link
                href={`${roleRoot}/profile`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-2 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="My Profile"
              >
                <User size={17} className="text-slate-400" />
              </Link>
              <Link
                href={`${roleRoot}/settings`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-2 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Settings"
              >
                <Settings size={17} className="text-slate-400" />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center px-2 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                title="Back to Store"
              >
                <ArrowBigLeft size={17} className="text-slate-400 group-hover:text-red-500" />
              </Link>
              <Link
                href="/"
                onClick={handleSignOut}
                className="flex items-center justify-center px-2 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                title="Logout"
              >
                <LogOut size={17} className="text-slate-400 group-hover:text-red-500" />
              </Link>
            </>
          ) : (
            <>
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
              >
                <ArrowBigLeft size={17} className="text-slate-400 group-hover:text-red-500" />
                Back to Store
              </Link>
              <Link
                href="/"
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
              >
                <LogOut size={17} className="text-slate-400 group-hover:text-red-500" />
                Logout
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Role badge ── */}
      {isCompact ? (
        <div className="px-2 py-4 border-t border-slate-100 shrink-0 flex justify-center">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" title={ROLE_LABEL[role]} />
        </div>
      ) : (
        <div className="px-4 py-4 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-amber-800">
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop + Tablet: fixed sidebar (md+) ── */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-100 transition-all duration-200 ${compact ? 'w-16' : 'w-64 shadow-2xl'}`}>
        {compact ? (
          <>
            <SidebarContent compact />
            <button
              onClick={onToggleCompact}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-amber-100 hover:text-amber-600 transition-colors"
              title="Expand sidebar"
            >
              <PanelRightOpen size={14} />
            </button>
          </>
        ) : (
          <>
            <SidebarContent />
            <button
              onClick={onToggleCompact}
              className="absolute bottom-4 right-3 w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-amber-100 hover:text-amber-600 transition-colors"
              title="Collapse sidebar"
            >
              <PanelRightClose size={14} />
            </button>
          </>
        )}
      </aside>

      {/* ── Mobile: hamburger + drawer (< md) ── */}
      <div className="md:hidden">
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