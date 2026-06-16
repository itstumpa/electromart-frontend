"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Eye,
  Loader2,
  Pencil,
  Percent,
  Plus,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { AdminCoupon } from "@/src/services/api/admin.api";
import CouponStatusBadge from "./CouponStatusBadge";

/* ── Coupon Table ──────────────────────────────────── */
interface CouponTableProps {
  coupons: AdminCoupon[];
  filtered: AdminCoupon[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  filter: "ALL" | "ACTIVE" | "INACTIVE";
  setFilter: (v: "ALL" | "ACTIVE" | "INACTIVE") => void;
  onView: (coupon: AdminCoupon) => void;
  onEdit: (coupon: AdminCoupon) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onNew: () => void;
}

export default function CouponTable({
  coupons,
  filtered,
  loading,
  search,
  setSearch,
  filter,
  setFilter,
  onView,
  onEdit,
  onToggle,
  onDelete,
  onNew,
}: CouponTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await onDelete(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f
                  ? "bg-amber-600 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
        >
          <Plus size={16} />
          New Coupon
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Code",
                  "Type",
                  "Value",
                  "Min Order",
                  "Usage",
                  "Expiry",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Loader2 size={32} className="text-slate-300 mx-auto mb-3 animate-spin" />
                      <p className="text-sm font-bold text-slate-400">
                        Loading coupons...
                      </p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Tag size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-400">
                        No coupons found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((coupon, i) => (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* Code */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg tracking-wider">
                          {coupon.code}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
                            coupon.discountType === "PERCENTAGE"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {coupon.discountType === "PERCENTAGE" ? (
                            <Percent size={10} />
                          ) : (
                            <DollarSign size={10} />
                          )}
                          {coupon.discountType === "PERCENTAGE"
                            ? "Percentage"
                            : "Fixed"}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-black text-slate-900">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}
                        </span>
                        {coupon.maxDiscount && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            max ${coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      {/* Min order */}
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {coupon.minOrderAmount ? (
                          `$${coupon.minOrderAmount}`
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {coupon.usedCount}
                            {coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                          </span>
                          {coupon.usageLimit && (
                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  coupon.usedCount / coupon.usageLimit >= 1
                                    ? "bg-red-500"
                                    : coupon.usedCount / coupon.usageLimit >=
                                        0.8
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5">
                        {coupon.expiryDate ? (
                          <span
                            className={`text-xs font-semibold flex items-center gap-1 ${
                              new Date(coupon.expiryDate) < new Date()
                                ? "text-red-500"
                                : "text-slate-600"
                            }`}
                          >
                            <Calendar size={11} />
                            {new Date(coupon.expiryDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                              },
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <CouponStatusBadge coupon={coupon} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onView(coupon)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => onEdit(coupon)}
                            className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => onToggle(coupon.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              coupon.isActive
                                ? "bg-green-50 hover:bg-green-100 text-green-600"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-400"
                            }`}
                            title={coupon.isActive ? "Deactivate" : "Activate"}
                          >
                            {coupon.isActive ? (
                              <ToggleRight size={13} />
                            ) : (
                              <ToggleLeft size={13} />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteId(coupon.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
            >
              <h3 className="text-base font-black text-slate-900 mb-2">
                Delete Coupon?
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                This will permanently delete the coupon{" "}
                <span className="font-mono font-bold text-slate-800">
                  {coupons.find((c) => c.id === deleteId)?.code}
                </span>
                . This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
