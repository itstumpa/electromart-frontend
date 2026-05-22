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
