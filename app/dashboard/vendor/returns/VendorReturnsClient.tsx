"use client";

import { getVendorReturnRequests, resolveReturnRequest, type ReturnRequestDto } from "@/api/return.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, RotateCcw, ChevronDown, RefreshCw, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/api/axios";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  PENDING:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-600",      dot: "bg-red-500" },
};

export default function VendorReturnsClient() {
  const [returns, setReturns] = useState<ReturnRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<{ returnId: string; action: "APPROVED" | "REJECTED" } | null>(null);
  const [vendorNote, setVendorNote] = useState("");

  const fetchData = () => {
    setLoading(true);
    getVendorReturnRequests()
      .then((res) => setReturns(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load returns")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolve = async (returnId: string, status: "APPROVED" | "REJECTED", note?: string) => {
    setActionLoading(returnId);
    try {
      await resolveReturnRequest(returnId, status, note);
      setReturns((prev) => prev.map((r) => (r.id === returnId ? { ...r, status } : r)));
      toast.success(`Return ${status.toLowerCase()}`);
      setNoteModal(null);
      setVendorNote("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to resolve return"));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Return Requests</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-24" />
        ))}
      </div>
    );
  }

  const pending = returns.filter((r) => r.status === "PENDING").length;

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Return Requests</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {returns.length} total · {pending} pending review
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {returns.map((ret, i) => {
              const s = STATUS_CONFIG[ret.status];
              return (
                <motion.div
                  key={ret.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(ret.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {ret.orderItem?.product.name ?? "Product"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ret.reason}</p>
                      {ret.customer && (
                        <p className="text-xs text-slate-400 mt-1">
                          by {ret.customer.name} · {ret.customer.email}
                        </p>
                      )}
                    </div>

                    {ret.status === "PENDING" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setNoteModal({ returnId: ret.id, action: "APPROVED" })}
                          disabled={actionLoading === ret.id}
                          className="flex items-center gap-1.5 text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={13} />
                          Approve
                        </button>
                        <button
                          onClick={() => setNoteModal({ returnId: ret.id, action: "REJECTED" })}
                          disabled={actionLoading === ret.id}
                          className="flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    )}

                    {ret.vendorNote && (
                      <div className="w-full text-xs text-amber-700 bg-amber-50 rounded-xl p-2.5 flex items-start gap-1.5">
                        <MessageSquare size={12} className="mt-0.5 shrink-0" />
                        {ret.vendorNote}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {returns.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <RotateCcw size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-semibold">No return requests yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Note modal */}
      <AnimatePresence>
        {noteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => { setNoteModal(null); setVendorNote(""); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 p-5 sm:p-6"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">
                {noteModal.action === "APPROVED" ? "Approve" : "Reject"} Return
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Add an optional note to the customer (visible to them)
              </p>
              <textarea
                value={vendorNote}
                onChange={(e) => setVendorNote(e.target.value)}
                placeholder="Optional note..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setNoteModal(null); setVendorNote(""); }}
                  className="flex-1 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleResolve(noteModal.returnId, noteModal.action, vendorNote || undefined)}
                  disabled={actionLoading === noteModal.returnId}
                  className={`flex-1 text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 ${
                    noteModal.action === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoading === noteModal.returnId ? "Processing..." : noteModal.action === "APPROVED" ? "Approve" : "Reject"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
