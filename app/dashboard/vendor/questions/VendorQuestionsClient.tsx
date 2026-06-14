"use client";

import { getVendorQuestions, moderateQuestion, answerVendorQuestion, deleteQuestion, type QuestionDto } from "@/api/product-qa.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock, CheckCircle2, XCircle, MessageSquare, RefreshCw, ChevronDown, Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  PENDING:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-600",      dot: "bg-red-500" },
};

export default function VendorQuestionsClient() {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [answerModal, setAnswerModal] = useState<QuestionDto | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<QuestionDto | null>(null);

  const fetchData = () => {
    setLoading(true);
    getVendorQuestions()
      .then((res) => setQuestions(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load questions")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = statusFilter ? questions.filter((q) => q.status === statusFilter) : questions;
  const pendingCount = questions.filter((q) => q.status === "PENDING").length;

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

  const handleAnswer = async () => {
    if (!answerModal || !answerText.trim()) return;
    if (answerText.trim().length < 3) {
      toast.error("Answer must be at least 3 characters");
      return;
    }
    setActionLoading(answerModal.id);
    try {
      const res = await answerVendorQuestion(answerModal.id, answerText.trim());
      setQuestions((prev) => prev.map((q) => (q.id === answerModal.id ? { ...q, answer: answerText.trim(), answeredAt: new Date().toISOString() } : q)));
      toast.success("Answer submitted");
      setAnswerModal(null);
      setAnswerText("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to answer question"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(deleteConfirm.id);
    try {
      await deleteQuestion(deleteConfirm.id);
      setQuestions((prev) => prev.filter((q) => q.id !== deleteConfirm.id));
      toast.success("Question deleted");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete question"));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Product Questions</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-24" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Product Questions</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {questions.length} total · {pendingCount} pending moderation
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
                        <span className="text-xs text-slate-400">
                          {q.product?.name ?? "Unknown product"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1">{q.question}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        by {q.customer.name} · {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>

                      {q.answer && (
                        <div className="mt-2 bg-green-50 border border-green-100 rounded-xl p-3">
                          <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Answer</p>
                          <p className="text-sm text-green-800">{q.answer}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                      {q.status === "APPROVED" && !q.answer && (
                        <button
                          onClick={() => setAnswerModal(q)}
                          className="flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <MessageSquare size={12} />
                          Answer
                        </button>
                      )}
                      {q.status === "APPROVED" && (
                        <button
                          onClick={() => setDeleteConfirm(q)}
                          disabled={actionLoading === q.id}
                          className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 px-2.5 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
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

      {/* Answer modal */}
      <AnimatePresence>
        {answerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => { setAnswerModal(null); setAnswerText(""); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 p-5 sm:p-6"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">Answer Question</h3>
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-400 mb-1">Question from {answerModal.customer.name}:</p>
                <p className="text-sm text-slate-800 font-medium">{answerModal.question}</p>
              </div>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setAnswerModal(null); setAnswerText(""); }}
                  className="flex-1 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnswer}
                  disabled={actionLoading === answerModal.id || !answerText.trim()}
                  className="flex-1 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 px-4 py-2.5 rounded-xl transition-colors"
                >
                  {actionLoading === answerModal.id ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 p-5 sm:p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete Question?</h3>
              <p className="text-sm text-slate-500 mb-1">
                Are you sure you want to delete this question?
              </p>
              <p className="text-xs text-slate-400 font-medium mb-5">
                This action cannot be undone.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 mb-5 text-left">
                <p className="text-xs text-slate-400 mb-1">Question from {deleteConfirm.customer.name}:</p>
                <p className="text-sm text-slate-800 font-medium">{deleteConfirm.question}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading === deleteConfirm.id}
                  className="flex-1 text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 px-4 py-2.5 rounded-xl transition-colors"
                >
                  {actionLoading === deleteConfirm.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
