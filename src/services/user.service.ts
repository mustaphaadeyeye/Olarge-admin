import api from "./api";
import type { ApiResponse } from "../types/auth";
import type {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  SubmitKycDto,
  KycStatusData,
  ReviewKycDto,
  AdminUsersQueryParams,
  AdminUsersResponseData,
  VerifiedSellersQueryParams,
  VerifiedSellersResponseData,
} from "../types/user";

export const userService = {
  /**
   * GET /users/profile
   * Get the authenticated user's full profile including KYC state
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<{ user: UserProfile }>>("/users/profile");
    return response.data.data.user;
  },

  /**
   * PATCH /users/profile
   * Update name, phoneNumber, avatar, bio, or buyerType
   */
  async updateProfile(dto: UpdateProfileDto): Promise<UserProfile> {
    const response = await api.patch<ApiResponse<{ user: UserProfile }>>(
      "/users/profile",
      dto
    );
    return response.data.data.user;
  },

  /**
   * PATCH /users/change-password
   * Change current account password
   */
  async changePassword(dto: ChangePasswordDto): Promise<string> {
    const response = await api.patch<ApiResponse<unknown>>(
      "/users/change-password",
      dto
    );
    return response.data.message;
  },

  /**
   * POST /users/kyc/submit
   * Submit farmer/seller KYC verification application
   */
  async submitKyc(dto: SubmitKycDto): Promise<UserProfile> {
    const response = await api.post<ApiResponse<{ user: UserProfile }>>(
      "/users/kyc/submit",
      dto
    );
    return response.data.data.user;
  },

  /**
   * GET /users/kyc/status
   * Get authenticated user's KYC verification status
   */
  async getKycStatus(): Promise<KycStatusData> {
    const response = await api.get<ApiResponse<KycStatusData>>("/users/kyc/status");
    return response.data.data;
  },

  /**
   * GET /users/sellers
   * Browse verified sellers directory
   */
  async getVerifiedSellers(
    params?: VerifiedSellersQueryParams
  ): Promise<VerifiedSellersResponseData> {
    const response = await api.get<ApiResponse<VerifiedSellersResponseData>>(
      "/users/sellers",
      { params }
    );
    return response.data.data;
  },

  /**
   * GET /users/sellers/:id
   * Get public farmer/seller profile and active produce listings
   */
  async getSellerPublicProfile(id: string): Promise<unknown> {
    const response = await api.get<ApiResponse<unknown>>(`/users/sellers/${id}`);
    return response.data.data;
  },

  /**
   * PATCH /users/kyc/:userId/review (Admin only)
   * Approve or reject a farmer's KYC application
   */
  async reviewKyc(userId: string, dto: ReviewKycDto): Promise<UserProfile> {
    const response = await api.patch<ApiResponse<{ user: UserProfile }>>(
      `/users/kyc/${userId}/review`,
      dto
    );
    return response.data.data.user;
  },

  /**
   * GET /users/admin/users (Admin only)
   * Fetch platform users with role, kycStatus, and search filters
   */
  async getAdminUsers(
    params?: AdminUsersQueryParams
  ): Promise<AdminUsersResponseData> {
    const response = await api.get<ApiResponse<AdminUsersResponseData>>(
      "/users/admin/users",
      { params }
    );
    return response.data.data;
  },
};

export default userService;
