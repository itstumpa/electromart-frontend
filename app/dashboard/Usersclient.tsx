'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, UserX, Eye, Shield,
  Users, UserCog, Truck, Store, X, ChevronDown,
} from 'lucide-react';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mock-data';
import AdminDataTable, { Column } from '@/components/dashboard/admin/AdminDataTable';
import ConfirmModal from '@/components/dashboard/admin/ConfirmModal';

const roleConfig: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
  SUPER_ADMIN: { label: 'Admin',    color: 'bg-purple-100 text-purple-700', icon: Shield },
  VENDOR:      { label: 'Vendor',   color: 'bg-blue-100 text-blue-700',     icon: Store },
  CUSTOMER:    { label: 'Customer', color: 'bg-green-100 text-green-700',   icon: UserCog },
  DELIVERY:    { label: 'Delivery', color: 'bg-orange-100 text-orange-700', icon: Truck },
};

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users,      setUsers]      = useState(initialUsers);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [banTarget,  setBanTarget]  = useState<User | null>(null);
  const [viewUser,   setViewUser]   = useState<User | null>(null);

  const filtered = roleFilter ? users.filter((u) => u.role === roleFilter) : users;

  const handleToggleBan = () => {
    if (!banTarget) return;
    setUsers((prev) =>
      prev.map((u) => u.id === banTarget.id ? { ...u, isBanned: !u.isBanned } : u)
    );
    setBanTarget(null);
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          {u.avatar ? (
            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
              {u.name[0]}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-900 text-sm">{u.name}</p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (u) => {
        const cfg = roleConfig[u.role];
        const Icon = cfg.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
            <Icon size={11} />
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: 'isVerified',
      label: 'Verified',
      render: (u) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {u.isVerified ? '✓ Verified' : 'Unverified'}
        </span>
      ),
    },
    {
      key: 'isBanned',
      label: 'Status',
      render: (u) => (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${u.isBanned ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${u.isBanned ? 'bg-red-500' : 'bg-emerald-500'}`} />
          {u.isBanned ? 'Banned' : 'Active'}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (u) => <span className="text-xs text-slate-500">{u.phone ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (u) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
  ];

  const filterSlot = (
    <div className="relative">
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
        className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        <option value="">All Roles</option>
        <option value="SUPER_ADMIN">Admin</option>
        <option value="VENDOR">Vendor</option>
        <option value="CUSTOMER">Customer</option>
        <option value="DELIVERY">Delivery</option>
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );

  const actions = (u: User) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setViewUser(u)}
        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors"
        title="View details"
      >
        <Eye size={14} />
      </button>
      {u.role !== 'SUPER_ADMIN' && (
        <button
          onClick={() => setBanTarget(u)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            u.isBanned
              ? 'bg-green-100 hover:bg-green-200 text-green-700'
              : 'bg-red-100 hover:bg-red-200 text-red-600'
          }`}
          title={u.isBanned ? 'Unban user' : 'Ban user'}
        >
          {u.isBanned ? <UserCheck size={14} /> : <UserX size={14} />}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(roleConfig).map(([role, cfg]) => {
          const Icon = cfg.icon;
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{count}</p>
                <p className="text-xs text-slate-400 font-medium">{cfg.label}s</p>
              </div>
            </div>
          );
        })}
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        searchKeys={['name', 'email', 'phone']}
        searchPlaceholder="Search by name, email or phone..."
        actions={actions}
        filterSlot={filterSlot}
        pageSize={8}
        emptyMessage="No users found matching your filters."
      />

      {/* Ban/Unban confirm modal */}
      <ConfirmModal
        open={!!banTarget}
        title={banTarget?.isBanned ? `Unban ${banTarget?.name}?` : `Ban ${banTarget?.name}?`}
        description={
          banTarget?.isBanned
            ? 'This will restore the user\'s access to ElectroMart. They will be able to log in immediately.'
            : 'This will immediately revoke the user\'s access. They will not be able to log in until unbanned.'
        }
        confirmLabel={banTarget?.isBanned ? 'Yes, Unban' : 'Yes, Ban User'}
        danger={!banTarget?.isBanned}
        onConfirm={handleToggleBan}
        onCancel={() => setBanTarget(null)}
      />

      {/* View user detail modal */}
      <AnimatePresence>
        {viewUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewUser(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            >
              <button onClick={() => setViewUser(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={15} />
              </button>
              <div className="flex items-center gap-4 mb-5">
                {viewUser.avatar ? (
                  <img src={viewUser.avatar} alt={viewUser.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-2xl">
                    {viewUser.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-black text-slate-900">{viewUser.name}</h3>
                  <p className="text-sm text-slate-500">{viewUser.email}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${roleConfig[viewUser.role].color}`}>
                    {roleConfig[viewUser.role].label}
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Phone',    value: viewUser.phone ?? 'N/A' },
                  { label: 'Verified', value: viewUser.isVerified ? 'Yes' : 'No' },
                  { label: 'Status',   value: viewUser.isBanned ? 'Banned' : 'Active' },
                  { label: 'Joined',   value: new Date(viewUser.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}