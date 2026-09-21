export type UserRole = "admin" | "superadmin" | "vendor" | "seller" | "buyer" | string;

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status?: boolean;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
