import api, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./api";
import type {
  ApiResponse,
  AuthResponseData,
  LoginCredentials,
  User,
} from "../types/auth";

export const authService = {
  /**
   * Send login request to POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      credentials
    );
    return response.data.data;
  },

  /**
   * Persist token and user in localStorage
   */
  saveSession(authData: AuthResponseData): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData.user));
  },

  /**
   * Clear session from localStorage
   */
  clearSession(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Retrieve active token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Retrieve stored user object
   */
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
