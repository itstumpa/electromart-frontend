"use client";

import { createReturnRequest } from "@/api/return.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateReturnClient() {
  const params = useParams();
  const router = useRouter();
  const orderItemId = params.orderItemId as string;

  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      toast.error("Please provide a detailed reason (at least 10 characters)");
      return;
    }
    setSubmitting(true);
    try {
      await createReturnRequest(orderItemId, reason.trim());
      toast.success("Return request submitted successfully");
      router.push("/dashboard/customer/returns");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit return request"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link
        href="/dashboard/customer/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft size={13} /> Back to Orders
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <RotateCcw size={18} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Request Return
            </h1>
            <p className="text-xs text-slate-400">Item #{orderItemId.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Reason for Return
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why you're returning this item (minimum 10 characters)..."
              rows={5}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              {reason.length}/10 characters minimum
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-700 font-medium">
              Only items that have been <strong>Delivered</strong> can be returned. You can only submit one return request per item.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Return Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
