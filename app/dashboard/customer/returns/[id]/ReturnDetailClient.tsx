"use client";

import { getMyReturnRequests, type ReturnRequestDto } from "@/api/return.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Calendar, MessageSquare, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending Review",                color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500",  icon: Clock },
  APPROVED:  { label: "Approved",                       color: "bg-green-100 text-green-700 border-green-200",   dot: "bg-green-500",   icon: CheckCircle2 },
  REJECTED:  { label: "Rejected",                       color: "bg-red-100 text-red-600 border-red-200",         dot: "bg-red-500",     icon: XCircle },
  RETURNED:  { label: "Returned",                       color: "bg-purple-100 text-purple-700 border-purple-200",dot: "bg-purple-500",  icon: RotateCcw },
  REFUNDED:  { label: "Refunded",                       color: "bg-teal-100 text-teal-700 border-teal-200",      dot: "bg-teal-500",    icon: CheckCircle2 },
  COMPLETED: { label: "Completed",                      color: "bg-slate-100 text-slate-700 border-slate-200",    dot: "bg-slate-500",   icon: CheckCircle2 },
};

export default function ReturnDetailClient() {
  const params = useParams();
  const [ret, setRet] = useState<ReturnRequestDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReturnRequests()
      .then((res) => {
        const found = (res.data.data ?? []).find((r) => r.id === params.id);
        if (!found) {
          toast.error("Return request not found");
        }
        setRet(found ?? null);
      })
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load return details")))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-100 animate-pulse rounded w-48" />
        <div className="h-48 bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!ret) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
        <p className="text-slate-500 font-semibold">Return request not found</p>
        <Link href="/dashboard/customer/returns" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-amber-600 hover:text-amber-700">
          <ArrowLeft size={14} /> Back to Returns
        </Link>
      </div>
    );
  }

  const s = STATUS_CONFIG[ret.status] ?? STATUS_CONFIG.PENDING;
  const Icon = s.icon;

  return (
    <div className="max-w-2xl space-y-5">
      <Link
        href="/dashboard/customer/returns"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft size={13} /> Back to Returns
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Return Details
            </h1>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${s.color}`}>
              <Icon size={13} />
              {s.label}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Product</p>
              <p className="text-sm font-bold text-slate-900">{ret.orderItem?.product.name ?? "Unknown"}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Store</p>
              <p className="text-sm font-medium text-slate-700">{ret.orderItem?.store.name ?? "Unknown"}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={12} />
              Requested on {new Date(ret.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2">
                <MessageSquare size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{ret.reason}</p>
                </div>
              </div>
            </div>

            {ret.status === "APPROVED" && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">Return Approved</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your return request has been approved. Please return the parcel within 2 business days. Returns received after this period may not be accepted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ret.status === "REJECTED" && ret.vendorNote && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Return Rejected</p>
                    <p className="text-sm text-red-700 mt-1">{ret.vendorNote}</p>
                  </div>
                </div>
              </div>
            )}

            {ret.vendorNote && ret.status !== "APPROVED" && ret.status !== "REJECTED" && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Vendor Note</p>
                <p className="text-sm text-amber-800">{ret.vendorNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
