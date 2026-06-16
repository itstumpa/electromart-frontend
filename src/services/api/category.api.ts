import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { CategoryDetailDto, CategoryDto, CategoryListItem } from "@/types/category";

export const getCategories = () => {
  return api.get<ApiResponse<CategoryDto[]>>("/categories");
};

export const getFeaturedCategories = () => {
  return api.get<ApiResponse<CategoryDto[]>>("/categories/featured");
};

export const getCategoryBySlug = (slug: string) => {
  return api.get<ApiResponse<CategoryDetailDto>>(`/categories/slug/${slug}`);
};

export const mapCategoriesToListItems = (
  categories: CategoryDto[],
): CategoryListItem[] =>
  categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    productCount: c._count?.products ?? 0,
    isFeatured: c.isFeatured,
  }));

export const createCategory = (data: { name: string; image?: string; isFeatured?: boolean }) => {
  return api.post<ApiResponse<CategoryDto>>("/categories", data);
};

export const updateCategory = (id: string, data: { name?: string; image?: string; isFeatured?: boolean }) => {
  return api.patch<ApiResponse<CategoryDto>>(`/categories/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return api.delete<ApiResponse<any>>(`/categories/${id}`);
};

