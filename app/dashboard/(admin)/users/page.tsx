// SERVER COMPONENT
import { Metadata } from 'next';
import { Users } from 'lucide-react';
import { mockUsers } from '@/data/mock-data';
import UsersClient from '@/components/dashboard/admin/users/Usersclient';

export const metadata: Metadata = { title: 'User Management — Admin' };

export default async function AdminUsersPage() {
  const users = mockUsers; // swap: await prisma.user.findMany()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Users size={20} className="text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            User Management
          </h1>
          <p className="text-sm text-slate-500">{users.length} total users across all roles</p>
        </div>
      </div>
      <UsersClient initialUsers={users} />
    </div>
  );
}