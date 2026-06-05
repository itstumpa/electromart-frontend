import type { ApiErrorResponse } from "@/types/api";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ErrorWithMessage {
  message: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasMessage = (value: unknown): value is ErrorWithMessage =>
  isObject(value) && typeof value.message === "string";

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  isObject(value) && typeof value.message === "string";

export const getApiErrorMessage = (
  error: FetchBaseQueryError | SerializedError | unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (!error) return fallback;

  // Axios error — check response.data.message first
  if (isObject(error) && "response" in error) {
    const response = (
      error as { response?: { status?: number; data?: unknown } }
    ).response;
    if (response?.status === 401) return "Please log in to continue.";
    if (response && isApiErrorResponse(response.data))
      return response.data.message;
  }

  if (isObject(error) && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (isApiErrorResponse(data)) return data.message;
  }

  if (hasMessage(error)) return error.message;

  return fallback;
};

export const isUnauthorized = (err: unknown): boolean =>
  (err as { response?: { status?: number } })?.response?.status === 401;
  