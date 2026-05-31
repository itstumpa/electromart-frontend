'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Pencil, Trash2, X, CheckCircle2 } from 'lucide-react';
import { getMyReviews, updateReview, deleteReview, type ReviewDto } from '@/api/review.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} type="button"
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i + 1)}
          className="transition-transform hover:scale-110"
        >
          <Star size={24} className={
            (hover || value) > i ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
          } />
        </button>
      ))}
    </div>
  );
}

function EditModal({ review, onSave, onClose }: {
  review: ReviewDto;
  onSave: (r: ReviewDto) => void;
  onClose: () => void;
}) {
  const [rating,  setRating]  = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? '');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateReview(review.id, { rating, comment });
      onSave(res.data.data);
      setSaved(true);
      toast.success('Review updated');
      setTimeout(onClose, 800);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update review'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 p-6"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900">Edit Review</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div className="mb-5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Your Review</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition"
          />
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving || saved}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {saving ? (
            <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 size={15} /> Saved!</>
          ) : 'Save Changes'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function ReviewsClient() {
  const [reviews,    setReviews]    = useState<ReviewDto[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [editTarget, setEditTarget] = useState<ReviewDto | null>(null);
  const [deletedId,  setDeletedId]  = useState<string | null>(null);

  useEffect(() => {
    getMyReviews()
      .then((res) => setReviews(res.data.data ?? []))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updated: ReviewDto) => {
    setReviews((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setEditTarget(null);
  };

  const handleDelete = async (id: string) => {
    setDeletedId(id);
    try {
      await deleteReview(id);
      setTimeout(() => {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setDeletedId(null);
      }, 400);
      toast.success('Review deleted');
    } catch (err) {
      setDeletedId(null);
      toast.error(getApiErrorMessage(err, 'Failed to delete review'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Reviews</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-24" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Reviews</h1>
          <p className="text-sm text-slate-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''} written</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Star size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-semibold">No reviews yet</p>
            <p className="text-xs text-slate-400 mt-1">Reviews will appear here after delivery</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  animate={{ opacity: deletedId === review.id ? 0 : 1, scale: deletedId === review.id ? 0.97 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                     {review.product?.images?.[0]?.url && (
    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0">
      <Image
        src={review.product.images[0].url}
        alt={review.product.name ?? ''}
        fill
        className="object-cover"
        sizes="56px"
      />
    </div>
  )}
                    <div className="flex-1 min-w-0">
                        {review.product?.name && (
      <p className="text-sm font-black text-slate-900 mb-1">{review.product.name}</p>
    )}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{review.rating}.0</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(review.updatedAt ?? review.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => setEditTarget(review)}
                        className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(review.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editTarget && <EditModal review={editTarget} onSave={handleSave} onClose={() => setEditTarget(null)} />}
      </AnimatePresence>
    </>
  );
}