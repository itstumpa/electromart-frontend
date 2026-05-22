import api from "./axios";
import type { ApiResponse } from "@/types/api";

export interface WishlistItemDto {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  stock: number;
  addedAt: string;
}

export const getWishlist = () => {
  return api.get<ApiResponse<WishlistItemDto[]>>("/wishlist");
};

export const addToWishlist = (productId: string) => {
  return api.post<ApiResponse<WishlistItemDto[]>>(`/wishlist/${productId}`);
};

export const removeFromWishlist = (productId: string) => {
  return api.delete<ApiResponse<WishlistItemDto[]>>(`/wishlist/${productId}`);
};

export const clearWishlist = () => {
  return api.delete<ApiResponse<null>>("/wishlist");
};

export const checkWishlistItem = (productId: string) => {
  return api.get<ApiResponse<{ inWishlist: boolean }>>(`/wishlist/check/${productId}`);
};
