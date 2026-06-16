"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Tag, X } from "lucide-react";
import { useState } from "react";
import type { AdminCoupon } from "@/src/services/api/admin.api";

/* ── View Modal ─────────────────────────────────────── */
export default function CouponDetailModal({
  coupon,
  onClose,
}: {
  coupon: AdminCoupon;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const usagePct = coupon.usageLimit
    ? Math.round((coupon.usedCount / coupon.usageLimit) * 100)
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={15} />
          </button>

          {/* Code badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Tag size={16} className="text-amber-700 shrink-0" />
              <span className="font-mono font-black text-amber-800 text-lg tracking-wider">
                {coupon.code}
              </span>
            </div>
            <button
              onClick={copy}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              {copied ? (
                <CheckCircle2 size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Discount",
                value:
                  coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`,
              },
              {
                label: "Type",
                value:
                  coupon.discountType === "PERCENTAGE"
                    ? "Percentage"
                    : "Fixed Amount",
              },
              ...(coupon.minOrderAmount != null
                ? [{ label: "Min Order", value: `$${coupon.minOrderAmount}` }]
                : []),
              ...(coupon.maxDiscount != null
                ? [{ label: "Max Discount", value: `$${coupon.maxDiscount}` }]
                : []),
              ...(coupon.expiryDate
                ? [
                    {
                      label: "Expires",
                      value: new Date(coupon.expiryDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      ),
                    },
                  ]
                : []),
              {
                label: "Status",
                value: coupon.isActive ? "Active" : "Inactive",
              },
              {
                label: "Created",
                value: new Date(coupon.createdAt).toLocaleDateString(),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-slate-50"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    label === "Status"
                      ? value === "Active"
                        ? "text-green-600"
                        : "text-slate-400"
                      : "text-slate-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}

            {/* Usage bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Usage
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} used
                </span>
              </div>
              {usagePct !== null && (
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${usagePct >= 100 ? "bg-red-500" : usagePct >= 80 ? "bg-amber-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
