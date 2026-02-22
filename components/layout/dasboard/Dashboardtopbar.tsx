'use client';

import { useState } from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type { User as UserType } from '@data/types';
import { mockNotifications } from '@/data/mock-data';

interface Props { user: UserType }

export default function DashboardTopbar({ user }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);

  const adminNotifs = mockNotifications.filter((n) => !n.isRead).slice(0, 5);
  const unreadCount = adminNotifs.length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 h-16 flex items-center px-4 sm:px-6 lg:px-8 gap-4 lg:ml-0">
      {/* Left spacer for mobile menu button */}
      <div className="w-10 lg:hidden shrink-0" />

      {/* Search */}
      <div className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users, orders, products..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
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
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-sm">Notifications</p>
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {adminNotifs.map((n) => (
                    <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-slate-300' : 'bg-amber-500'}`} />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center border-t border-slate-100">
                  <Link href="/admin" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name[0]}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Super Admin</p>
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
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                </div>
                {[
                  { icon: User,     label: 'Profile',  href: '/admin/settings' },
                  { icon: Settings, label: 'Settings', href: '/admin/settings' },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={label} href={href}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Icon size={15} className="text-slate-500" />
                    {label}
                  </Link>
                ))}
                <div className="border-t border-slate-100 mt-1">
                  <Link href="/"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
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