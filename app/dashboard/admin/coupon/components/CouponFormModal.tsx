"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Percent, Tag, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminCoupon } from "@/api/admin.api";
import {
  type CouponFormData,
  type DiscountType,
  EMPTY_FORM,
  couponToForm,
} from "../types";

/* ── Form field definitions ─────────────────────────── */
interface FieldDef {
  key: keyof CouponFormData;
  label: string;
  placeholder: string;
  type?: string;
  optional?: boolean;
}

/* ── Coupon Form Modal ──────────────────────────────── */
export default function CouponFormModal({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: AdminCoupon | null;
  onSave: (data: CouponFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CouponFormData>(
    initial ? couponToForm(initial) : EMPTY_FORM,
  );

  const set = (key: keyof CouponFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!form.discountValue) {
      toast.error("Discount value is required");
      return;
    }
    onSave(form);
    onClose();
  };

  const fields: FieldDef[] = [
    {
      key: "discountValue",
      label:
        form.discountType === "PERCENTAGE"
          ? "Discount Value (%)"
          : "Discount Value ($)",
      placeholder: form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 15",
    },
    {
      key: "minOrderAmount",
      label: "Minimum Order Amount ($)",
      placeholder: "e.g. 100",
      optional: true,
    },
    ...(form.discountType === "PERCENTAGE"
      ? [
          {
            key: "maxDiscount" as keyof CouponFormData,
            label: "Maximum Discount ($)",
            placeholder: "e.g. 50",
            optional: true,
          },
        ]
      : []),
    {
      key: "usageLimit",
      label: "Usage Limit",
      placeholder: "e.g. 100 (unlimited if empty)",
      optional: true,
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      placeholder: "",
      type: "date",
      optional: true,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={15} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Tag size={18} className="text-amber-700" />
              </div>
              <h3
                className="text-lg font-black text-slate-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {initial ? "Edit Coupon" : "Create Coupon"}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent uppercase"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Discount Type *
                </label>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  {(["PERCENTAGE", "FIXED"] as DiscountType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => set("discountType", type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                        form.discountType === type
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {type === "PERCENTAGE" ? (
                        <Percent size={14} />
                      ) : (
                        <DollarSign size={14} />
                      )}
                      {type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic fields */}
              {fields.map(({ key, label, placeholder, type, optional }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    {label}{" "}
                    {optional && (
                      <span className="text-slate-400 normal-case font-normal">
                        (optional)
                      </span>
                    )}
                  </label>
                  <input
                    type={type || "number"}
                    placeholder={placeholder}
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value)}
                    min={type === "date" ? undefined : 0}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              ))}

              {/* Active status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Active Status
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Inactive coupons cannot be applied
                  </p>
                </div>
                <button
                  onClick={() => set("isActive", !form.isActive)}
                  className="transition-colors"
                >
                  {form.isActive ? (
                    <ToggleRight size={32} className="text-amber-600" />
                  ) : (
                    <ToggleLeft size={32} className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors"
              >
                {initial ? "Save Changes" : "Create Coupon"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
