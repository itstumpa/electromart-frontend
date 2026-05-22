import api from "./axios";
import type { ApiResponse } from "@/types/api";

export interface InitiatePaymentPayload {
  orderId: string;
  gateway: "SSLCommerz" | "stripe" | string;
}

export interface InitiatePaymentResponse {
  gatewayUrl?: string;
  sessionUrl?: string;
  paymentId?: string;
  [key: string]: unknown;
}

export const initiatePayment = (data: InitiatePaymentPayload) => {
  return api.post<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", data);
};

export const getPaymentByOrderId = (orderId: string) => {
  return api.get<ApiResponse<Record<string, unknown>>>(`/payments/order/${orderId}`);
};
