"use client";

import { Hash, Tag, TrendingUp } from "lucide-react";

/* ── Stats Cards ────────────────────────────────────── */
export default function CouponStatsCards({
  total,
  active,
  totalUsed,
}: {
  total: number;
  active: number;
  totalUsed: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        {
          label: "Total Coupons",
          value: total,
          icon: Tag,
          color: "bg-amber-100 text-amber-700",
        },
        {
          label: "Active",
          value: active,
          icon: TrendingUp,
          color: "bg-green-100 text-green-700",
        },
        {
          label: "Total Used",
          value: totalUsed,
          icon: Hash,
          color: "bg-blue-100 text-blue-700",
        },
      ].map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
          >
            <Icon size={18} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
