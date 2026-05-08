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
    productCount: c._count.products,
  }));

