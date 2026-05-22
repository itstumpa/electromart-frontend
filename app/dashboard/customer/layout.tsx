import type { ReactNode } from 'react';
import DashboardShell from '@/components/layout/dasboard/DashboardShell';

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell allowedRoles={['CUSTOMER']}>
      {children}
    </DashboardShell>
  );
}
