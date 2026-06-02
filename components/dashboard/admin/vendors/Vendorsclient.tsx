"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye } from "lucide-react";
import AdminDataTable, { Column } from "../Admindatatable";
import ConfirmModal from "../Confirmmodal";
import { getAllStores, StoreDto } from "@/api/store.api";
import api from "@/api/axios";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";

interface VendorDto extends StoreDto {
  ownerName?: string | null;
}

const mapMockVendorToVendorDto = (v: any): VendorDto => ({
  id: v.id,
  name: v.storeName,
  slug: v.storeName.toLowerCase().replace(/ /g, '-'),
  logo: v.logo || null,
  avatar: v.logo || null,
  coverImage: v.coverImage || null,
  description: v.bio || null,
  isApproved: v.isApproved,
  isActive: true,
  totalSales: v.totalSales,
  totalRevenue: 0,
  rating: v.rating,
  createdAt: v.createdAt,
  returnPolicy: null,
  shippingPolicy: null,
  taxId: null,
  currency: 'USD',
  payoutCycle: 'MONTHLY',
  minPayout: '100',
  autoAcceptOrders: true,
  autoUpdateStock: true,
  notifNewOrder: true,
  notifOrderCancelled: true,
  notifLowStock: true,
  notifNewReview: true,
  notifPayoutSent: true,
  notifReturnRequest: true,
  notifWeeklyReport: true,
  notifMarketingTips: true,
  ownerName: v.ownerName || 'Unknown Owner',
});

export default function VendorsClient({ initialVendors }: { initialVendors?: any[] }) {
  const [vendors, setVendors] = useState<VendorDto[]>(() => (initialVendors || []).map(mapMockVendorToVendorDto));
  const [loading, setLoading] = useState(true);
  const [approveTarget, setApproveTarget] = useState<VendorDto | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorDto | null>(null);
  const [processing, setProcessing] = useState(false);
  const [viewVendor, setViewVendor] = useState<VendorDto | null>(null);

  useEffect(() => {
    getAllStores()
      .then((res) => {
        if (res.data?.data) {
          setVendors(res.data.data);
        }
      })
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load vendors, using offline data.")))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async () => {
    if (!approveTarget) return;
    setProcessing(true);
    try {
      const res = await api.patch<ApiResponse<VendorDto>>(`/stores/${approveTarget.id}/approve`);
      const updated = res.data.data;
      setVendors((prev) => prev.map((v) => (v.id === approveTarget.id ? updated : v)));
      toast.success("Store approved");
      setApproveTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to approve store"));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setProcessing(true);
    try {
      const res = await api.delete<ApiResponse<VendorDto>>(`/stores/${rejectTarget.id}`);
      setVendors((prev) => prev.filter((v) => v.id !== rejectTarget.id));
      toast.success("Store rejected and removed");
      setRejectTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to reject store"));
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<VendorDto>[] = [
    {
      key: "name",
      label: "Store",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          {s.avatar ? (
            <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
              {s.name[0]}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-900 text-sm">{s.name}</p>
            <p className="text-xs text-slate-400">{s.ownerName ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (s) => (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
          s.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        }`}>{s.isApproved ? "Approved" : "Pending"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (s) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  const actions = (s: VendorDto) => (
    <div className="flex items-center gap-2">
      <button onClick={() => setViewVendor(s)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-amber-100 text-slate-500 hover:text-amber-700 transition-colors" title="View details">
        <Eye size={14} />
      </button>
      {!s.isApproved && (
        <>
          <button onClick={() => setApproveTarget(s)} className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors" title="Approve store">
            <CheckIcon size={14} />
          </button>
          <button onClick={() => setRejectTarget(s)} className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors" title="Reject store">
            <X size={14} />
          </button>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-14" />
        ))}
      </div>
    );
  }

  return (
    <>
      <AdminDataTable
        data={vendors}
        columns={columns}
        searchKeys={["name", "ownerName"]}
        searchPlaceholder="Search stores..."
        actions={actions}
        pageSize={8}
        emptyMessage="No vendor stores found."
      />

      {/* Approve confirmation */}
      <ConfirmModal
        open={!!approveTarget}
        title={`Approve ${approveTarget?.name}?`}
        description="This will mark the store as approved and allow it to be visible to customers."
        confirmLabel="Yes, Approve"
        danger={false}
        onConfirm={handleApprove}
        onCancel={() => setApproveTarget(null)}
      />

      {/* Reject confirmation */}
      <ConfirmModal
        open={!!rejectTarget}
        title={`Reject ${rejectTarget?.name}?`}
        description="The store will be removed permanently."
        confirmLabel="Yes, Reject"
        danger={true}
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
      />

      {/* View modal */}
      <AnimatePresence>
        {viewVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewVendor(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            >
              <button onClick={() => setViewVendor(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={15} />
              </button>
              <div className="flex items-center gap-4 mb-5">
                {viewVendor.avatar ? (
                  <img src={viewVendor.avatar} alt={viewVendor.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-2xl">
                    {viewVendor.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-black text-slate-900">{viewVendor.name}</h3>
                  <p className="text-sm text-slate-500">Owner: {viewVendor.ownerName ?? "N/A"}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Status", value: viewVendor.isApproved ? "Approved" : "Pending" },
                  { label: "Created", value: new Date(viewVendor.createdAt).toLocaleDateString("en-US", { dateStyle: "long" }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">{String(value)}</span>
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

function CheckIcon({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>;
}