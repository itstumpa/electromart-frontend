import api from "./axios";
import type { ApiResponse } from "@/types/api";

export interface ApplyCouponResult {
  code: string;
  discountPercent: number;
  discountAmount: number;
  cartTotal: number;
  finalTotal: number;
}

export const applyCoupon = (code: string) => {
  return api.post<ApiResponse<ApplyCouponResult>>("/coupons/apply", { code });
};

/* ── Promotional (public) coupons for banners / top bar ── */
export interface PromoCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  expiryDate: string | null;
}

export const getPromotionalCoupons = () => {
  return api.get<ApiResponse<PromoCoupon[]>>("/coupons/promotions");
};
