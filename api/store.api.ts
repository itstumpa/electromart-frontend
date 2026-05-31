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

export const updateStore = (id: string, data: { name?: string; description?: string; logo?: string; isActive?: boolean }) => {
  return api.patch<ApiResponse<MyStoreDto>>(`/stores/${id}`, data);
};