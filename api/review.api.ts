import api from "./axios";
import type { ApiResponse } from "@/types/api";

export interface ReviewDto {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  customer?: { id: string; name: string; avatar?: string | null };
  product?: {
    id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  };
}

export interface ProductReviewsResponse {
  reviews: ReviewDto[];
  avgRating: number;
  total: number;
}

export const getProductReviews = (
  productId: string,
  params?: { page?: number; limit?: number },
) => {
  return api.get<ApiResponse<ProductReviewsResponse>>(
    `/reviews/product/${productId}`,
    { params },
  );
};

export const getMyReviews = () => {
  return api.get<ApiResponse<ReviewDto[]>>("/reviews/my");
};

export const createProductReview = (
  productId: string,
  data: { rating: number; comment?: string },
) => {
  return api.post<ApiResponse<ReviewDto>>(`/reviews/product/${productId}`, data);
};

export const updateReview = (
  reviewId: string,
  data: { rating?: number; comment?: string },
) => {
  return api.patch<ApiResponse<ReviewDto>>(`/reviews/${reviewId}`, data);
};

export const deleteReview = (reviewId: string) => {
  return api.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
};

export const getLatestReviews = (limit = 10) => {
  return api.get<ApiResponse<ReviewDto[]>>(`/reviews/latest`, { params: { limit } });
};