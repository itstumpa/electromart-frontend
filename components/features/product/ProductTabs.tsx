"use client";

import { getProductReviews } from "@/api/review.api";
import TiptapRenderer from "@/components/ui/TiptapRenderer";
import type { ProductSpecification, Review } from "@/data/types";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import ProductReviewForm from "./ProductReviewForm";
import ProductQATab from "./ProductQATab";

interface Props {
  specifications: ProductSpecification[];
  reviews: Review[];
  productId?: string;
  details?: Record<string, unknown> | string | null;
}

export default function ProductTabs({
  specifications,
  reviews: initialReviews,
  productId,
  details,
}: Props) {
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "reviews" | "qa">(
    details ? "details" : "specs",
  );
  // Own the review list in state — seeded from SSR, refreshed after submit
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [refreshing, setRefreshing] = useState(false);

  const refreshReviews = useCallback(async () => {
    if (!productId) return;
    setRefreshing(true);
    try {
      const res = await getProductReviews(productId, { limit: 20 });
      const fetched =
        (
          res.data?.data as {
            reviews?: Array<{
              id: string;
              productId: string;
              customerId: string;
              rating: number;
              comment: string;
              createdAt: string;
              customer?: { id: string; name: string; avatar?: string | null };
            }>;
          }
        )?.reviews ?? [];
      setReviews(
        fetched.map((r) => ({
          id: r.id,
          productId: r.productId,
          customerId: r.customerId,
          customerName: r.customer?.name ?? "Customer",
          customerAvatar: r.customer?.avatar ?? undefined,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          updatedAt: r.createdAt,
        })),
      );
    } catch (err) {
      console.error("Failed to refresh reviews:", err);
    } finally {
      setRefreshing(false);
    }
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-100">
          {(["details", "specs", "reviews", "qa"] as const).map((tab) => {
          if (tab === "details" && !details) return null;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-4 text-sm font-bold capitalize transition-colors ${
                activeTab === tab
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "reviews"
                ? `Reviews (${reviews.length})`
                : tab === "details"
                  ? "Details"
                  : tab === "qa"
                    ? "Q&A"
                    : "Specifications"}
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-line"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab body */}
      <div className="p-6 sm:p-8">
        {activeTab === "details" && details ? (
          <TiptapRenderer content={details} />
        ) : activeTab === "specs" ? (
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
        ) : activeTab === "reviews" && reviews.length > 0 ? (
          <div className="flex flex-col gap-5">
            {/* Average rating summary */}
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl mb-2">
              <div className="text-center">
                <p className="text-4xl font-black text-slate-900">
                  {avgRating.toFixed(1)}
                </p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {reviews.length} reviews
                </p>
              </div>
              {refreshing && (
                <span className="text-xs text-amber-600 animate-pulse ml-4">
                  Updating…
                </span>
              )}
            </div>

            {/* Review list */}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-amber-100 flex items-center justify-center">
                  {review.customerAvatar ? (
                    <Image
                      key={review.customerAvatar}
                      src={review.customerAvatar}
                      alt={review.customerName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-amber-700 font-black text-sm">
                      {review.customerName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
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
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
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
        ) : activeTab === "reviews" ? (
          <p className="text-slate-400 text-sm text-center py-8">
            No reviews yet. Be the first to review this product.
          </p>
        ) : null}

        {activeTab === "qa" && productId && <ProductQATab productId={productId} />}

        {/* Review form — always shown in reviews tab if productId is set */}
        {productId && activeTab === "reviews" && (
          <ProductReviewForm
            productId={productId}
            onSubmitted={refreshReviews}
          />
        )}
      </div>
    </div>
  );
}
