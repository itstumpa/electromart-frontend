import type { ReactNode } from 'react';
import DashboardShell from '@/components/layout/dasboard/DashboardShell';

export default function VendorDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell allowedRoles={['VENDOR']}>
      {children}
    </DashboardShell>
  );
}
