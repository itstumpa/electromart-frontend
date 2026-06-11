import type { ApiResponse } from "@/types/api";
import type {
  OrderDto,
  TimelineEntryDto,
  TimelineResponse,
} from "@/types/order";
import type { ProductsMeta } from "@/types/product";
import api from "./axios";
export type { OrderDto, TimelineEntryDto, TimelineResponse };

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

export const adminCancelOrder = (id: string, reason?: string) => {
  return api.patch<ApiResponse<null>>(`/orders/${id}/admin-cancel`, { reason });
};

export interface VendorOrderItemDto {
  id: string;
  orderId: string;
  quantity: number;
  priceAtTime: number;
  productImage: string;
  variant: string | null;
  status: string;
  createdAt: string;
  order: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    user: { id: string; name: string; email: string };
  };
  product: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}

export const getVendorOrders = () => {
  return api.get<ApiResponse<VendorOrderItemDto[]>>("/orders/vendor/items");
};

export const getOrderTimeline = (orderId: string) => {
  return api.get<ApiResponse<TimelineResponse>>(
    `/orderTracking/${orderId}/timeline`,
  );
};
