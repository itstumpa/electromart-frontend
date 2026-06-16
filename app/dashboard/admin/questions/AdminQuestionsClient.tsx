"use client";

import { getAdminQuestions, moderateQuestion, deleteQuestion, type QuestionDto } from "@/src/services/api/product-qa.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, MessageSquare, RefreshCw, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  PENDING:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-600",      dot: "bg-red-500" },
};

export default function AdminQuestionsClient() {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    getAdminQuestions()
      .then((res) => setQuestions(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load questions")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = statusFilter ? questions.filter((q) => q.status === statusFilter) : questions;

  const handleModerate = async (questionId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(questionId);
    try {
      await moderateQuestion(questionId, status);
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, status } : q)));
      toast.success(`Question ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to moderate question"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Delete this question permanently?")) return;
    setActionLoading(questionId);
    try {
      await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      toast.success("Question deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete question"));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>All Product Questions</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>All Product Questions</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {questions.filter((q) => q.status === "PENDING").length} pending moderation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filtered.map((q, i) => {
            const s = STATUS_CONFIG[q.status] ?? STATUS_CONFIG.PENDING;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                      <span className="text-xs text-slate-400">{q.product?.name ?? "Unknown product"}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{q.question}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      by {q.customer.name} · {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {q.product?.store?.name && <> · Store: {q.product.store.name}</>}
                    </p>

                    {q.answer && (
                      <div className="mt-2 bg-green-50 border border-green-100 rounded-xl p-3">
                        <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Answer</p>
                        <p className="text-sm text-green-800">{q.answer}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {q.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleModerate(q.id, "APPROVED")}
                          disabled={actionLoading === q.id}
                          className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={12} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerate(q.id, "REJECTED")}
                          disabled={actionLoading === q.id}
                          className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <XCircle size={12} />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={actionLoading === q.id}
                      className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 px-2.5 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <MessageSquare size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No questions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
