import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { CartResponseDto } from "@/types/cart";

// ── Authenticated user cart ──────────────────────────────────────────────────

export const getCart = () => {
  return api.get<ApiResponse<CartResponseDto>>("/cart");
};

export const addToCart = (
  productId: string,
  quantity = 1,
  variantId?: string,
) => {
  return api.post<ApiResponse<CartResponseDto>>(`/cart/${productId}`, {
    quantity,
    ...(variantId ? { variantId } : {}),
  });
};

export const updateCartItem = (
  productId: string,
  quantity: number,
  variantId?: string,
) => {
  return api.patch<ApiResponse<CartResponseDto>>(`/cart/${productId}`, {
    quantity,
    ...(variantId ? { variantId } : {}),
  });
};

export const removeCartItem = (productId: string, variantId?: string) => {
  return api.delete<ApiResponse<CartResponseDto>>(`/cart/${productId}`, {
    data: variantId ? { variantId } : undefined,
  });
};

export const clearCart = () => {
  return api.delete<ApiResponse<null>>("/cart");
};

/**
 * Validates and persists a coupon onto the cart on the backend.
 * The response is the full updated cart including recalculated totals.
 */
export const applyCartCoupon = (code: string) => {
  return api.post<ApiResponse<CartResponseDto>>("/cart/coupon", { code });
};

/**
 * Removes the applied coupon from the cart on the backend.
 * The response is the full updated cart with totals reset.
 */
export const removeCartCoupon = () => {
  return api.delete<ApiResponse<CartResponseDto>>("/cart/coupon");
};

// ── Guest cart (uses guestId cookie) ─────────────────────────────────────────

export const getGuestCart = () => {
  return api.get<ApiResponse<CartResponseDto>>("/cart/guest");
};

export const addToGuestCart = (
  productId: string,
  quantity = 1,
  variantId?: string,
) => {
  return api.post<ApiResponse<CartResponseDto>>(`/cart/guest/${productId}`, {
    quantity,
    ...(variantId ? { variantId } : {}),
  });
};

export const updateGuestCartItem = (
  productId: string,
  quantity: number,
  variantId?: string,
) => {
  return api.patch<ApiResponse<CartResponseDto>>(`/cart/guest/${productId}`, {
    quantity,
    ...(variantId ? { variantId } : {}),
  });
};

export const removeGuestCartItem = (productId: string, variantId?: string) => {
  return api.delete<ApiResponse<CartResponseDto>>(`/cart/guest/${productId}`, {
    data: variantId ? { variantId } : undefined,
  });
};

export const clearGuestCart = () => {
  return api.delete<ApiResponse<null>>("/cart/guest");
};

export const applyGuestCartCoupon = (code: string) => {
  return api.post<ApiResponse<CartResponseDto>>("/cart/guest/coupon", { code });
};

export const removeGuestCartCoupon = () => {
  return api.delete<ApiResponse<CartResponseDto>>("/cart/guest/coupon");
};
