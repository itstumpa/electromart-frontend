import api from './axios';
import type { ApiResponse } from '@/types/api';

export interface MyStoreDto {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  isApproved: boolean;
  isActive: boolean;
  totalSales: number;
  totalRevenue: number;
  rating: number;
  createdAt: string;
  products: {
    id: string;
    name: string;
    price: number;
    stock: number;
    isActive: boolean;
  }[];
}

export const getMyStore = () => {
  return api.get<ApiResponse<MyStoreDto>>('/stores/my/store');
};

export const updateStore = (
  id: string,
  file?: File,
  data?: {
    name?: string;
    description?: string;
    isActive?: boolean;
  }
) => {
  const formData = new FormData();

  if (file) {
    formData.append('logo', file);
  }

  if (data?.name) {
    formData.append('name', data.name);
  }

  if (data?.description) {
    formData.append('description', data.description);
  }

  if (data?.isActive !== undefined) {
    formData.append('isActive', String(data.isActive));
  }

  return api.patch(`/stores/${id}`, formData);
};

export const deleteStore = (id: string) => {
  return api.delete<ApiResponse<null>>(`/stores/${id}`);
};

export const toggleStoreActive = (id: string, isActive: boolean) => {
  return api.patch<ApiResponse<MyStoreDto>>(`/stores/${id}/pause`, { isActive });
};

export const updateStorePolicies = (
  id: string,
  data: {
    returnPolicy: string;
    shippingPolicy: string;
  }
) => {
  return api.patch(`/stores/${id}/policies`, data);
};

export const deleteAllProducts = (id: string) => {
  return api.delete(`/stores/${id}/products`);
};

export const closeStore = (id: string) => {
  return api.delete(`/stores/${id}/close`);
};

export const pauseStore = (id: string) => {
  return api.patch<ApiResponse<MyStoreDto>>(`/stores/${id}/pause`);
};

