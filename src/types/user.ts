export type UserRole = "admin" | "superadmin" | "seller" | "buyer" | string;

export type BuyerType = "individual" | "retailer" | "agro_processor" | "institution";

export type KycStatus = "not_submitted" | "pending" | "verified" | "rejected";

export type IdType =
  | "nin"
  | "bvn"
  | "cac"
  | "voters_card"
  | "drivers_license"
  | "national_id";

export interface FarmerKyc {
  farmName?: string;
  farmAddress?: string;
  state?: string;
  lga?: string;
  farmSizeAcres?: number;
  produceSpecialization?: string[];
  idType?: IdType;
  idNumber?: string;
  documentUrls?: string[];
  farmPhotos?: string[];
  status: KycStatus;
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface DeliveryAddress {
  _id: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  lga?: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  role: UserRole;
  buyerType?: BuyerType;
  avatar?: string;
  bio?: string;
  isKycVerified: boolean;
  kyc?: FarmerKyc;
  addresses?: DeliveryAddress[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  buyerType?: BuyerType;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface SubmitKycDto {
  farmName: string;
  farmAddress: string;
  state: string;
  lga: string;
  farmSizeAcres?: number;
  produceSpecialization?: string[];
  idType: IdType;
  idNumber: string;
  documentUrls?: string[];
  farmPhotos?: string[];
}

export interface KycStatusData {
  kycStatus: KycStatus;
  isKycVerified: boolean;
  kyc?: FarmerKyc;
}

export interface ReviewKycDto {
  status: "verified" | "rejected";
  rejectionReason?: string;
}

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  role?: "buyer" | "seller" | "admin" | string;
  kycStatus?: KycStatus;
  search?: string;
}

export interface AdminUsersPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminUsersResponseData {
  users: UserProfile[];
  pagination: AdminUsersPagination;
}

export interface VerifiedSellersQueryParams {
  page?: number;
  limit?: number;
  state?: string;
  lga?: string;
  produce?: string;
}

export interface VerifiedSellersResponseData {
  sellers: Array<{
    _id: string;
    name: string;
    avatar?: string;
    kyc?: FarmerKyc;
    produceSpecialization?: string[];
  }>;
  pagination: AdminUsersPagination;
}
