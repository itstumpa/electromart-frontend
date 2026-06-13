import type { ApiResponse } from "@/types/api";
import api from "./axios";

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface TagProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ url: string }>;
  store: { id: string; name: string };
}

export interface TagWithProductsDto extends TagDto {
  products: Array<{
    productId: string;
    tagId: string;
    product: TagProductItem;
  }>;
}

export const getAllTags = () => {
  return api.get<ApiResponse<TagDto[]>>("/tags");
};

export const getProductsByTag = (slug: string) => {
  return api.get<ApiResponse<TagWithProductsDto>>(`/tags/${slug}/products`);
};
