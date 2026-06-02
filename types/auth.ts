export type AuthRole = "CUSTOMER" | "VENDOR";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: AuthRole;
  storeName?: string;
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
  accessToken?: string;
  refreshToken?: string;
}

export interface MeResponseData {
  id: string;
  name: string;
  email: string;
  role: AuthRole | "ADMIN";
  isEmailVerified: boolean;
  createdAt: string;
  avatar: string | null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}
