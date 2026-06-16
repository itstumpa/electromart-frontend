import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { BrandDto } from "@/types/brand";

export const getBrands = () => {
  return api.get<ApiResponse<BrandDto[]>>("/brands");
};

export const getFeaturedBrands = () => {
  return api.get<ApiResponse<BrandDto[]>>("/brands/featured");
};

export const createBrand = (data: { name: string; slug?: string; logo?: string; description?: string; isFeatured?: boolean }) => {
  return api.post<ApiResponse<BrandDto>>("/brands", data);
};

export const updateBrand = (id: string, data: { name?: string; slug?: string; logo?: string; description?: string; isFeatured?: boolean }) => {
  return api.patch<ApiResponse<BrandDto>>(`/brands/${id}`, data);
};

export const deleteBrand = (id: string) => {
  return api.delete<ApiResponse<null>>(`/brands/${id}`);
};