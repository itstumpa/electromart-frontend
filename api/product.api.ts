import type { ApiResponse } from "@/types/api";
import type {
  ProductDetailDto,
  ProductListItemDto,
  ProductsMeta,
} from "@/types/product";
import api from "./axios";

export interface ProductListQuery {
  categoryId?: string;
  includeInactive?: boolean;
  storeId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSale?: boolean;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: ProductsMeta;
  statusCode?: number;
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
  return api.get<PaginatedApiResponse<ProductListItemDto[]>>(
    "/products/search",
    {
      params: query,
    },
  );
};

export const getSearchSuggestions = (q: string) => {
  return api.get<
    ApiResponse<Array<{ id: string; name: string; images: { url: string }[] }>>
  >("/products/search/suggestions", { params: { q } });
};

// ── Vendor product management ──────────────────────────────

export interface CreateProductDto {
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string;
  description?: string;
  overview?: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
  highlights?: Record<string, unknown> | null;
  additionalInfo?: Record<string, unknown> | null;
  featured?: boolean;
  isActive?: boolean;
  specifications?: { key: string; value: string }[];
  imageUrl?: string;
}

export const getMyProducts = () => {
  return api.get<ApiResponse<ProductListItemDto[]>>("/products/my/products");
};

export const createProduct = (data: CreateProductDto, images?: File[]) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined) {
      formData.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    }
  });
  images?.forEach((f) => formData.append("files", f));
  return api.post<ApiResponse<ProductDetailDto>>("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProduct = (
  id: string,
  data: Partial<CreateProductDto>,
  newImages?: File[],
) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  newImages?.forEach((f) => formData.append("files", f));
  return api.patch<ApiResponse<ProductDetailDto>>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = (id: string) => {
  return api.delete<ApiResponse<null>>(`/products/${id}`);
};

export const toggleProductVisibility = (id: string, isActive: boolean) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ isActive }));
  return api.patch<ApiResponse<ProductDetailDto>>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAdminProducts = () => {
  return api.get<PaginatedApiResponse<ProductListItemDto[]>>('/products/admin/all');
};

// ── Product Image Management ──────────────────────────────

export interface ProductImageResponse {
  id: string;
  url: string;
  publicId: string | null;
  isPrimary: boolean;
  order: number;
  productId: string;
}

export const uploadProductImages = (productId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  return api.post<ApiResponse<{ jobIds: string[] }>>(
    `/products/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

export const getProductImages = (productId: string) => {
  return api.get<ApiResponse<ProductImageResponse[]>>(`/products/${productId}/images`);
};

export const setPrimaryImage = (productId: string, imageId: string) => {
  return api.patch<ApiResponse<ProductImageResponse[]>>(
    `/products/${productId}/images/primary`,
    { imageId },
  );
};

export const reorderImages = (productId: string, imageIds: string[]) => {
  return api.patch<ApiResponse<ProductImageResponse[]>>(
    `/products/${productId}/images/reorder`,
    { imageIds },
  );
};

export const deleteProductImage = (productId: string, imageId: string) => {
  return api.delete<ApiResponse<null>>(`/products/${productId}/images/${imageId}`);
};