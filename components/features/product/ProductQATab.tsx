"use client";

import { getProductQA, askQuestion, type QuestionDto } from "@/api/product-qa.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, User, Store, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  productId: string;
}

export default function ProductQATab({ productId }: Props) {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchQA = () => {
    setLoading(true);
    getProductQA(productId)
      .then((res) => setQuestions(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load Q&A")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQA();
  }, [productId]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || newQuestion.trim().length < 5) {
      toast.error("Please enter a valid question (at least 5 characters)");
      return;
    }
    setSubmitting(true);
    try {
      await askQuestion(productId, newQuestion.trim());
      toast.success("Your question has been submitted and is pending review by the store.");
      setNewQuestion("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit question"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-slate-100 animate-pulse rounded w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-amber-600" />
        <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
          Questions &amp; Answers
        </h3>
        <span className="text-xs text-slate-400 font-medium">({questions.length})</span>
      </div>

      {/* Ask a question form */}
      <form onSubmit={handleAsk} className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 sm:p-5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
          Have a question?
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask about this product..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={submitting || !newQuestion.trim()}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Send size={14} />
            {submitting ? "..." : "Ask"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Your question will be reviewed by the store before appearing publicly.
        </p>
      </form>

      {/* Questions list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            >
              {/* Question header */}
              <div
                className="p-4 cursor-pointer select-none"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={12} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-400 font-medium">
                        {q.customer.name ?? "Customer"}
                      </span>
                      <span className="text-xs text-slate-300">
                        {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{q.question}</p>
                  </div>
                  {q.answer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === q.id ? null : q.id);
                      }}
                      className="shrink-0 p-1 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      {expandedId === q.id ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Answer */}
              {q.answer && expandedId === q.id && (
                <div className="px-4 pb-4">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3 ml-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Store size={12} className="text-green-600 shrink-0" />
                      <span className="text-xs font-bold text-green-700">
                        {q.product?.store?.name ?? "Store"} · Answer
                      </span>
                      {q.answeredAt && (
                        <span className="text-xs text-green-500">
                          {new Date(q.answeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-green-800">{q.answer}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <MessageSquare size={32} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm text-slate-500 font-semibold">No questions yet</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to ask about this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
