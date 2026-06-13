import type { ApiResponse } from "@/types/api";
import api from "./axios";

export interface ReturnRequestDto {
  id: string;
  orderItemId: string;
  customerId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  vendorNote?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string; email: string };
  orderItem?: {
    product: { id: string; name: string };
    store: { id: string; name: string };
  };
}

// ── Customer ───────────────────────────────────────────────

export const createReturnRequest = (orderItemId: string, reason: string) => {
  return api.post<ApiResponse<ReturnRequestDto>>(`/returns/order-item/${orderItemId}`, { reason });
};

export const getMyReturnRequests = () => {
  return api.get<ApiResponse<ReturnRequestDto[]>>("/returns/my");
};

// ── Vendor ────────────────────────────────────────────────

export const getVendorReturnRequests = () => {
  return api.get<ApiResponse<ReturnRequestDto[]>>("/returns/vendor");
};

export const resolveReturnRequest = (returnId: string, status: "APPROVED" | "REJECTED", vendorNote?: string) => {
  return api.patch<ApiResponse<ReturnRequestDto>>(`/returns/${returnId}/resolve`, { status, vendorNote });
};
