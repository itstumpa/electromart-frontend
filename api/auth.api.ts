import api from "./axios";
import type {
  RefreshTokenRequest,
  RefreshTokenResponseData,
  SigninRequest,
  SigninResponseData,
  SignupRequest,
  SignupResponseUser,
  MeResponseData,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export const signupUser = (data: SignupRequest) => {
  return api.post<ApiResponse<SignupResponseUser>>("/auth/signup", data);
};

export const loginUser = (data: SigninRequest) => {
  return api.post<ApiResponse<SigninResponseData>>("/auth/signin", data);
};

export const refreshAuthToken = (data: RefreshTokenRequest) => {
  return api.post<ApiResponse<RefreshTokenResponseData>>(
    "/auth/refresh-token",
    data,
  );
};

export const getMe = () => {
  return api.get<ApiResponse<MeResponseData>>("/auth/me");
};

export const logoutUser = () => {
  return api.post<ApiResponse<null>>("/auth/logout");
};

export const resendVerification = (email: string) => {
  return api.post<ApiResponse<null>>("/auth/resend-verification", { email });
};

export const verifyEmail = (token: string) => {
  return api.get<ApiResponse<null>>("/auth/verify-email", {
    params: { token },
  });
};

export const forgotPassword = (email: string) => {
  return api.post<ApiResponse<null>>("/auth/forgot-password", { email });
};

export const verifyResetCode = (email: string, code: string) => {
  return api.post<ApiResponse<null>>("/auth/verify-reset-code", { email, code });
};

export const resetPassword = (
  email: string,
  code: string,
  newPassword: string,
) => {
  return api.post<ApiResponse<null>>("/auth/reset-password", {
    email,
    code,
    newPassword,
  });
};

export const changePassword = (oldPassword: string, newPassword: string) => {
  return api.post<ApiResponse<null>>("/auth/change-password", {
    oldPassword,
    newPassword,
  });
};