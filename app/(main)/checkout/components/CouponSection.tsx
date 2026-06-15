"use client";

import { CheckCircle2, X, Tag } from "lucide-react";
import type { KeyboardEvent } from "react";

// ─── CouponSection ───────────────────────────────────────────
export default function CouponSection({
  couponCode,
  couponInput,
  couponError,
  couponApplying,
  discountAmt,
  onApply,
  onRemove,
  onInputChange,
  onKeyDown,
}: {
  couponCode: string;
  couponInput: string;
  couponError: string;
  couponApplying: boolean;
  discountAmt: number;
  onApply: () => void;
  onRemove: () => void;
  onInputChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mt-4">
      {couponCode ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-xs font-bold text-green-800">
              {couponCode} — ${discountAmt.toFixed(2)} off
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                onInputChange(e.target.value.toUpperCase());
              }}
              onKeyDown={onKeyDown}
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition placeholder-slate-400"
            />
            <button
              onClick={onApply}
              disabled={couponApplying}
              className="px-3 py-2 bg-slate-900 hover:bg-amber-600 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {couponApplying ? "..." : "Apply"}
            </button>
          </div>
          {couponError && (
            <p className="text-[10px] text-red-500 font-medium mt-1">
              {couponError}
            </p>
          )}
        </>
      )}
    </div>
  );
}
