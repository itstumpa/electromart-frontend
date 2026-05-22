import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { OrderDto } from "@/types/order";
import type { ProductsMeta } from "@/types/product";

export interface PaginatedOrdersResponse {
  success: boolean;
  message: string;
  data: OrderDto[];
  meta: ProductsMeta;
}

export interface PlaceOrderShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export const placeOrder = (
  shippingAddress: PlaceOrderShippingAddress,
  couponCode?: string,
) => {
  return api.post<ApiResponse<OrderDto>>("/orders", {
    shippingAddress,
    ...(couponCode ? { couponCode } : {}),
  });
};

export const getMyOrders = (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return api.get<PaginatedOrdersResponse>("/orders/my", { params });
};

export const getOrderById = (id: string) => {
  return api.get<ApiResponse<OrderDto>>(`/orders/${id}`);
};

export const cancelOrder = (id: string) => {
  return api.patch<ApiResponse<null>>(`/orders/${id}/cancel`);
};

export const getAllOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return api.get<PaginatedOrdersResponse>("/orders", { params });
};

export const updateOrderStatus = (id: string, status: string) => {
  return api.patch<ApiResponse<OrderDto>>(`/orders/${id}`, { status });
};

export const getVendorOrders = () => {
  return api.get<ApiResponse<OrderDto[]>>("/orders/vendor/items");
};
