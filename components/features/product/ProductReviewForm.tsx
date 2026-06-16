'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createProductReview } from '@/src/services/api/review.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

interface Props {
  productId: string;
  onSubmitted?: () => void;
}

export default function ProductReviewForm({ productId, onSubmitted }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setSubmitting(true);
    try {
      await createProductReview(productId, { rating, comment: comment.trim() });
      toast.success('Review submitted');
      setComment('');
      setRating(5);
      onSubmitted?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to submit review'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
      <p className="text-sm font-bold text-slate-900 mb-3">Write a Review</p>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`Rate ${i + 1} stars`}>
            <Star size={18} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3"
      />
      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}
