import type { ApiResponse } from "@/types/api";
import api from "./axios";

export interface QuestionDto {
  id: string;
  productId: string;
  customerId: string;
  question: string;
  answer?: string | null;
  answeredAt?: string | null;
  answeredBy?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  moderatedAt?: string | null;
  moderatedBy?: string | null;
  createdAt: string;
  customer: { id: string; name: string };
  product?: { id: string; name: string; slug: string; store?: { id: string; name: string } };
}

// ── Public ────────────────────────────────────────────────

export const getProductQA = (productId: string) => {
  return api.get<ApiResponse<QuestionDto[]>>(`/qa/product/${productId}`);
};

// ── Customer ──────────────────────────────────────────────

export const askQuestion = (productId: string, question: string) => {
  return api.post<ApiResponse<QuestionDto>>(`/qa/product/${productId}`, { question });
};

// ── Vendor ────────────────────────────────────────────────

export const answerVendorQuestion = (questionId: string, answer: string) => {
  return api.patch<ApiResponse<QuestionDto>>(`/qa/${questionId}/answer`, { answer });
};

export const getVendorQuestions = () => {
  return api.get<ApiResponse<QuestionDto[]>>("/qa/vendor/questions");
};

export const moderateQuestion = (questionId: string, status: "APPROVED" | "REJECTED") => {
  return api.patch<ApiResponse<QuestionDto>>(`/qa/${questionId}/moderate`, { status });
};

// ── Admin ─────────────────────────────────────────────────

export const getAdminQuestions = () => {
  return api.get<ApiResponse<QuestionDto[]>>("/qa/admin/questions");
};

// ── Shared ────────────────────────────────────────────────

export const deleteQuestion = (questionId: string) => {
  return api.delete<ApiResponse<null>>(`/qa/${questionId}`);
};
