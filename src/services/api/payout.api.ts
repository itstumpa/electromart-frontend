import api from './axios';
import type { ApiResponse } from '@/types/api';

export interface PayoutDto {
  id: string;
  storeId: string;
  amount: string | number;
  status: string;
  method: string;
  reference: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDto {
  id: string;
  orderId: string;
  quantity: number;
  priceAtTime: string | number;
  createdAt: string;
  order: { id: string; createdAt: string };
  product: { name: string };
}

export const getMyPayouts = () => {
  return api.get<ApiResponse<PayoutDto[]>>('/payouts/my');
};

export const getMyTransactions = () => {
  return api.get<ApiResponse<TransactionDto[]>>('/payouts/transactions');
};

export const requestPayout = (amount: number) => {
  return api.post<ApiResponse<PayoutDto>>('/payouts/request', { amount });
};