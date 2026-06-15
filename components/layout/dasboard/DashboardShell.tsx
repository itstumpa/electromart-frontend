'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/api/auth.api';
import type { User, UserRole } from '@/data/types';
import { mapMeToUser } from '@/lib/user-mappers';
import { authStorage } from '@/utils/auth-storage';
import DashboardSidebar from './Dashboardsidebar';
import DashboardTopbar from './Dashboardtopbar';

interface Props {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function DashboardShell({ children, allowedRoles }: Props) {
  const router          = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const allowedRolesRef = useRef(allowedRoles);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res    = await getMe();
        const mapped = mapMeToUser(res.data.data);

        if (cancelled) return;

        if (!allowedRolesRef.current.includes(mapped.role)) {
          router.replace('/login');
          return;
        }

        authStorage.setAuthUser({
          id:     mapped.id,
          name:   mapped.name,
          email:  mapped.email,
          role:   mapped.role,
          avatar: mapped.avatar,
        });
        setUser(mapped);
      } catch (err) {
        console.error('DashboardShell error:', err);
        if (!cancelled) router.replace('/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar
        role={user.role}
        compact={sidebarCompact}
        onToggleCompact={() => setSidebarCompact((c) => !c)}
      />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${sidebarCompact ? 'md:ml-16' : 'md:ml-64'}`}>
        <DashboardTopbar user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}