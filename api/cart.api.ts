import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { CartResponseDto } from "@/types/cart";

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
