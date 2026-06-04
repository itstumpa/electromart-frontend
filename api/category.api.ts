import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { CategoryDto, CategoryListItem } from "@/types/category";

export const getCategories = () => {
  return api.get<ApiResponse<CategoryDto[]>>("/categories");
};

export const getFeaturedCategories = () => {
  return api.get<ApiResponse<CategoryDto[]>>("/categories/featured");
};

export const mapCategoriesToListItems = (
  categories: CategoryDto[],
): CategoryListItem[] =>
  categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c._count?.products ?? 0,
  }));

export const createCategory = (data: { name: string; image?: string }) => {
  return api.post<ApiResponse<CategoryDto>>("/categories", data);
};

export const updateCategory = (id: string, data: { name?: string; image?: string }) => {
  return api.patch<ApiResponse<CategoryDto>>(`/categories/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return api.delete<ApiResponse<any>>(`/categories/${id}`);
};

