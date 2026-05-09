export type AuthRole = "CUSTOMER" | "VENDOR";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: AuthRole;
}

export interface SignupResponseUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole | "ADMIN";
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole | "ADMIN";
}

export interface SigninResponseData {
  user: AuthUser;
}

export interface MeResponseData {
  id: string;
  name: string;
  email: string;
  role: AuthRole | "ADMIN";
  isEmailVerified: boolean;
  createdAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
}
