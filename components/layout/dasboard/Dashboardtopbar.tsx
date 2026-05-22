'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, ChevronDown, LogOut, User, Settings, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { User as UserType, UserRole } from '@/data/types';
import { getMyNotifications } from '@/api/notification.api';
import { mapNotificationDtoToUi } from '@/lib/notification-mappers';
import { authStorage } from '@/utils/auth-storage';
import { logoutUser } from '@/api/auth.api';
import { toast } from 'sonner';

// ─── Role-specific topbar config ─────────────────────────────
const ROLE_CONFIG: Record<UserRole, {
  searchPlaceholder: string;
  showSearch: boolean;
  settingsHref: string;
  profileHref: string;
  roleLabel: string;
  accentColor: string;
}> = {
  SUPER_ADMIN: {
    searchPlaceholder: 'Search users, orders, products...',
    showSearch: true,
    settingsHref: '/dashboard/admin/settings',
    profileHref:  '/dashboard/admin/profile',
    roleLabel: 'Super Admin',
    accentColor: 'text-purple-600 bg-purple-50',
  },
  VENDOR: {
    searchPlaceholder: 'Search products, orders...',
    showSearch: true,
    settingsHref: '/dashboard/vendor/settings',
    profileHref:  '/dashboard/vendor/profile',
    roleLabel: 'Vendor',
    accentColor: 'text-blue-600 bg-blue-50',
  },
  CUSTOMER: {
    searchPlaceholder: 'Search orders, products...',
    showSearch: false,   // customers use the storefront search
    settingsHref: '/dashboard/customer/settings',
    profileHref:  '/dashboard/customer/profile',
    roleLabel: 'Customer',
    accentColor: 'text-green-600 bg-green-50',
  },
  DELIVERY: {
    searchPlaceholder: 'Search deliveries...',
    showSearch: false,
    settingsHref: '/dashboard/delivery/settings',
    profileHref:  '/dashboard/delivery/profile',
    roleLabel: 'Delivery Agent',
    accentColor: 'text-orange-600 bg-orange-50',
  },
};

interface Props { user: UserType }

export default function DashboardTopbar({ user }: Props) {
  const pathname  = usePathname();
  const [activeUser, setActiveUser] = useState<UserType>(user);
  const config    = ROLE_CONFIG[activeUser.role];
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [notifs, setNotifs] = useState<ReturnType<typeof mapNotificationDtoToUi>[]>([]);

  useEffect(() => {
    const storedUser = authStorage.getAuthUser();
    if (!storedUser) return;

    setActiveUser((prev) => ({
      ...prev,
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      role: storedUser.role as UserRole,
      avatar: storedUser.avatar,
    }));
  }, []);

  useEffect(() => {
    getMyNotifications()
      .then((res) => setNotifs((res.data.data ?? []).map(mapNotificationDtoToUi).slice(0, 5)))
      .catch(() => setNotifs([]));
  }, [activeUser.id]);

  const unread = notifs.filter((n) => !n.isRead).length;
  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch {
      // even if API fails, clear stale session client-side
    } finally {
      authStorage.clearSession();
      toast.success('You are logged out');
      setProfileOpen(false);
    }
  };


  // Breadcrumb: derive from pathname
  const segments = pathname.split('/').filter(Boolean);
  const crumb    = segments.length > 2
    ? segments[segments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 h-16 flex items-center px-4 sm:px-6 lg:px-8 gap-4">

      {/* Mobile menu spacer */}
      <div className="w-10 lg:hidden shrink-0" />

      {/* Breadcrumb (desktop) */}
      {crumb && (
        <div className="hidden md:flex items-center gap-2 text-sm min-w-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.accentColor}`}>
            {config.roleLabel}
          </span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-700 truncate">{crumb}</span>
        </div>
      )}

      {/* Search — only shown for roles that need it */}
      {config.showSearch && (
        <div className="flex-1 max-w-sm hidden sm:block">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="text" placeholder={config.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">

        {/* ── Notifications ── */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">Notifications</p>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{unread} new</span>
                    )}
                    <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">No notifications</div>
                  ) : notifs.map((n) => (
                    <div key={n.id}
                      className={`flex gap-3 px-4 py-3 border-b border-slate-50 transition-colors cursor-pointer ${n.isRead ? 'hover:bg-slate-50' : 'bg-amber-50 hover:bg-amber-100'}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-slate-300' : 'bg-amber-500'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-tight">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <Link
                    href={`${activeUser.role === 'SUPER_ADMIN' ? '/dashboard/admin' : activeUser.role === 'VENDOR' ? '/dashboard/vendor' : '/dashboard/customer'}/notifications`}
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Profile dropdown ── */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
          >
            {activeUser.avatar ? (
              <Image src={activeUser.avatar} alt={activeUser.name} width={28} height={28} className="w-7 h-7 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {activeUser.name[0]}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{activeUser.name}</p>
              <p className={`text-[10px] font-bold uppercase tracking-wide ${config.accentColor} rounded px-1`}>
                {config.roleLabel}
              </p>
            </div>
            <ChevronDown size={13} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1"
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 truncate">{activeUser.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{activeUser.email}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${config.accentColor}`}>
                    {config.roleLabel}
                  </span>
                </div>

                {/* Role-specific links */}
                {[
                  { icon: User,     label: 'My Profile',  href: config.profileHref },
                  { icon: Settings, label: 'Settings',    href: config.settingsHref },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={label} href={href}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Icon size={15} className="text-slate-400" />
                    {label}
                  </Link>
                ))}

                <div className="border-t border-slate-100 mt-1">
                  <Link href="/" onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={15} />
                    Sign Out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}