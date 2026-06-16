import type { AdminCoupon } from "@/src/services/api/admin.api";

/* ── Re-export API type ─────────────────────────────── */
export type { AdminCoupon } from "@/src/services/api/admin.api";

/* ── Discount type ──────────────────────────────────── */
export type DiscountType = "PERCENTAGE" | "FIXED";

/* ── Coupon Form Data ───────────────────────────────── */
export interface CouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxDiscount: string;
  usageLimit: string;
  expiryDate: string;
  isActive: boolean;
}

export const EMPTY_FORM: CouponFormData = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  expiryDate: "",
  isActive: true,
};

export function couponToForm(c: AdminCoupon): CouponFormData {
  return {
    code: c.code,
    discountType: c.discountType,
    discountValue: String(c.discountValue),
    minOrderAmount: c.minOrderAmount != null ? String(c.minOrderAmount) : "",
    maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : "",
    usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
    expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : "",
    isActive: c.isActive,
  };
}

export function mapFormToPayload(data: CouponFormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    code: data.code,
    discountType: data.discountType,
    discountValue: Number(data.discountValue),
  };
  if (data.minOrderAmount) payload.minOrderAmount = Number(data.minOrderAmount);
  if (data.maxDiscount) payload.maxDiscount = Number(data.maxDiscount);
  if (data.usageLimit) payload.usageLimit = Number(data.usageLimit);
  if (data.expiryDate) payload.expiryDate = new Date(data.expiryDate).toISOString();
  payload.isActive = data.isActive;
  return payload;
}
