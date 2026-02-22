'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Store, X, Star, Package, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VendorProfile } from '@/types';
import AdminDataTable, { Column } from '@/components/dashboard/admin/AdminDataTable';
import ConfirmModal from '@/components/dashboard/admin/ConfirmModal';
import { mockUsers } from '@/data/mock-data';

export default function VendorsClient({ initialVendors }: { initialVendors: VendorProfile[] }) {
  const [vendors,    setVendors]    = useState(initialVendors);
  const [viewTarget, setViewTarget] = useState<VendorProfile | null>(null);
  const [approveTarget, setApproveTarget] = useState<{ vendor: VendorProfile; approve: boolean } | null>(null);
  const [filter,     setFilter]     = useState<'all' | 'approved' | 'pending'>('all');

  const filtered = vendors.filter((v) => {
    if (filter === 'approved') return v.isApproved;
    if (filter === 'pending')  return !v.isApproved;
    return true;
  });

  const handleApproval = () => {
    if (!approveTarget) return;
    setVendors((prev) =>
      prev.map((v) =>
        v.id === approveTarget.vendor.id ? { ...v, isApproved: approveTarget.approve } : v
      )
    );
    setApproveTarget(null);
  };

  const getUser = (userId: string) => mockUsers.find((u) => u.id === userId);

  const columns: Column<VendorProfile>[] = [
    {
      key: 'storeName',
      label: 'Store',
      sortable: true,
      render: (v) => {
        const user = getUser(v.userId);
        return (
          <div className="flex items-center gap-3">
            {v.logo ? (
              <img src={v.logo} alt={v.storeName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                {v.storeName[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 text-sm">{v.storeName}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          {v.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'totalProducts',
      label: 'Products',
      sortable: true,
      render: (v) => (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Package size={13} className="text-slate-400" />
          {v.totalProducts}
        </span>
      ),
    },
    {
      key: 'totalSales',
      label: 'Sales',
      sortable: true,
      render: (v) => (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <ShoppingBag size={13} className="text-slate-400" />
          {v.totalSales.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'isApproved',
      label: 'Status',
      render: (v) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
          v.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${v.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {v.isApproved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Applied',
      sortable: true,
      render: (v) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
  ];

  const filterSlot = (
    <div className="flex bg-slate-100 rounded-xl p-1">
      {(['all', 'approved', 'pending'] as const).map((f) => (
        <button key={f} onClick={() => setFilter(f)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
            filter === f ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );

  const actions = (v: VendorProfile) => (
    <div className="flex items-center justify-end gap-2">
      <button onClick={() => setViewTarget(v)}
        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors" title="View">
        <Eye size={14} />
      </button>
      {!v.isApproved ? (
        <button onClick={() => setApproveTarget({ vendor: v, approve: true })}
          className="w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition-colors" title="Approve">
          <CheckCircle2 size={14} />
        </button>
      ) : (
        <button onClick={() => setApproveTarget({ vendor: v, approve: false })}
          className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors" title="Revoke approval">
          <XCircle size={14} />
        </button>
      )}
    </div>
  );

  const pending = vendors.filter((v) => !v.isApproved).length;
  const approved = vendors.filter((v) => v.isApproved).length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Vendors',    value: vendors.length, color: 'bg-blue-50',    text: 'text-blue-700' },
          { label: 'Approved',         value: approved,        color: 'bg-green-50',   text: 'text-green-700' },
          { label: 'Pending Approval', value: pending,         color: pending > 0 ? 'bg-yellow-50' : 'bg-slate-50', text: pending > 0 ? 'text-yellow-700' : 'text-slate-500' },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`${color} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${text}`}>{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        searchKeys={['storeName']}
        searchPlaceholder="Search by store name..."
        actions={actions}
        filterSlot={filterSlot}
        pageSize={8}
        emptyMessage="No vendors found."
      />

      {/* Approve/Revoke confirm modal */}
      <ConfirmModal
        open={!!approveTarget}
        title={approveTarget?.approve ? `Approve ${approveTarget?.vendor.storeName}?` : `Revoke ${approveTarget?.vendor.storeName}?`}
        description={
          approveTarget?.approve
            ? 'This vendor will be approved and able to list products on ElectroMart immediately.'
            : 'This will revoke vendor approval. Their products will be unlisted until re-approved.'
        }
        confirmLabel={approveTarget?.approve ? 'Yes, Approve' : 'Yes, Revoke'}
        danger={!approveTarget?.approve}
        onConfirm={handleApproval}
        onCancel={() => setApproveTarget(null)}
      />

      {/* View vendor modal */}
      <AnimatePresence>
        {viewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            >
              <button onClick={() => setViewTarget(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={15} />
              </button>
              <div className="flex items-center gap-4 mb-5">
                {viewTarget.logo ? (
                  <img src={viewTarget.logo} alt={viewTarget.storeName} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-2xl">
                    {viewTarget.storeName[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-black text-slate-900">{viewTarget.storeName}</h3>
                  <p className="text-sm text-slate-500">{getUser(viewTarget.userId)?.email}</p>
                </div>
              </div>
              {viewTarget.bio && <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-4 leading-relaxed">{viewTarget.bio}</p>}
              <div className="space-y-2.5">
                {[
                  { label: 'Rating',    value: `${viewTarget.rating.toFixed(1)} ★` },
                  { label: 'Products',  value: viewTarget.totalProducts },
                  { label: 'Sales',     value: viewTarget.totalSales.toLocaleString() },
                  { label: 'Status',    value: viewTarget.isApproved ? 'Approved' : 'Pending' },
                  { label: 'Joined',    value: new Date(viewTarget.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) },
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