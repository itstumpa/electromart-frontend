import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { ApiErrorResponse } from "@/types/api";

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

  if (hasMessage(error)) return error.message;

  if (isObject(error) && "response" in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    if (response && isApiErrorResponse(response.data)) {
      return response.data.message;
    }
  }

  if (isObject(error) && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (isApiErrorResponse(data)) return data.message;
  }

  return fallback;
};
