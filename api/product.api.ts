import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type {
  ProductDetailDto,
  ProductListItemDto,
  ProductsMeta,
} from "@/types/product";

export interface ProductListQuery {
  categoryId?: string;
  storeId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta: ProductsMeta;
}

export const getProducts = (query: ProductListQuery = {}) => {
  return api.get<PaginatedApiResponse<ProductListItemDto[]>>("/products", {
    params: query,
  });
};

export const getProductBySlug = (slug: string) => {
  return api.get<ApiResponse<ProductDetailDto>>(`/products/${slug}`);
};

export const getFeaturedProducts = () => {
  return api.get<ApiResponse<ProductListItemDto[]>>("/products/featured");
};

export const getBestsellers = () => {
  return api.get<ApiResponse<ProductListItemDto[]>>("/products/bestsellers");
};

export const getNewArrivals = () => {
  return api.get<ApiResponse<ProductListItemDto[]>>("/products/new-arrivals");
};

export interface ProductSearchQuery {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const searchProducts = (query: ProductSearchQuery) => {
  return api.get<PaginatedApiResponse<ProductListItemDto[]>>("/products/search", {
    params: query,
  });
};

export const getSearchSuggestions = (q: string) => {
  return api.get<ApiResponse<Array<{ id: string; name: string; images: { url: string }[] }>>>(
    "/products/search/suggestions",
    { params: { q } },
  );
};

