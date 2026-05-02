// SERVER COMPONENT — Customer dashboard shell
import type { ReactNode } from 'react';
import { mockUsers } from '@/data/mock-data';
import DashboardSidebar from '@/components/layout/dasboard/Dashboardsidebar';
import DashboardTopbar from '@/components/layout/dasboard/Dashboardtopbar';

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  // Production: const user = await getServerSession(authOptions) → verify role === 'CUSTOMER'
  const user = mockUsers.find((u) => u.role === 'CUSTOMER')!;
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role={user.role} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <DashboardTopbar user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}