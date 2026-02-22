// SERVER COMPONENT — layout shell, no interactivity needed
import type { ReactNode } from 'react';

import { mockUsers } from '@/data/mock-data';
import DashboardTopbar from '@/components/layout/dasboard/Dashboardtopbar';
import DashboardSidebar from '@/components/layout/dasboard/Dashboardsidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // In production: get from session/auth
  const currentUser = mockUsers.find((u) => u.role === 'SUPER_ADMIN')!;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed sidebar — server rendered, static nav */}
      <DashboardSidebar role={currentUser.role} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <DashboardTopbar user={currentUser} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}