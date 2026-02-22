'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { ProductSpecification, Review } from '@/data/types';
import Image from 'next/image';

interface Props {
  specifications: ProductSpecification[];
  reviews: Review[];
}

export default function ProductTabs({ specifications, reviews }: Props) {
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-100">
        {(['specs', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-8 py-4 text-sm font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'text-amber-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'reviews'
              ? `Reviews (${reviews.length})`
              : 'Specifications'}
            {activeTab === tab && (
              <motion.span
                layoutId="tab-line"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="p-6 sm:p-8">
        {activeTab === 'specs' ? (
          specifications.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide w-28 shrink-0 pt-0.5">
                    {spec.label}
                  </span>
                  <span className="text-sm text-slate-800 font-medium leading-snug">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">
              No specifications available.
            </p>
          )
        ) : reviews.length > 0 ? (
          <div className="flex flex-col gap-5">
            {/* Average rating summary */}
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl mb-2">
              <div className="text-center">
                <p className="text-4xl font-black text-slate-900">
                  {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                </p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">{reviews.length} reviews</p>
              </div>
            </div>

            {/* Review list */}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0"
              >
                {review.customerAvatar && (
                  <Image
                    src={review.customerAvatar}
                    alt={review.customerName}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      {review.customerName}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-200 text-slate-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </div>
    </div>
  );
}