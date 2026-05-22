import type { ReactNode } from 'react';
import DashboardShell from '@/components/layout/dasboard/DashboardShell';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell allowedRoles={['SUPER_ADMIN']}>
      {children}
    </DashboardShell>
  );
}
