"use client";

import { getMyReturnRequests, type ReturnRequestDto } from "@/src/services/api/return.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, RotateCcw, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending Review",                color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500",  icon: Clock },
  APPROVED:  { label: "Approved",                       color: "bg-green-100 text-green-700",   dot: "bg-green-500",   icon: CheckCircle2 },
  REJECTED:  { label: "Rejected",                       color: "bg-red-100 text-red-600",       dot: "bg-red-500",     icon: XCircle },
  RETURNED:  { label: "Returned",                       color: "bg-purple-100 text-purple-700", dot: "bg-purple-500",  icon: RotateCcw },
  REFUNDED:  { label: "Refunded",                       color: "bg-teal-100 text-teal-700",     dot: "bg-teal-500",    icon: CheckCircle2 },
  COMPLETED: { label: "Completed",                      color: "bg-slate-100 text-slate-700",   dot: "bg-slate-500",   icon: CheckCircle2 },
};

export default function ReturnsClient() {
  const [returns, setReturns] = useState<ReturnRequestDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getMyReturnRequests()
      .then((res) => setReturns(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load returns")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Returns</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Returns</h1>
          <p className="text-sm text-slate-400 mt-0.5">{returns.length} return request{returns.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total", value: returns.length, color: "text-slate-900", bg: "bg-white" },
          { label: "Pending", value: returns.filter((r) => r.status === "PENDING").length, color: "text-yellow-700", bg: "bg-yellow-50" },
          { label: "Approved", value: returns.filter((r) => r.status === "APPROVED").length, color: "text-green-700", bg: "bg-green-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl border border-slate-100 p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Return list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {returns.map((ret, i) => {
            const s = STATUS_CONFIG[ret.status] ?? STATUS_CONFIG.PENDING;
            return (
              <motion.div
                key={ret.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all"
              >
                <Link href={`/dashboard/customer/returns/${ret.id}`} className="block p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(ret.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {ret.orderItem?.product.name ?? "Product"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {ret.reason}
                  </p>
                  {ret.status === "APPROVED" && (
                    <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs font-bold text-green-700">
                        ✅ Your return request has been approved. Please return the parcel within 2 business days. Returns received after this period may not be accepted.
                      </p>
                    </div>
                  )}
                  {ret.vendorNote && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      Vendor note: {ret.vendorNote}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {returns.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <RotateCcw size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No return requests yet</p>
            <p className="text-xs text-slate-400 mt-1">You can request a return on delivered items from your orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
